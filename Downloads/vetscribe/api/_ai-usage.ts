import { restGet, restWrite } from './_auth.js'

export async function checkAiLimit(ctx:any){

  const profiles = await restGet<any[]>(
    ctx,
    `profiles?auth_user_id=eq.${encodeURIComponent(ctx.user.id)}&select=practice_id`
  )

  const profile = profiles[0]

  if(!profile?.practice_id) throw new Error('Practice not found')

  const subscriptions = await restGet<any[]>(
    ctx,
    `subscriptions?practice_id=eq.${profile.practice_id}&status=in.(active,trialing)&select=plan_id`
  )

  const subscription = subscriptions[0]

  if(!subscription) throw new Error('No active subscription found')

  const plans = await restGet<any[]>(
    ctx,
    `subscription_plans?id=eq.${subscription.plan_id}&select=max_ai_consultations`
  )

  const limit = plans[0]?.max_ai_consultations

  if(limit === null) {
    return {
      practiceId: profile.practice_id,
      unlimited: true
    }
  }

  const month = new Date().toISOString().slice(0,7) + '-01'

  const usage = await restGet<any[]>(
    ctx,
    `ai_usage?practice_id=eq.${profile.practice_id}&usage_month=eq.${month}&select=id,ai_consultations_used`
  )

  const used = usage[0]?.ai_consultations_used || 0

  if(used >= limit){
    throw new Error('AI consultation limit reached. Please upgrade your plan.')
  }

  return {
    practiceId: profile.practice_id,
    unlimited:false,
    usageId: usage[0]?.id,
    used
  }
}


export async function incrementAiUsage(ctx:any, usage:any){

  if(usage.unlimited) return

  const month = new Date().toISOString().slice(0,7) + '-01'

  if(usage.usageId){

    await restWrite(
      ctx,
      `ai_usage?id=eq.${usage.usageId}`,
      'PATCH',
      {
        ai_consultations_used: usage.used + 1,
        updated_at: new Date().toISOString()
      }
    )

  }else{

    await restWrite(
      ctx,
      'ai_usage',
      'POST',
      {
        practice_id: usage.practiceId,
        usage_month: month,
        ai_consultations_used: 1
      }
    )

  }
}

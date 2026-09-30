// =====================================================
// VetScribe Subscription Permission Service
// Phase 3 - Central Subscription Logic
// =====================================================


export interface SubscriptionCheckResult {
  allowed: boolean;
  current: number;
  limit: number | string;
  message?: string;
}


export interface SubscriptionStatusResult {
  active: boolean;
  status: string;
  isTrial?: boolean;
  trialEndsAt?: string | null;
  message?: string;
}



// =====================================================
// Get current practice subscription
// =====================================================

export function getCurrentSubscription(
  subscriptions: any[],
  practiceId: string | undefined
) {

  if (!practiceId) return null;


  return subscriptions
    .filter(
      (item:any)=>
        item.practice_id === practiceId
    )
    .sort(
      (a:any,b:any)=>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0] || null;

}



// =====================================================
// Check subscription status
// =====================================================

export function checkSubscriptionStatus(
  subscriptions:any[],
  practiceId:string | undefined
):SubscriptionStatusResult {


  const subscription =
    getCurrentSubscription(
      subscriptions,
      practiceId
    );


  if(!subscription){

    return {
      active:false,
      status:"missing",
      isTrial:false,
      trialEndsAt:null,
      message:
        "No active VetScribe subscription found."
    };

  }



  const status =
    subscription.status
      ?.toLowerCase()
      ?.trim() || "inactive";


  const trialEnd =
    subscription.trial_end ||
    subscription.trialEnd ||
    null;



  // Trial expiry check

  if(
    status === "trialing" &&
    trialEnd
  ){

    const expired =
      new Date(trialEnd).getTime()
      <
      new Date().getTime();


    if(expired){

      return {
        active:false,
        status:"expired",
        isTrial:true,
        trialEndsAt:trialEnd,
        message:
          "Your free trial has ended. Please choose a subscription plan to continue."
      };

    }

  }



  const allowedStatuses = [
    "active",
    "trialing"
  ];


  if(
    !allowedStatuses.includes(status)
  ){

    return {
      active:false,
      status,
      isTrial:false,
      trialEndsAt:trialEnd,
      message:
        `Your VetScribe subscription is ${status}. Please renew your subscription to continue.`
    };

  }



  return {

    active:true,

    status,

    isTrial:
      status === "trialing",

    trialEndsAt:
      trialEnd

  };


}



// =====================================================
// Staff limit checker
// =====================================================

export function canAddStaff(
  currentStaff:number,
  pendingInvites:number,
  maxUsers:number | null
):SubscriptionCheckResult {


  if(!maxUsers){

    return {
      allowed:true,
      current:
        currentStaff + pendingInvites,
      limit:"Unlimited"
    };

  }



  const total =
    currentStaff + pendingInvites;



  if(total >= maxUsers){

    return {

      allowed:false,

      current:total,

      limit:maxUsers,

      message:
        `Your subscription allows maximum ${maxUsers} veterinarians. Please upgrade your plan.`

    };

  }



  return {

    allowed:true,

    current:total,

    limit:maxUsers

  };


}



// =====================================================
// Patient limit checker
// =====================================================

export function canAddPatient(
  currentPatients:number,
  maxPatients:number | null
):SubscriptionCheckResult {


  if(!maxPatients){

    return {
      allowed:true,
      current:currentPatients,
      limit:"Unlimited"
    };

  }



  if(currentPatients >= maxPatients){

    return {

      allowed:false,

      current:
        currentPatients,

      limit:
        maxPatients,

      message:
        `Your subscription allows maximum ${maxPatients} patients. Please upgrade your plan.`

    };

  }



  return {

    allowed:true,

    current:
      currentPatients,

    limit:
      maxPatients

  };


}




// =====================================================
// AI consultation limit checker
// =====================================================

export function canGenerateAIConsultation(
  currentUsage:number,
  maxAI:number | null
):SubscriptionCheckResult {


  if(!maxAI){

    return {

      allowed:true,

      current:
        currentUsage,

      limit:
        "Unlimited"

    };

  }



  if(currentUsage >= maxAI){

    return {

      allowed:false,

      current:
        currentUsage,

      limit:
        maxAI,

      message:
        `Your subscription allows maximum ${maxAI} AI consultations. Please upgrade your plan.`

    };

  }



  return {

    allowed:true,

    current:
      currentUsage,

    limit:
      maxAI

  };


}



// =====================================================
// Usage summary for UI
// =====================================================

export function getUsageSummary(
  staff:number,
  patients:number,
  ai:number,
  plan:any
){

  return {

    staff:{
      current:staff,
      limit:
        plan?.max_users ?? "Unlimited"
    },


    patients:{
      current:patients,
      limit:
        plan?.max_patients ?? "Unlimited"
    },


    ai:{
      current:ai,
      limit:
        plan?.max_ai_consultations ?? "Unlimited"
    }

  };

}


export function checkSubscriptionLimit(
  subscription:any,
  plan:any,
  type:string,
  current:number
):SubscriptionCheckResult {

  if(!subscription || !plan){
    return {
      allowed:false,
      current:0,
      limit:0,
      message:"No active subscription found."
    };
  }


  let limit:any = null;


  if(type === "users"){
    limit = plan.max_users;
  }

  if(type === "clients"){
    limit = plan.max_clients;
  }

  if(type === "patients"){
    limit = plan.max_patients;
  }

  if(type === "ai"){
    limit = plan.max_ai_consultations;
  }


  if(limit === null || limit === undefined){
    return {
      allowed:true,
      current,
      limit:"Unlimited"
    };
  }


  if(current >= limit){
    return {
      allowed:false,
      current,
      limit,
      message:
        `Your subscription allows maximum ${limit} ${type}. Please upgrade your plan.`
    };
  }


  return {
    allowed:true,
    current,
    limit
  };

}
// =====================================================
// Require active subscription before protected actions
// =====================================================

export function requireActiveSubscription(
  status: SubscriptionStatusResult
){

  if(!status.active){

    throw new Error(
      status.message ||
      "Your VetScribe subscription is inactive. Please upgrade to continue."
    );

  }

  return true;

}


// =====================================================
// Downgrade usage checker
// Keeps existing data safe after plan downgrade
// =====================================================

export function checkDowngradeStatus(
  currentUsers:number,
  currentPatients:number,
  plan:any
){

  const exceeded:any[] = [];


  if(
    plan?.max_users !== null &&
    plan?.max_users !== undefined &&
    currentUsers > plan.max_users
  ){

    exceeded.push({
      type:"Veterinarians",
      current:currentUsers,
      limit:plan.max_users
    });

  }


  if(
    plan?.max_patients !== null &&
    plan?.max_patients !== undefined &&
    currentPatients > plan.max_patients
  ){

    exceeded.push({
      type:"Patients",
      current:currentPatients,
      limit:plan.max_patients
    });

  }


  return {
    exceeded: exceeded.length > 0,
    items: exceeded
  };

}

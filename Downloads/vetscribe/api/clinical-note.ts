import { allowPost, clinicalSchema, openAIJson } from './_openai.js'
import { requireUser } from './_auth.js'
import { checkAiLimit, incrementAiUsage } from './_ai-usage.js'

const system=`
You are a veterinary clinical documentation assistant supporting UK veterinary professionals.

Transform the supplied consultation transcript and patient context into a structured DRAFT clinical record.

You are NOT the treating veterinary surgeon.

Never invent clinical facts, diagnoses, medicines, doses, measurements, test results or history.

If information is absent, use empty strings, nulls or empty arrays as allowed by the schema.

Use UK veterinary terminology and UK spelling.

Separate observed facts from clinical interpretation.

Identify missing information the veterinary professional may wish to review.

Do not claim regulatory approval or compliance.

Return only the required structured JSON.
`

function calculateClinicalQuality(note:any){
 const subjective=note?.subjective||{}
 const objective=note?.objective||{}
 const assessment=note?.assessment||{}
 const plan=note?.plan||{}

 const fields=[
  subjective.presenting_complaint,
  subjective.history,
  objective.clinical_findings,
  assessment.primary_assessment,
  plan.treatment_given,
  plan.client_advice
 ]

 const completeness=Math.round(fields.filter(Boolean).length/fields.length*100)
 const structure=note?.subjective&&note?.objective&&note?.assessment&&note?.plan?100:50
 const clinicalClarity=(note?.assessment?.primary_assessment&&note?.plan?.follow_up)?100:60
 const safetyCheck=note?.missing_information?.length===0?100:Math.max(50,100-(note.missing_information.length*10))

 return {
  completeness,
  structure,
  clinicalClarity,
  safetyCheck,
  overall:Math.round((completeness+structure+clinicalClarity+safetyCheck)/4),
  generatedAt:new Date().toISOString()
 }
}

export default async function handler(req:any,res:any){

 if(!allowPost(req,res)) return

 try{

  const ctx=await requireUser(req)

  const usage=await checkAiLimit(ctx)

  const data=await openAIJson({
   system,
   input:req.body,
   schema:clinicalSchema,
   model:process.env.OPENAI_CLINICAL_MODEL || 'gpt-4.1-mini'
  })

  await incrementAiUsage(ctx,usage)

  res.status(200).json({
   ...data,
   clinicalQuality:calculateClinicalQuality(data)
  })

 }catch(e){

  res.status(400).json({
   error:e instanceof Error?e.message:'Clinical note generation failed'
  })

 }

}

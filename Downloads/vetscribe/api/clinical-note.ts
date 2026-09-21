import { 
  allowPost, 
  clinicalSchema, 
  openAIJson 
} from './_openai.js'

import { 
  requireUser 
} from './_auth.js'


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

  const subjective =
    note?.subjective || {};

  const objective =
    note?.objective || {};

  const assessment =
    note?.assessment || {};

  const plan =
    note?.plan || {};



  const completenessFields = [

    subjective.presenting_complaint,

    subjective.history,

    objective.clinical_findings,

    assessment.primary_assessment,

    plan.treatment_given,

    plan.client_advice

  ];



  const completeness =
    Math.round(
      (
        completenessFields.filter(Boolean).length /
        completenessFields.length
      ) * 100
    );



  const structure =
    note?.subjective &&
    note?.objective &&
    note?.assessment &&
    note?.plan

    ? 100

    : 50;



  const clinicalClarity =
    (
      note?.assessment?.primary_assessment &&
      note?.plan?.follow_up
    )

    ? 100

    : 60;



  const safetyCheck =
    note?.missing_information?.length === 0

    ? 100

    : Math.max(
        50,
        100 -
        (
          note.missing_information.length * 10
        )
      );



  const overall =
    Math.round(
      (
        completeness +
        structure +
        clinicalClarity +
        safetyCheck
      ) / 4
    );



  return {

    completeness,

    structure,

    clinicalClarity,

    safetyCheck,

    overall,

    generatedAt:
      new Date().toISOString()

  };

}



export default async function handler(
req:any,
res:any
){

if(!allowPost(req,res))
return;


try{


const data = await openAIJson({

system,

input:req.body,

schema:clinicalSchema,

model:
process.env.OPENAI_CLINICAL_MODEL ||
'gpt-4.1-mini'

});



const clinicalQuality =
calculateClinicalQuality(data);



res.status(200).json({

...data,

clinicalQuality

});


}


catch(e){

res.status(401).json({

error:
e instanceof Error
? e.message
: 'Clinical note generation failed'

});

}


}
import { allowPost, openAIJson, ownerSchema } from './_openai.js'
import { requireUser, restGet, restWrite } from './_auth.js'

const system = `
Create a plain-English owner summary using ONLY the approved veterinary clinical record supplied.

Do not:
- invent information
- introduce new medical advice
- reveal internal AI confidence
- provide speculative diagnoses
- expose private practice notes

Preserve important safety and follow-up instructions.

The output is a communication summary, not an independent AI diagnosis.

Use UK spelling.

Return only the required structured JSON.
`

export default async function handler(req: any, res: any) {
  if (!allowPost(req, res)) return

  try {
    const ctx = await requireUser(req)

    const consultationId = String(
      req.body?.consultationId || ''
    )

    if (!consultationId) {
      throw new Error('consultationId is required')
    }


    // Fetch consultation
    const consultations = await restGet<any[]>(
      ctx,
      `consultations?id=eq.${encodeURIComponent(
        consultationId
      )}&select=id,practice_id,patient_id,client_id,status`
    )

    const consultation = consultations[0]

    if (
      !consultation ||
      consultation.status !== 'approved'
    ) {
      throw new Error(
        'Owner summary can only be generated from an approved consultation'
      )
    }


    // Fetch approved clinical note
    const notes = await restGet<any[]>(
      ctx,
      `clinical_notes?consultation_id=eq.${encodeURIComponent(
        consultationId
      )}&select=structured_content`
    )

    if (!notes[0]?.structured_content) {
      throw new Error(
        'Approved structured clinical note not found'
      )
    }


    // Fetch patient
    const patients = await restGet<any[]>(
      ctx,
      `patients?id=eq.${encodeURIComponent(
        consultation.patient_id
      )}&select=id,name`
    )

    const patient = patients[0]

    if (!patient) {
      throw new Error('Patient not found')
    }


    // Fetch generating user profile
    const profiles = await restGet<any[]>(
      ctx,
      `profiles?auth_user_id=eq.${encodeURIComponent(
        ctx.user.id
      )}&select=id`
    )

    const profile = profiles[0]

    if (!profile) {
      throw new Error('Practice profile not found')
    }


    // Generate owner summary
    const data = await openAIJson({
      system,
      input: {
        patient,
        approvedClinicalRecord:
          notes[0].structured_content
      },
      schema: ownerSchema,
      model:
        process.env.OPENAI_SUMMARY_MODEL ||
        process.env.OPENAI_CLINICAL_MODEL ||
        'gpt-4.1-mini'
    })


    // Prepare structured summary
    const id = crypto.randomUUID()
    const generatedAt =
      new Date().toISOString()

    const structured = {
      id,
      practiceId: consultation.practice_id,
      consultationId: consultation.id,
      patientId: consultation.patient_id,
      clientId: consultation.client_id,

      title: data.title,
      whatWeFound: data.what_we_found,
      whatWeDiscussed: data.what_we_discussed,
      treatmentAndMedication:
        data.treatment_and_medication,
      whatToDoAtHome:
        data.what_to_do_at_home,
      whenToContactUs:
        data.when_to_contact_us,
      followUp: data.follow_up,

      generatedAt,
      generatedBy: profile.id
    }


    // Save owner summary
    await restWrite(
      ctx,
      'owner_summaries',
      'POST',
      {
        id,

        practice_id:
          consultation.practice_id,

        consultation_id:
          consultation.id,

        patient_id:
          consultation.patient_id,

        client_id:
          consultation.client_id,

        summary_text: [
          structured.whatWeFound,
          structured.whatWeDiscussed,
          structured.treatmentAndMedication,
          structured.whatToDoAtHome,
          structured.whenToContactUs,
          structured.followUp
        ].join('\n\n'),

        structured_content:
          structured,

        ai_model:
          process.env.OPENAI_SUMMARY_MODEL ||
          process.env.OPENAI_CLINICAL_MODEL ||
          'configured-model',

        generated_at:
          generatedAt,

        generated_by:
          profile.id
      }
    )


    res.status(200).json(structured)

  } catch (e) {

    res.status(400).json({
      error:
        e instanceof Error
          ? e.message
          : 'Owner summary generation failed'
    })

  }
}
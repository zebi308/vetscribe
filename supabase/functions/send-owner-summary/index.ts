/*
 * ============================================================
 * SUPABASE CORS HEADERS
 * ============================================================
 *
 * IMPORTANT:
 * Use Supabase's maintained CORS header set instead of a
 * manually maintained list. This keeps the function compatible
 * with headers sent by current supabase-js browser clients.
 *
 * ============================================================
 */

import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";


/*
 * ============================================================
 * SEND OWNER SUMMARY EDGE FUNCTION
 * ============================================================
 *
 * Flow:
 *
 * Frontend
 *    ↓
 * Supabase Edge Function
 *    ↓
 * Resend HTTP API
 *    ↓
 * Email sent
 *    ↓
 * Explicit JSON success response
 *
 * ============================================================
 */


/*
 * ============================================================
 * HELPER: JSON RESPONSE
 * ============================================================
 */

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {

  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );

}



/*
 * ============================================================
 * EDGE FUNCTION
 * ============================================================
 */

Deno.serve(async (req) => {


  /*
   * ==========================================================
   * CORS PREFLIGHT
   * ==========================================================
   */

  if (req.method === "OPTIONS") {

    return new Response(
      "ok",
      {
        status: 200,
        headers: corsHeaders
      }
    );

  }



  /*
   * ==========================================================
   * ONLY POST REQUESTS
   * ==========================================================
   */

  if (req.method !== "POST") {

    return jsonResponse(
      {
        success: false,
        error: "Method not allowed"
      },
      405
    );

  }



  try {


    /*
     * ========================================================
     * GET RESEND API KEY
     * ========================================================
     */

    const resendApiKey =
      Deno.env.get("RESEND_API_KEY");


    if (!resendApiKey) {

      console.error(
        "RESEND_API_KEY is missing."
      );


      return jsonResponse(
        {
          success: false,
          error:
            "Email service is not configured. RESEND_API_KEY is missing."
        },
        500
      );

    }



    /*
     * ========================================================
     * READ REQUEST BODY
     * ========================================================
     */

    let body: Record<string, any>;

    try {

      body = await req.json();

    }
    catch {

      return jsonResponse(
        {
          success: false,
          error: "Invalid JSON request body."
        },
        400
      );

    }



    /*
     * ========================================================
     * EXTRACT DATA
     * ========================================================
     */

    const {
      email,
      ownerName,
      patientName,
      summary
    } = body;



    /*
     * ========================================================
     * VALIDATE EMAIL
     * ========================================================
     */

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {

      return jsonResponse(
        {
          success: false,
          error: "Recipient email missing."
        },
        400
      );

    }



    /*
     * ========================================================
     * VALIDATE SUMMARY
     * ========================================================
     */

    if (
      !summary ||
      typeof summary !== "object"
    ) {

      return jsonResponse(
        {
          success: false,
          error: "Summary data missing."
        },
        400
      );

    }



    /*
     * ========================================================
     * SAFE VALUES
     * ========================================================
     */

    const safeEmail =
      email.trim();


    const safeOwnerName =
      typeof ownerName === "string" &&
      ownerName.trim()
        ? ownerName.trim()
        : "Pet Owner";


    const safePatientName =
      typeof patientName === "string" &&
      patientName.trim()
        ? patientName.trim()
        : "your pet";



    /*
     * ========================================================
     * SUMMARY CONTENT
     * ========================================================
     */

    const whatWeFound =
      summary.whatWeFound ||
      "No information available.";


    const whatWeDiscussed =
      summary.whatWeDiscussed ||
      "No information available.";


    const treatmentAndMedication =
      summary.treatmentAndMedication ||
      "No information available.";


    const whatToDoAtHome =
      summary.whatToDoAtHome ||
      "No information available.";


    const whenToContactUs =
      summary.whenToContactUs ||
      "No information available.";


    const followUp =
      summary.followUp ||
      "No information available.";



    /*
     * ========================================================
     * SEND EMAIL THROUGH RESEND HTTP API
     * ========================================================
     */

    console.log(
      "Sending owner summary email to:",
      safeEmail
    );


    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${resendApiKey}`,

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            from:
              "VetScribe <vetscribe@clariana.co.uk>",

            to: [
              safeEmail
            ],

            subject:
              `${safePatientName}'s consultation summary from VetScribe`,

            html: `

              <!DOCTYPE html>

              <html>

              <head>

                <meta
                  charset="UTF-8"
                />

                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />

                <title>
                  VetScribe Consultation Summary
                </title>

              </head>


              <body style="
                margin:0;
                padding:0;
                background:#f8fafc;
                font-family:Arial,Helvetica,sans-serif;
                color:#334155;
              ">


                <div style="
                  max-width:700px;
                  margin:0 auto;
                  padding:32px 20px;
                ">


                  <div style="
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    border-radius:16px;
                    padding:32px;
                  ">


                    <h2 style="
                      margin:0 0 20px 0;
                      color:#0f172a;
                      font-size:24px;
                    ">

                      VetScribe Consultation Summary

                    </h2>



                    <p>
                      Hello ${safeOwnerName},
                    </p>



                    <p>

                      Thank you for visiting your
                      veterinary practice.

                    </p>



                    <p>

                      Below is the consultation summary
                      for

                      <strong>
                        ${safePatientName}
                      </strong>.

                    </p>



                    <hr style="
                      border:none;
                      border-top:1px solid #e2e8f0;
                      margin:28px 0;
                    "/>



                    <h3 style="
                      color:#0f172a;
                    ">

                      What We Found

                    </h3>


                    <p>
                      ${whatWeFound}
                    </p>



                    <h3 style="
                      color:#0f172a;
                    ">

                      What We Discussed

                    </h3>


                    <p>
                      ${whatWeDiscussed}
                    </p>



                    <h3 style="
                      color:#0f172a;
                    ">

                      Treatment and Medication

                    </h3>


                    <p>
                      ${treatmentAndMedication}
                    </p>



                    <h3 style="
                      color:#0f172a;
                    ">

                      What To Do At Home

                    </h3>


                    <p>
                      ${whatToDoAtHome}
                    </p>



                    <h3 style="
                      color:#0f172a;
                    ">

                      When To Contact Us

                    </h3>


                    <p>
                      ${whenToContactUs}
                    </p>



                    <h3 style="
                      color:#0f172a;
                    ">

                      Follow Up

                    </h3>


                    <p>
                      ${followUp}
                    </p>



                    <hr style="
                      border:none;
                      border-top:1px solid #e2e8f0;
                      margin:28px 0;
                    "/>



                    <p>

                      Regards,

                      <br />

                      <strong>
                        VetScribe
                      </strong>

                    </p>


                  </div>


                </div>


              </body>

              </html>

            `

          })
        }
      );



    /*
     * ========================================================
     * READ RESEND RESPONSE
     * ========================================================
     */

    const resendText =
      await resendResponse.text();


    console.log(
      "Resend HTTP status:",
      resendResponse.status
    );


    console.log(
      "Resend response:",
      resendText
    );



    /*
     * ========================================================
     * RESEND FAILED
     * ========================================================
     */

    if (!resendResponse.ok) {

      let resendError:
        Record<string, any> = {};


      try {

        resendError =
          JSON.parse(
            resendText
          );

      }
      catch {

        resendError = {
          message:
            resendText ||
            "Resend failed to send the email."
        };

      }


      console.error(
        "Resend API error:",
        resendError
      );


      return jsonResponse(
        {
          success: false,

          error:
            resendError.message ||
            resendError.error ||
            "Resend failed to send the email.",

          resendStatus:
            resendResponse.status
        },
        500
      );

    }



    /*
     * ========================================================
     * PARSE SUCCESS RESPONSE
     * ========================================================
     */

    let resendData:
      Record<string, any> = {};


    try {

      resendData =
        JSON.parse(
          resendText
        );

    }
    catch {

      resendData = {};

    }



    /*
     * ========================================================
     * EMAIL SUCCESS
     * ========================================================
     */

    console.log(
      "Owner summary email sent successfully."
    );


    console.log(
      "Resend email ID:",
      resendData.id || null
    );



    /*
     * IMPORTANT:
     *
     * Always return HTTP 200 after Resend has
     * successfully accepted the email.
     *
     * This is what the frontend uses to determine
     * that the operation succeeded.
     */

    return jsonResponse(
      {
        success: true,

        message:
          "Email sent successfully.",

        id:
          resendData.id || null
      },
      200
    );


  }

  catch (error) {


    /*
     * ========================================================
     * UNEXPECTED ERROR
     * ========================================================
     */

    console.error(
      "send-owner-summary unexpected error:",
      error
    );


    return jsonResponse(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error while sending email."
      },
      500
    );

  }

});
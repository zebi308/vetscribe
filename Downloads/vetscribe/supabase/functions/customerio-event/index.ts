import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CUSTOMERIO_REGION_URL = "https://track.customer.io";

serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get("CUSTOMERIO_WEBHOOK_SECRET");

const incomingSecret = req.headers.get(
  "x-customerio-webhook-secret"
);

if (!webhookSecret || incomingSecret !== webhookSecret) {
  return new Response(
    JSON.stringify({
      error: "Unauthorized",
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
    const body = await req.json();

    const siteId = Deno.env.get("CUSTOMERIO_SITE_ID");
    const apiKey = Deno.env.get("CUSTOMERIO_API_KEY");

    if (!siteId || !apiKey) {
      throw new Error("Customer.io credentials missing");
    }

    const authHeader =
      "Basic " + btoa(`${siteId}:${apiKey}`);

    /*
      ACTION 1:
      Identify / create Customer.io person
    */

    if (body.action === "identify_user") {
      const response = await fetch(
        `${CUSTOMERIO_REGION_URL}/api/v1/customers/${body.user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: body.email,
            ...body.attributes,
          }),
        }
      );

      const result = await response.text();

      return new Response(result, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }


    /*
      ACTION 2:
      Track Customer.io event
    */

    if (body.action === "track_event") {
      const response = await fetch(
        `${CUSTOMERIO_REGION_URL}/api/v1/events`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: body.event,
            userId: body.user_id,
            data: body.properties || {},
          }),
        }
      );

      const result = await response.text();

      return new Response(result, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }


    return new Response(
      JSON.stringify({
        error: "Invalid action",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
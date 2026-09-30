/**
 * ============================================================
 * VETSCRIBE - STRIPE WEBHOOK
 * Supabase Edge Function
 * ============================================================
 *
 * Stripe is the billing source of truth.
 *
 * Handles:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 *
 * Updates:
 * - subscriptions
 * - invoices
 * - payments
 * - subscription vouchers
 * ============================================================
 */

import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";
import { createClient } from "npm:@supabase/supabase-js@^2";
import Stripe from "npm:stripe@^17.0.0";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function unixToISOString(timestamp: number | null | undefined) {
  return timestamp
    ? new Date(timestamp * 1000).toISOString()
    : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecret || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
      return jsonResponse(
        { success: false, error: "Missing server configuration" },
        500
      );
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
    });

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const signature = req.headers.get("stripe-signature")?.trim();
    console.log("SIGNATURE EXISTS:", !!signature);
    console.log("SECRET EXISTS:", !!webhookSecret);
    console.log("SECRET START:", webhookSecret?.substring(0,8));

    if (!signature) {
      return jsonResponse(
        { success: false, error: "Missing Stripe signature" },
        400
      );
    }

    const rawBody = await req.text();

    console.log("Stripe webhook received, verifying signature...");

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Webhook verification failed", error);
      return jsonResponse(
        { success: false, error: "Invalid webhook signature" },
        400
      );
    }

    console.log("Stripe event:", event.type);

    /**
     * ============================================================
     * CHECKOUT SESSION COMPLETED
     * ============================================================
     */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const practiceId = session.metadata?.practice_id;
      const planId = session.metadata?.plan_id;
      const voucherCode = session.metadata?.voucher_code || null;

      const stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : null;
console.log("CHECKOUT METADATA:", session.metadata);
console.log("SUBSCRIPTION ID:", stripeSubscriptionId);
console.log("CUSTOMER ID:", session.customer);
      if (practiceId && stripeSubscriptionId) {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId
        );

        const { data: insertedSubscription, error: subscriptionInsertError } =
          await supabase.from("subscriptions").upsert(
          {
            practice_id: practiceId,
            plan_id: planId,
            status: stripeSubscription.status,
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id: stripeSubscription.id,
            start_date: new Date(
              stripeSubscription.start_date * 1000
            ).toISOString(),
            renewal_date: new Date(
              stripeSubscription.current_period_end * 1000
            ).toISOString(),
            trial_start: stripeSubscription.trial_start
              ? new Date(
                  stripeSubscription.trial_start * 1000
                ).toISOString()
              : null,
            trial_end: stripeSubscription.trial_end
              ? new Date(stripeSubscription.trial_end * 1000).toISOString()
              : null,
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            voucher_code: voucherCode,
          },
          {
            onConflict: "practice_id",
          }
        );

        console.log("SUBSCRIPTION UPSERT RESULT:", insertedSubscription);
        if (subscriptionInsertError) {
          console.error("SUBSCRIPTION UPSERT ERROR:", subscriptionInsertError);
          return jsonResponse({
            success: false,
            error: subscriptionInsertError.message
          }, 500);
        }

        /**
         * Voucher usage update
         */
        if (voucherCode) {
          await supabase.rpc("increment_voucher_usage", {
            voucher_code_input: voucherCode,
          });
        }
      }
    }

    /**
     * ============================================================
     * SUBSCRIPTION CREATED
     * ============================================================
     */
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;
      const practiceId = subscription.metadata?.practice_id;

      if (practiceId) {
        await supabase.from("subscriptions").upsert(
          {
            practice_id: practiceId,
            plan_id: subscription.metadata?.plan_id,
            status: subscription.status,
            stripe_customer_id:
              typeof subscription.customer === "string"
                ? subscription.customer
                : null,
            stripe_subscription_id: subscription.id,
            start_date: new Date(
              subscription.start_date * 1000
            ).toISOString(),
            renewal_date: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            trial_start: subscription.trial_start
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
          {
            onConflict: "practice_id",
          }
        );
      }
    }

    /**
     * ============================================================
     * SUBSCRIPTION UPDATED
     * ============================================================
     */
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const practiceId = subscription.metadata?.practice_id;

      if (practiceId) {
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            renewal_date: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            trial_start: subscription.trial_start
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })
          .eq("practice_id", practiceId);
      }
    }

    /**
     * ============================================================
     * SUBSCRIPTION CANCELLED
     * ============================================================
     */
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const practiceId = subscription.metadata?.practice_id;

      if (practiceId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("practice_id", practiceId);
      }
    }

    /**
     * ============================================================
     * INVOICE PAID
     * ============================================================
     */
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : null;

      let subscriptionData:any = null;

      if (subscriptionId) {
        const { data } = await supabase
          .from("subscriptions")
          .select("id, practice_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        subscriptionData = data;
      }

      const { error: invoiceError } = await supabase
        .from("invoices")
        .upsert({
          practice_id: subscriptionData?.practice_id || null,
          subscription_id: subscriptionData?.id || null,
          stripe_invoice_id: invoice.id,
          invoice_number: invoice.number || invoice.id,
          hosted_invoice_url: invoice.hosted_invoice_url || null,
          amount: (invoice.amount_paid || 0) / 100,
          currency: invoice.currency?.toUpperCase() || "GBP",
          status: "paid",
          paid_at: new Date().toISOString(),
        }, {
          onConflict: "stripe_invoice_id"
        });

      if (invoiceError) {
        console.error("INVOICE INSERT ERROR:", invoiceError);
      }

      const { error: paymentError } = await supabase
        .from("payments")
        .upsert({
          invoice_id: null,
          practice_id: subscriptionData?.practice_id || null,
          amount: (invoice.amount_paid || 0) / 100,
          payment_method: "stripe",
          transaction_id: invoice.payment_intent
            ? String(invoice.payment_intent)
            : invoice.id,
          status: "completed",
          paid_at: new Date().toISOString(),
        }, {
          onConflict: "transaction_id"
        });

      if (paymentError) {
        console.error("PAYMENT INSERT ERROR:", paymentError);
      }

      console.log("Invoice paid:", invoice.id);
    }

    /**
     * ============================================================
     * FAILED PAYMENT
     * ============================================================
     */
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : null;

      if (subscriptionId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
          })
          .eq("stripe_subscription_id", subscriptionId);
      }
    }

    /**
     * ============================================================
     * RETURN SUCCESS
     * ============================================================
     */
    return jsonResponse({
      received: true,
      event: event.type,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});
// VetScribe SubscriptionPage UI upgrade build
// Existing Stripe, voucher, trial, referral and usage logic preserved.

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useAppState } from "../lib/AppState";
import { checkDowngradeStatus } from "../lib/services/subscriptionService";

export function SubscriptionPage() {

  const {
    practice,
    subscriptions,
    subscriptionPlans,
    invoices,
    payments,
    profiles,
    patients,
    currentUser,
    aiUsage = []
  } = useAppState();



  const currentSubscription =
    subscriptions.find(
      (item:any) =>
        (item.practice_id === practice?.id ||
         item.practiceId === practice?.id) &&
        ["active", "trialing"].includes(item.status)
    );


  const currentPlan =
    subscriptionPlans.find(
      (plan:any) =>
        plan.id === currentSubscription?.plan_id
    );

  const isTrial =
    currentSubscription?.status === "trialing";

  const trialEndDate =
    currentSubscription?.trial_end
      ? new Date(currentSubscription.trial_end).toLocaleDateString()
      : null;

  const daysRemaining = currentSubscription?.trial_end
    ? Math.max(0, Math.ceil((new Date(currentSubscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
    
const standardTrialDays =
  currentSubscription?.trial_days || 14;

const referralBonusDays =
  currentSubscription?.referral_bonus_days || 0;

const totalTrialDays =
  standardTrialDays + referralBonusDays;

  const subscriptionStatus = currentSubscription?.status || "inactive";


  const currentAIUsage =
  (aiUsage || []).find(
    (item:any) =>
      item.practice_id === practice?.id
  );



  const practiceInvoices =
    invoices.filter(
      (invoice:any) =>
        invoice.practice_id === practice?.id
    );




  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<{
    success:boolean;
    message:string;
    trialDays?:number;
  } | null>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const isPracticeManager =
    [
      "practice_manager",
      "practice manager",
      "Practice Manager"
    ].includes(currentUser?.role || "");


  async function validateVoucher(){

    if(!voucherCode.trim()){
      setVoucherStatus({
        success:false,
        message:"Please enter a voucher code."
      });
      return;
    }

    try{

      setVoucherLoading(true);

      const { supabase } = await import("../lib/supabase");
      if (!supabase) throw new Error("Supabase not configured");

      const { data, error } =
        await supabase
        .from("subscription_vouchers")
        .select("*")
        .eq(
          "code",
          voucherCode.trim().toUpperCase()
        )
        .eq("is_active", true)
        .maybeSingle();


      if(error || !data){

        setVoucherStatus({
          success:false,
          message:"Invalid voucher code."
        });

        return;
      }


      const expired =
        data.expires_at &&
        new Date(data.expires_at) < new Date();


      const limitReached =
        data.max_uses &&
        data.used_count >= data.max_uses;


      if(expired || limitReached){

        setVoucherStatus({
          success:false,
          message:"This voucher is no longer available."
        });

        return;
      }


      setVoucherStatus({
        success:true,
        trialDays:data.trial_days,
        message:`Voucher applied successfully. ${data.trial_days} days free trial added.`
      });


    }catch(error){

      console.error("Voucher validation error:",error);

      setVoucherStatus({
        success:false,
        message:"Unable to validate voucher."
      });

    }finally{

      setVoucherLoading(false);

    }

  }


  async function startCheckout(planId:string){
    if(!isPracticeManager) return;

    if(voucherCode.trim() && !voucherStatus?.success){
      alert("Please apply and validate your voucher before checkout.");
      return;
    }

    try{
      setCheckoutLoading(planId);

      const { supabase } = await import("../lib/supabase");
      if (!supabase) throw new Error("Supabase not configured");

      const { data, error } =
        await supabase.functions.invoke(
          "create-checkout-session",
          {
            body:{
              planId,
              voucherCode
            }
          }
        );

      if(error) throw error;

      if(data?.checkoutUrl){
        // Stripe live checkout redirect
        // The success URL configured in Edge Function should return here
        window.location.assign(data.checkoutUrl);
      }

    }catch(error){
      console.error("Checkout error:", error);
      alert("Unable to start checkout. Please try again.");
    }
    finally{
      setCheckoutLoading(null);
    }
  }


  const practicePayments =
    payments.filter(
      (payment:any) =>
        payment.practice_id === practice?.id
    );



  const currentUsers =
  profiles.filter(
    (user:any)=>
      (user.practiceId === practice?.id ||
       user.practice_id === practice?.id) &&
      user.role === "vet"
  ).length;



  const currentPatients =
    patients.filter(
      (patient:any)=>
        patient.practiceId === practice?.id
    ).length;



  const userLimit =
    currentPlan?.max_users;


  const patientLimit =
    currentPlan?.max_patients;

  const downgradeStatus =
    currentPlan
      ? checkDowngradeStatus(
          currentUsers,
          currentPatients,
          currentPlan
        )
      : {
          exceeded:false,
          items:[]
        };




  const userPercentage =
    userLimit
      ? Math.min((currentUsers / userLimit) * 100,100)
      : 0;



  const patientPercentage =
    patientLimit
      ? Math.min((currentPatients / patientLimit) * 100,100)
      : 0;



  const getUsageMessage = (
    current:number,
    limit:number,
    type:string
  ) => {

    if(!limit) return null;


    if(current >= limit){

      return (
        <p className="mt-2 text-sm text-red-600">
          {type} limit reached. Upgrade your VetScribe plan to add more.
        </p>
      );

    }


    if((current / limit) >= 0.8){

      return (
        <p className="mt-2 text-sm text-amber-600">
          You are approaching your {type.toLowerCase()} limit.
        </p>
      );

    }


    return null;

  };



  const statusBadgeClass =
    subscriptionStatus === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : subscriptionStatus === "trialing"
        ? "border-teal-200 bg-teal-50 text-teal-700"
        : "border-red-200 bg-red-50 text-red-700";


  const progressColor = (percentage:number) =>
    percentage >= 100 ? "bg-red-500" : "bg-[#2d6f69]";


  const aiUsed =
    currentAIUsage?.ai_consultations_used || 0;

  const aiPercentage =
    currentPlan?.max_ai_consultations
      ? Math.min((aiUsed / currentPlan.max_ai_consultations) * 100, 100)
      : 0;


  return (

    <div className="mx-auto max-w-5xl space-y-6 p-6">


      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900">
          VetScribe Subscription
        </h1>

        <div className="mt-1 text-sm text-slate-500">
          Manage your VetScribe subscription, usage and billing information.
        </div>

        {new URLSearchParams(window.location.search).get("success") === "true" && (
          <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
            Payment received. Your subscription is being activated. Please wait a few seconds.
          </div>
        )}

      </div>





      {/* CURRENT PLAN */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {
          currentPlan ? (

            <>

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">

                <div>

                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Current Subscription
                  </div>

                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {currentPlan.name}
                  </div>

                </div>

                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium capitalize ${statusBadgeClass}`}>

                  <span className="h-2 w-2 rounded-full bg-current" />

                  {subscriptionStatus}

                </div>

              </div>


              <div className="space-y-5 p-6">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="text-xs font-medium text-slate-500">
                      Price
                    </div>

                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {currentPlan.price}
                      {" "}
                      {currentPlan.currency || "GBP"}
                      /
                      {currentPlan.billing_cycle}
                    </div>

                  </div>


                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="text-xs font-medium text-slate-500">
                      Renewal Date
                    </div>

                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {
                        currentSubscription?.renewal_date
                          ? new Date(currentSubscription.renewal_date).toLocaleDateString()
                          : currentSubscription?.trial_end
                            ? new Date(currentSubscription.trial_end).toLocaleDateString()
                            : "-"
                      }
                    </div>

                  </div>

                </div>


                {isTrial && (

                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div className="text-base font-semibold text-teal-900">
                        Free Trial
                      </div>

                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal-800">
                        {totalTrialDays} days total access
                      </div>

                    </div>


                    <div className="mt-3 flex flex-wrap gap-2 text-xs">

                      <div className="rounded-lg border border-teal-200 bg-white px-2.5 py-1 text-teal-800">
                        {standardTrialDays} days standard trial
                      </div>

                      {referralBonusDays > 0 && (
                        <div className="rounded-lg border border-teal-200 bg-white px-2.5 py-1 text-teal-800">
                          + {referralBonusDays} days referral bonus
                        </div>
                      )}

                    </div>


                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      {trialEndDate && (
                        <div className="rounded-lg bg-white p-3">

                          <div className="text-xs font-medium text-teal-700">
                            Trial ends
                          </div>

                          <div className="mt-1 font-semibold text-teal-900">
                            {trialEndDate}
                          </div>

                        </div>
                      )}

                      {daysRemaining !== null && (
                        <div className="rounded-lg bg-white p-3">

                          <div className="text-xs font-medium text-teal-700">
                            Remaining
                          </div>

                          <div className="mt-1 font-semibold text-teal-900">
                            {daysRemaining} days
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                )}


                {currentSubscription?.cancel_at_period_end && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Your subscription will cancel at the end of the current billing period.
                  </div>
                )}

              </div>

            </>

          ) : (

            <div className="p-6">

              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current Subscription
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No active VetScribe subscription found.
              </div>

            </div>

          )
        }

      </div>





      {
        downgradeStatus.exceeded && (

          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">

            <div className="text-lg font-semibold text-amber-900">
              Plan limits exceeded
            </div>

            <div className="mt-2 text-sm text-amber-800">
              Your current usage is above your new plan limits.
              Existing data remains safe.
              You cannot add more users or patients until your usage fits your plan.
            </div>

            <div className="mt-4 space-y-2 text-sm text-amber-900">
              {
                downgradeStatus.items.map((item:any,index:number)=>(
                  <div
                    key={index}
                    className="rounded-lg bg-white px-3 py-2"
                  >
                    {item.type}: {item.current} / {item.limit}
                  </div>
                ))
              }
            </div>

          </div>

        )
      }





      {/* AVAILABLE PLANS - PRACTICE MANAGER ONLY */}

      {
        isPracticeManager && (

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-lg font-semibold text-slate-900">
              Available Plans
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Choose the plan that fits your practice. Apply a voucher first if you have one.
            </div>


            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <input
                value={voucherCode}
                onChange={(e)=>{
                  setVoucherCode(e.target.value);
                  setVoucherStatus(null);
                }}
                placeholder="Enter voucher code (optional)"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500"
              />

              <button
                onClick={validateVoucher}
                disabled={voucherLoading}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
              >
                {
                  voucherLoading
                  ? "Checking..."
                  : "Apply Voucher"
                }
              </button>

            </div>

            {
              voucherStatus && (
                <div className={
                  voucherStatus.success
                  ? "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  : "mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                }>
                  {voucherStatus.success ? "✓ " : "✕ "}
                  {voucherStatus.message}
                </div>
              )
            }


            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {
                subscriptionPlans.map((plan:any)=>(

                  <div
                    key={plan.id}
                    className={`flex flex-col rounded-2xl border p-6 transition hover:shadow-md ${
                      plan.id === currentPlan?.id
                        ? "border-[#2d6f69] bg-teal-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="text-xl font-bold text-slate-900">
                        {plan.name}
                      </div>

                      {plan.id === currentPlan?.id && (
                        <div className="shrink-0 rounded-full bg-[#2d6f69] px-2.5 py-1 text-xs font-semibold text-white">
                          Current plan
                        </div>
                      )}

                    </div>

                    <div className="mt-3 text-3xl font-bold text-slate-900">
                      £{plan.price}
                      <span className="text-sm font-normal text-slate-500">
                        /{plan.billing_cycle}
                      </span>
                    </div>

                    <div className="mt-auto pt-5">

                      <button
                        disabled={checkoutLoading===plan.id}
                        onClick={()=>startCheckout(plan.id)}
                        className="w-full rounded-xl bg-[#2d6f69] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245b56] disabled:opacity-60"
                      >
                        {
                          checkoutLoading===plan.id
                          ? "Opening checkout..."
                          : "Choose Plan"
                        }
                      </button>

                    </div>

                  </div>

                ))
              }

            </div>

          </div>

        )
      }





      {/* USAGE (VETERINARIANS, PATIENTS, AI CONSULTATIONS) */}

      {
        currentPlan && (

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-lg font-semibold text-slate-900">
              Usage Overview
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Your usage against the limits of your current plan.
            </div>


            <div className="mt-5 grid gap-4 md:grid-cols-3">


              {/* VETERINARIANS */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="text-xs font-medium text-slate-500">
                  Veterinarians
                </div>

                <div className="mt-1 text-2xl font-bold text-slate-900">

                  {currentUsers}

                  <span className="text-lg font-semibold text-slate-400">
                    {" / "}
                    {userLimit || "Unlimited"}
                  </span>

                </div>

                {
                  userLimit && (

                    <>

                      <div className="mt-3 h-2 rounded-full bg-slate-200">

                        <div
                          className={`h-2 rounded-full ${progressColor(userPercentage)}`}
                          style={{
                            width:`${userPercentage}%`
                          }}
                        />

                      </div>

                      {
                        getUsageMessage(
                          currentUsers,
                          userLimit,
                          "Veterinarian"
                        )
                      }

                    </>

                  )
                }

              </div>


              {/* PATIENTS */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="text-xs font-medium text-slate-500">
                  Patients
                </div>

                <div className="mt-1 text-2xl font-bold text-slate-900">

                  {currentPatients}

                  <span className="text-lg font-semibold text-slate-400">
                    {" / "}
                    {patientLimit || "Unlimited"}
                  </span>

                </div>

                {
                  patientLimit && (

                    <>

                      <div className="mt-3 h-2 rounded-full bg-slate-200">

                        <div
                          className={`h-2 rounded-full ${progressColor(patientPercentage)}`}
                          style={{
                            width:`${patientPercentage}%`
                          }}
                        />

                      </div>

                      {
                        getUsageMessage(
                          currentPatients,
                          patientLimit,
                          "Patient"
                        )
                      }

                    </>

                  )
                }

              </div>


              {/* AI CONSULTATIONS */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="text-xs font-medium text-slate-500">
                  AI Consultations
                </div>

                <div className="mt-1 text-2xl font-bold text-slate-900">

                  {
                    currentPlan.max_ai_consultations
                      ? aiUsed
                      : "Unlimited"
                  }

                  {
                    currentPlan.max_ai_consultations && (

                      <span className="text-lg font-semibold text-slate-400">
                        {" / "}
                        {currentPlan.max_ai_consultations}
                      </span>

                    )
                  }

                </div>

                {
                  currentPlan.max_ai_consultations && (

                    <>

                      <div className="mt-3 h-2 rounded-full bg-slate-200">

                        <div
                          className={`h-2 rounded-full ${progressColor(aiPercentage)}`}
                          style={{
                            width:`${aiPercentage}%`
                          }}
                        />

                      </div>

                      {
                        aiUsed >= currentPlan.max_ai_consultations

                        ?

                        <div className="mt-2 text-sm text-red-600">
                          AI consultation limit reached. Upgrade your VetScribe plan to continue.
                        </div>

                        :

                        <div className="mt-2 text-sm text-slate-600">
                          {
                            currentPlan.max_ai_consultations -
                            aiUsed
                          }
                          {" "}
                          AI consultations remaining this billing period.
                        </div>

                      }

                    </>

                  )
                }

                {
                  !currentPlan.max_ai_consultations && (

                    <div className="mt-2 text-sm text-emerald-600">
                      Unlimited AI consultations included in your Practice Plus plan.
                    </div>

                  )
                }

              </div>


            </div>

          </div>

        )
      }





      {/* FEATURES */}

      {
        currentPlan?.features && (

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="text-lg font-semibold text-slate-900">
              Included Features
            </div>


            {
              Array.isArray(currentPlan.features)

              ?

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {
                  currentPlan.features.map(
                    (feature:string,index:number)=>(

                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >

                        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700">
                          <Check size={12} strokeWidth={3} />
                        </div>

                        <div>
                          {feature}
                        </div>

                      </div>

                    )
                  )
                }

              </div>

              :

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {JSON.stringify(currentPlan.features)}
              </div>

            }

          </div>

        )
      }





      {/* INVOICES */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-lg font-semibold text-slate-900">
          Invoice History
        </div>


        {
          practiceInvoices.length === 0

          ?

          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No invoices available.
          </div>

          :

          <div className="mt-4 space-y-3">

            {
              practiceInvoices.map(
                (invoice:any)=>(

                  <div
                    key={invoice.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                  >

                    <div>

                      <div className="font-semibold text-slate-900">
                        {invoice.invoice_number}
                      </div>

                      <div className="mt-0.5 text-sm text-slate-500">
                        {invoice.currency}
                        {" "}
                        {invoice.amount}
                      </div>

                    </div>

                    <div className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      invoice.status === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {invoice.status}
                    </div>

                  </div>

                )
              )
            }

          </div>

        }

      </div>





      {/* PAYMENTS */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="text-lg font-semibold text-slate-900">
          Payment History
        </div>


        {
          practicePayments.length === 0

          ?

          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No payments available.
          </div>

          :

          <div className="mt-4 space-y-3">

            {
              practicePayments.map(
                (payment:any)=>(

                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                  >

                    <div>

                      <div className="font-medium text-slate-900">
                        Payment
                      </div>

                      <div className="mt-0.5 text-sm capitalize text-slate-500">
                        {payment.payment_method}
                      </div>

                    </div>

                    <div className="font-semibold text-slate-900">
                      {payment.amount}
                    </div>

                  </div>

                )
              )
            }

          </div>

        }

      </div>


    </div>

  );

}
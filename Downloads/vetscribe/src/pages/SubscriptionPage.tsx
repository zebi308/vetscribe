// VetScribe SubscriptionPage UI upgrade build
// Existing Stripe, voucher, trial, referral and usage logic preserved.

import React, { useState } from "react";
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



  return (

    <div className="p-6 space-y-6">


      <div>

        <h1 className="text-2xl font-bold">
          VetScribe Subscription
        </h1>


        <p className="text-gray-500">
          Manage your VetScribe subscription, usage and billing information.
        </p>

        {new URLSearchParams(window.location.search).get("success") === "true" && (
          <p className="mt-3 text-sm text-teal-700">
            Payment received. Your subscription is being activated. Please wait a few seconds.
          </p>
        )}

      </div>





      {/* CURRENT PLAN */}


      <div className="rounded-xl border bg-white p-6">


        <h2 className="mb-4 text-lg font-semibold">
          Current Subscription
        </h2>



        {
          currentPlan ? (

            <div className="space-y-3">


              <div className="text-2xl font-bold">
                {currentPlan.name}
              </div>



              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block mt-1 rounded-full px-3 py-1 text-sm ${
                  subscriptionStatus === "active" || subscriptionStatus === "trialing"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {subscriptionStatus}
                </span>
              </div>

              {isTrial && (
  <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-900 space-y-2">

    <p className="font-semibold text-base">
      Free Trial
    </p>

    <p>
      {standardTrialDays} days standard trial
    </p>

    {referralBonusDays > 0 && (
      <p>
        + {referralBonusDays} days referral bonus
      </p>
    )}

    <div className="border-t border-teal-200 pt-2 font-bold">
      {totalTrialDays} days total access
    </div>

    {trialEndDate && (
      <p className="pt-1">
        Trial ends: {trialEndDate}
      </p>
    )}

    {daysRemaining !== null && (
      <p>
        Remaining: {daysRemaining} days
      </p>
    )}

  </div>
)}

              {currentSubscription?.cancel_at_period_end && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  Your subscription will cancel at the end of the current billing period.
                </div>
              )}




              <div>

                Price:

                <span className="ml-2">

                  {currentPlan.price}
                  {" "}
                  {currentPlan.currency || "GBP"}
                  /
                  {currentPlan.billing_cycle}

                </span>

              </div>




              <div>
  <p className="text-sm text-gray-500">
    Renewal Date
  </p>

  <span className="ml-2">
    {
      currentSubscription?.renewal_date
        ? new Date(currentSubscription.renewal_date).toLocaleDateString()
        : currentSubscription?.trial_end
          ? new Date(currentSubscription.trial_end).toLocaleDateString()
          : "-"
    }
  </span>
</div>



            </div>


          ) : (


            <p className="text-gray-500">
              No active VetScribe subscription found.
            </p>


          )
        }


      </div>






      {
        downgradeStatus.exceeded && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-900">
              Plan limits exceeded
            </h2>

            <p className="mt-2 text-sm text-amber-800">
              Your current usage is above your new plan limits.
              Existing data remains safe.
              You cannot add more users or patients until your usage fits your plan.
            </p>

            <div className="mt-4 space-y-2 text-sm text-amber-900">
              {
                downgradeStatus.items.map((item:any,index:number)=>(
                  <div key={index}>
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

          <div className="rounded-xl border bg-white p-6">

            <h2 className="mb-5 text-lg font-semibold">
              Available Plans
            </h2>

            <div className="mb-5 flex gap-3">

              <input
                value={voucherCode}
                onChange={(e)=>{
                  setVoucherCode(e.target.value);
                  setVoucherStatus(null);
                }}
                placeholder="Enter voucher code (optional)"
                className="flex-1 rounded-lg border px-3 py-2"
              />

              <button
                onClick={validateVoucher}
                disabled={voucherLoading}
                className="rounded-lg bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
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
                <p className={
                  voucherStatus.success
                  ? "mb-5 text-sm text-green-600"
                  : "mb-5 text-sm text-red-600"
                }>
                  {voucherStatus.success ? "✓ " : "✕ "}
                  {voucherStatus.message}
                </p>
              )
            }

            <div className="grid gap-5 md:grid-cols-2">

              {
                subscriptionPlans.map((plan:any)=>(

                  <div
                    key={plan.id}
                    className="rounded-xl border p-5"
                  >

                    <h3 className="text-xl font-bold">
                      {plan.name}
                    </h3>

                    <p className="mt-2 text-2xl font-bold">
                      £{plan.price}
                      <span className="text-sm font-normal text-gray-500">
                        /{plan.billing_cycle}
                      </span>
                    </p>

                    <button
                      disabled={checkoutLoading===plan.id}
                      onClick={()=>startCheckout(plan.id)}
                      className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {
                        checkoutLoading===plan.id
                        ? "Opening checkout..."
                        : "Choose Plan"
                      }
                    </button>

                  </div>

                ))
              }

            </div>

          </div>

        )
      }


      {/* USAGE */}


      {
        currentPlan && (

          <div className="rounded-xl border bg-white p-6">


            <h2 className="mb-5 text-lg font-semibold">
              Usage Overview
            </h2>



            <div className="grid gap-5 md:grid-cols-2">


              <div className="rounded-lg border p-4">


                <p className="text-sm text-gray-500">
                  Veterinarians
                </p>


                <p className="mt-1 text-2xl font-bold">

                  {currentUsers}

                  <span className="text-gray-400 text-lg">
                    /
                    {userLimit || "Unlimited"}
                  </span>

                </p>



                {
                  userLimit && (

                    <>

                    <div className="mt-3 h-2 rounded-full bg-gray-200">

                      <div
                        className="h-2 rounded-full bg-teal-600"
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





              <div className="rounded-lg border p-4">


                <p className="text-sm text-gray-500">
                  Patients
                </p>


                <p className="mt-1 text-2xl font-bold">

                  {currentPatients}

                  <span className="text-gray-400 text-lg">
                    /
                    {patientLimit || "Unlimited"}
                  </span>

                </p>



                {
                  patientLimit && (

                    <>

                    <div className="mt-3 h-2 rounded-full bg-gray-200">

                      <div
                        className="h-2 rounded-full bg-teal-600"
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



            </div>


          </div>

        )
      }





{/* AI USAGE */}

{
  currentPlan && (

    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-5 text-lg font-semibold">
        AI Usage
      </h2>


      <div className="rounded-lg border p-4">


        <p className="text-sm text-gray-500">
          AI Consultations
        </p>


        <p className="mt-1 text-2xl font-bold">

          {
            currentPlan.max_ai_consultations
              ? currentAIUsage?.ai_consultations_used || 0
              : "Unlimited"
          }


          {
            currentPlan.max_ai_consultations && (

              <span className="text-gray-400 text-lg">

                {" / "}
                {currentPlan.max_ai_consultations}

              </span>

            )
          }

        </p>



        {
          currentPlan.max_ai_consultations && (

            <>

              <div className="mt-3 h-2 rounded-full bg-gray-200">


                <div

                  className="h-2 rounded-full bg-teal-600"

                  style={{
                    width:`${
                      Math.min(
                        (
                          ((currentAIUsage?.ai_consultations_used || 0)
                          /
                          currentPlan.max_ai_consultations)
                          *100
                        ),
                        100
                      )
                    }%`
                  }}

                />


              </div>



              {
                (currentAIUsage?.ai_consultations_used || 0)
                >= currentPlan.max_ai_consultations

                ?

                <p className="mt-2 text-sm text-red-600">

                  AI consultation limit reached. Upgrade your VetScribe plan to continue.

                </p>


                :

                <p className="mt-2 text-sm text-gray-600">

                  {
                    currentPlan.max_ai_consultations -
                    (currentAIUsage?.ai_consultations_used || 0)
                  }
                  {" "}
                  AI consultations remaining this billing period.

                </p>

              }


            </>

          )
        }



        {
          !currentPlan.max_ai_consultations && (

            <p className="mt-2 text-sm text-green-600">

              Unlimited AI consultations included in your Practice Plus plan.

            </p>

          )
        }



      </div>


    </div>

  )
}


      {/* FEATURES */}


      {
        currentPlan?.features && (

          <div className="rounded-xl border bg-white p-6">


            <h2 className="mb-4 text-lg font-semibold">
              Included Features
            </h2>


            <div className="space-y-2">


              {
                Array.isArray(currentPlan.features)

                ?

                currentPlan.features.map(
                  (feature:string,index:number)=>(

                    <div key={index}>
                      ✓ {feature}
                    </div>

                  )
                )

                :

                <div>
                  {JSON.stringify(currentPlan.features)}
                </div>

              }


            </div>


          </div>

        )
      }







      {/* INVOICES */}


      <div className="rounded-xl border bg-white p-6">


        <h2 className="mb-4 text-lg font-semibold">
          Invoice History
        </h2>



        {
          practiceInvoices.length === 0

          ?

          <p className="text-gray-500">
            No invoices available.
          </p>


          :

          <div className="space-y-3">


            {
              practiceInvoices.map(
                (invoice:any)=>(

                  <div
                    key={invoice.id}
                    className="rounded-lg border p-4 flex justify-between"
                  >

                    <div>

                      <p className="font-semibold">
                        {invoice.invoice_number}
                      </p>


                      <p className="text-sm text-gray-500">

                        {invoice.currency}
                        {" "}
                        {invoice.amount}

                      </p>


                    </div>


                    <div className="text-sm">

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



      <div className="rounded-xl border bg-white p-6">


        <h2 className="mb-4 text-lg font-semibold">
          Payment History
        </h2>



        {
          practicePayments.length === 0

          ?

          <p className="text-gray-500">
            No payments available.
          </p>


          :

          <div className="space-y-3">


            {
              practicePayments.map(
                (payment:any)=>(

                  <div
                    key={payment.id}
                    className="rounded-lg border p-4 flex justify-between"
                  >


                    <div>

                      <p className="font-medium">
                        Payment
                      </p>


                      <p className="text-sm text-gray-500">

                        {payment.payment_method}

                      </p>


                    </div>


                    <div>

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
import { useState } from "react";
import { useAppState } from "../lib/AppState";
import { supabase } from "../lib/supabase/client";

export function BillingPage(){

  const {
    invoices,
    subscriptions,
    recordBusinessPayment
  } = useAppState();

  const [loading,setLoading] = useState(false);


  const currentSubscription =
    subscriptions?.[0];


  const subscriptionStatus =
    currentSubscription?.status?.toLowerCase() || "";


  const isTrialing =
    subscriptionStatus === "trialing";


  const canCreateInvoice =
    subscriptionStatus === "active";


  const trialDaysLeft = () => {

    if(!currentSubscription?.trial_end){
      return null;
    }

    const end =
      new Date(currentSubscription.trial_end).getTime();

    const now =
      new Date().getTime();

    const days =
      Math.ceil(
        (end-now)/(1000*60*60*24)
      );

    return days > 0 ? days : 0;

  };


  async function handleInvoice(){

    try{

      if(!canCreateInvoice){

        throw new Error(
          "You are currently on a free trial. Invoice generation will be available after your first paid subscription."
        );

      }


      setLoading(true);


      if(!currentSubscription){

        throw new Error(
          "No subscription found"
        );

      }


      if(!currentSubscription.stripe_customer_id){

        throw new Error(
          "Stripe customer ID missing"
        );

      }


      const invoiceData = {

        practice_id:
        currentSubscription.practice_id,

        stripe_customer_id:
        currentSubscription.stripe_customer_id,

        amount:
        currentSubscription.price,

        currency:"gbp"

      };

      if(!supabase) throw new Error("Supabase not configured");
      const {data,error} =
      await supabase.functions.invoke(
        "create-invoice",
        {
          body: invoiceData
        }
      );


      if(error){

        throw error;

      }


      console.log(
        "CREATED INVOICE:",
        data
      );


      window.location.reload();


    }
    catch(error:any){

      console.error(
        "CREATE INVOICE ERROR:",
        error
      );


      alert(
        error.message ||
        "Invoice creation failed"
      );

    }
    finally{

      setLoading(false);

    }

  }



  async function handlePayment(invoice:any){

    await recordBusinessPayment({

      invoice_id:invoice.id,

      amount:invoice.amount,

      status:"completed",

      payment_method:"manual"

    });

  }



  return (

    <div className="space-y-8">


      <h1 className="text-3xl font-bold">
        Billing Management
      </h1>



      <div className="rounded-2xl border bg-white p-6 space-y-3">

        <h2 className="text-xl font-bold">
          Current Subscription
        </h2>


        {currentSubscription ? (

          <>

          <p>
            Status: {currentSubscription.status}
          </p>

          <p>
            Plan:
            {" "}
            {currentSubscription.plan_name ||
             currentSubscription.plan?.name ||
             "Current Plan"}
          </p>


          {isTrialing && (

            <p className="text-orange-600">

              Free trial remaining:
              {" "}
              {trialDaysLeft()} days

            </p>

          )}


          </>

        ) : (

          <p>
            No subscription found
          </p>

        )}

      </div>



      <div className="grid md:grid-cols-3 gap-6">


        <div className="rounded-2xl border bg-white p-6">

          Active subscriptions

          <h2 className="text-3xl font-bold">

          {
          subscriptions?.filter(
            (x:any)=>
            x.status==="active" ||
            x.status==="trialing"
          ).length || 0
          }

          </h2>

        </div>



        <div className="rounded-2xl border bg-white p-6">

          Invoices

          <h2 className="text-3xl font-bold">

          {invoices?.length || 0}

          </h2>

        </div>


      </div>



      {isTrialing && (

        <div className="rounded-xl border p-4 bg-yellow-50">

          You are currently on a free trial.
          Invoice generation will be available after your first paid subscription.

        </div>

      )}



      <button

        disabled={
          loading ||
          !canCreateInvoice
        }

        onClick={handleInvoice}

        className="rounded-xl bg-teal-600 px-5 py-3 text-white disabled:opacity-50"

      >

        {
        loading
        ? "Generating..."
        : "Generate Invoice"
        }

      </button>




      <div className="rounded-2xl border bg-white p-6 space-y-3">


      {invoices?.map((invoice:any)=>(

        <div

        key={invoice.id}

        className="flex justify-between border rounded-xl p-4"

        >

          <div>

            <p className="font-semibold">

            {invoice.invoice_number}

            </p>


            <p>

            {invoice.currency} {invoice.amount}

            </p>

          </div>


          <button

          onClick={()=>handlePayment(invoice)}

          className="rounded-lg bg-green-600 px-3 py-2 text-white"

          >

          Record Payment

          </button>


        </div>

      ))}


      </div>


    </div>

  );

}

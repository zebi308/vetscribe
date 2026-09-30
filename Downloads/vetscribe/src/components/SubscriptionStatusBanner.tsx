import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAppState } from "../lib/AppState";

export default function SubscriptionStatusBanner() {

  const {
    checkSubscriptionStatus
  } = useAppState();

  const navigate = useNavigate();


  const subscription = checkSubscriptionStatus();


  if (!subscription) {
    return null;
  }


  // Active subscription
  if (subscription.active) {
    return null;
  }


  const noSubscription =
    subscription.status === "missing";



  return (

    <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4">


      <div className="flex items-start gap-3">


        <AlertTriangle
          size={22}
          className="mt-1 text-amber-600"
        />


        <div className="flex-1">


          <h3 className="font-semibold text-amber-900">

            {
              noSubscription
              ?
              "VetScribe Subscription Setup Required"
              :
              "VetScribe Subscription Expired"
            }

          </h3>



          <p className="mt-1 text-sm text-amber-800">


            {
              noSubscription

              ?

              "Your practice does not have an active VetScribe subscription yet. Please contact your administrator to activate your plan."

              :

              (
                subscription.message ||
                "Your VetScribe subscription is no longer active. Please renew your plan to continue using all features."
              )

            }


          </p>




          <button

            onClick={() =>
              navigate("/dashboard/subscriptions")
            }

            className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"

          >

            View Subscription

          </button>


        </div>


      </div>


    </div>

  );

}
/**
 * VetScribe - Create Checkout Session
 * Supabase Edge Function
 *
 * Professional SaaS Billing Flow:
 * Auth User
 * → Profile Check
 * → Practice Manager Permission
 * → Plan Validation
 * → Voucher Validation
 * → Stripe Checkout
 */

import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";
import { createClient } from "npm:@supabase/supabase-js@^2";
import Stripe from "npm:stripe@^17.0.0";


function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers:{
        ...corsHeaders,
        "Content-Type":"application/json"
      }
    }
  );
}



Deno.serve(async(req)=>{


  if(req.method==="OPTIONS"){
    return new Response("ok",{
      status:200,
      headers:corsHeaders
    });
  }



  if(req.method!=="POST"){
    return jsonResponse(
      {
        success:false,
        error:"Method not allowed"
      },
      405
    );
  }



try{


const stripeKey =
Deno.env.get("STRIPE_SECRET_KEY");

const supabaseUrl =
Deno.env.get("SUPABASE_URL");

const serviceKey =
Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const appUrl =
Deno.env.get("APP_URL");



if(
!stripeKey ||
!supabaseUrl ||
!serviceKey ||
!appUrl
){

return jsonResponse(
{
success:false,
error:"Server configuration missing"
},
500
);

}



const stripe =
new Stripe(
stripeKey,
{
apiVersion:"2024-06-20"
}
);



const supabase =
createClient(
supabaseUrl,
serviceKey,
{
auth:{
autoRefreshToken:false,
persistSession:false
}
}
);





// AUTH USER

const authHeader =
req.headers.get("Authorization");


if(!authHeader){

return jsonResponse(
{
success:false,
error:"Unauthorized"
},
401
);

}



const token =
authHeader.replace(
"Bearer ",
""
);



const {
data:userData,
error:userError
}
=
await supabase.auth.getUser(token);



if(
userError ||
!userData.user
){

return jsonResponse(
{
success:false,
error:"Invalid user session"
},
401
);

}



const user =
userData.user;





// PROFILE

const {
data:profile,
error:profileError
}
=
await supabase
.from("profiles")
.select(
"id,practice_id,email,role"
)
.eq(
"auth_user_id",
user.id
)
.single();



if(
profileError ||
!profile
){

return jsonResponse(
{
success:false,
error:"Profile not found"
},
400
);

}




// ONLY PRACTICE MANAGER

if(
profile.role !== "practice_manager"
){

return jsonResponse(
{
success:false,
error:
"Only practice managers can manage subscriptions"
},
403
);

}





const body =
await req.json();



const planId =
body.planId;



const voucherInput =
body.voucherCode
?.trim()
?.toUpperCase()
||
null;



if(
typeof planId !== "string"
){

return jsonResponse(
{
success:false,
error:"Invalid plan selection"
},
400
);

}





// DEFAULT TRIAL

let trialDays = 14;

let appliedVoucher:any = null;





// VALIDATE VOUCHER

if(voucherInput){


const {
data:voucher
}
=
await supabase
.from("subscription_vouchers")
.select("*")
.eq(
"code",
voucherInput
)
.eq(
"is_active",
true
)
.maybeSingle();



if(voucher){


const expired =
voucher.expires_at &&
new Date(voucher.expires_at)
<
new Date();



const limitReached =
voucher.max_uses &&
voucher.used_count >= voucher.max_uses;



if(
!expired &&
!limitReached
){

trialDays =
voucher.trial_days ||
trialDays;


appliedVoucher =
voucher;

}

}

}

// LOAD PLAN

const {
data:plan,
error:planError
}
=
await supabase
.from("subscription_plans")
.select("*")
.eq(
"id",
planId
)
.eq(
"is_active",
true
)
.single();



if(
planError ||
!plan
){

return jsonResponse(
{
success:false,
error:"Plan not found"
},
400
);

}




if(
!plan.stripe_price_id
){

return jsonResponse(
{
success:false,
error:"Stripe price not configured"
},
400
);

}





// LOAD PRACTICE DETAILS

const {
data:practice
}
=
await supabase
.from("practices")
.select(
"name,email"
)
.eq(
"id",
profile.practice_id
)
.single();







// CHECK EXISTING STRIPE CUSTOMER

const {
data:existingSubscription
}
=
await supabase
.from("subscriptions")
.select(
"stripe_customer_id"
)
.eq(
"practice_id",
profile.practice_id
)
.maybeSingle();



let customer;



if(
existingSubscription?.stripe_customer_id
){


const existingCustomer =
await stripe.customers.retrieve(
existingSubscription.stripe_customer_id
);



if(
!existingCustomer.deleted
){

customer =
existingCustomer;

}

}





// CREATE CUSTOMER IF NEEDED

if(!customer){


customer =
await stripe.customers.create({

name:
practice?.name ||
"VetScribe Practice",

email:
practice?.email ||
profile.email,


metadata:{

practice_id:
profile.practice_id,

profile_id:
profile.id

}

});

}






// STRIPE CHECKOUT

console.log("Creating Stripe checkout session", {
  practice_id: profile.practice_id,
  plan_id: plan.id,
  price_id: plan.stripe_price_id,
  trialDays,
  voucher: appliedVoucher?.code ?? null
});

const session =
await stripe.checkout.sessions.create({

mode:"subscription",


customer:
customer.id,



// Voucher users:
 // no card required
// Normal users:
// card collected for future billing

payment_method_collection:"if_required",



payment_method_types:[

"card"

],



line_items:[

{

price:
plan.stripe_price_id,

quantity:1

}

],




success_url:

`${appUrl.replace(/\/$/, "")}/dashboard/subscriptions?success=true`,



cancel_url:

`${appUrl.replace(/\/$/, "")}/dashboard/subscriptions?cancelled=true`,





metadata:{

practice_id:
profile.practice_id,

plan_id:
plan.id,

voucher_code:
appliedVoucher
?
appliedVoucher.code
:
null

},




subscription_data:{

trial_period_days:
trialDays,


metadata:{

practice_id:
profile.practice_id,

plan_id:
plan.id,

voucher_code:
appliedVoucher
?
appliedVoucher.code
:
null

}

}



});







// CREATE PENDING RECORD
// Webhook will make it active/trialing

await supabase
.from("subscriptions")
.upsert(

{

practice_id:
profile.practice_id,


plan_id:
plan.id,


status:
"pending",


stripe_customer_id:
customer.id,


voucher_code:
appliedVoucher
?
appliedVoucher.code
:
null


},


{

onConflict:
"practice_id"

}

);







if (!session.url) {
  console.error("Stripe did not return checkout URL", session);
  return jsonResponse({
    success:false,
    error:"Stripe checkout session URL missing"
  },500);
}

return jsonResponse({

success:true,


checkoutUrl:
session.url,


trialDays,


voucherApplied:
!!appliedVoucher


});





}catch(error){


console.error(
"Checkout error:",
error
);



return jsonResponse(

{

success:false,


error:
error instanceof Error
?
error.message
:
"Unexpected error"

},

500

);


}



});
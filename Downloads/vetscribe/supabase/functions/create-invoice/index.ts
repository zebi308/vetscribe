import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};



const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  {
    apiVersion: "2024-06-20",
  }
);



const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);



Deno.serve(async(req)=>{


try {


  if(req.method === "OPTIONS"){

    return new Response(
      "ok",
      {
        headers:corsHeaders
      }
    );

  }



  let body:any;


  try {


    const text = await req.text();


    if(!text){

      throw new Error("Empty request body");

    }


    body = JSON.parse(text);



  }
  catch(error){

    console.error(
      "JSON BODY ERROR:",
      error
    );


    return new Response(
      JSON.stringify({
        success:false,
        error:"Invalid request body"
      }),
      {
        status:400,
        headers:{
          ...corsHeaders,
          "Content-Type":"application/json"
        }
      }
    );


  }




  const {
    practice_id,
    stripe_customer_id,
    amount,
    currency="gbp"
  } = body;




  console.log(
    "CREATE INVOICE REQUEST:",
    {
      practice_id,
      stripe_customer_id,
      amount,
      currency
    }
  );




  if(!practice_id){

    throw new Error(
      "practice_id missing"
    );

  }



  if(!stripe_customer_id){

    throw new Error(
      "stripe_customer_id missing"
    );

  }




  if(!amount){

    throw new Error(
      "amount missing"
    );

  }





  const invoiceItem =
  await stripe.invoiceItems.create({

    customer:
    stripe_customer_id,


    amount:
    Math.round(Number(amount)*100),


    currency,


    description:
    "VetScribe subscription invoice"

  });




  console.log(
    "INVOICE ITEM CREATED:",
    invoiceItem.id
  );





  const invoice =
await stripe.invoices.create({

  customer:
  stripe_customer_id,


  collection_method:
  "send_invoice",


  days_until_due:
  30,


  pending_invoice_items_behavior:
  "include",


  auto_advance:true

});





  console.log(
    "STRIPE INVOICE CREATED:",
    invoice.id
  );





  const finalized =
  await stripe.invoices.finalizeInvoice(
    invoice.id
  );





  console.log(
    "FINALIZED INVOICE:",
    finalized.id
  );





  const {data,error} =
  await supabase
  .from("invoices")
  .insert({

    practice_id,


    invoice_number:
    finalized.number || finalized.id,


    amount:
    (finalized.amount_due || 0) / 100,


    currency:
    (finalized.currency || currency)
    .toUpperCase(),


    status:
    finalized.status || "open",


    stripe_invoice_id:
    finalized.id,


    hosted_invoice_url:
    finalized.hosted_invoice_url

  })
  .select()
  .single();





  if(error){


    console.error(
      "DATABASE INSERT ERROR:",
      error
    );


    throw error;

  }





  return new Response(

    JSON.stringify({

      success:true,

      invoice:data,

      url:
      finalized.hosted_invoice_url

    }),

    {

      status:200,

      headers:{
        ...corsHeaders,
        "Content-Type":
        "application/json"
      }

    }

  );





}
catch(error:any){



console.error(
"CREATE INVOICE FAILED:",
error
);




return new Response(

JSON.stringify({

success:false,

error:
error.message

}),

{

status:500,

headers:{
...corsHeaders,
"Content-Type":
"application/json"
}

}

);



}


});
import { useState } from "react";
import { useAppState } from "../lib/AppState";

export function BillingPage(){

const {
  invoices,
  subscriptions,
  generateInvoice,
  recordBusinessPayment
}=useAppState();

const [loading,setLoading]=useState(false);


async function handleInvoice(){

setLoading(true);

await generateInvoice({
  invoice_number:"INV-"+Date.now(),
  amount:99,
  currency:"GBP",
  status:"pending",
});

setLoading(false);

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


<div className="grid md:grid-cols-3 gap-6">

<div className="rounded-2xl border bg-white p-6">
Active subscriptions
<h2 className="text-3xl font-bold">
{subscriptions?.filter((x:any)=>x.status==="active").length || 0}
</h2>
</div>

<div className="rounded-2xl border bg-white p-6">
Invoices
<h2 className="text-3xl font-bold">
{invoices?.length || 0}
</h2>
</div>

</div>


<button
disabled={loading}
onClick={handleInvoice}
className="rounded-xl bg-teal-600 px-5 py-3 text-white"
>
Generate Invoice
</button>


<div className="rounded-2xl border bg-white p-6 space-y-3">

{invoices?.map((invoice:any)=>(

<div key={invoice.id}
className="flex justify-between border rounded-xl p-4">

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

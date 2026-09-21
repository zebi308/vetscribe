function config(){
 const url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL
 const anon=process.env.SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_ANON_KEY
 if(!url||!anon)throw new Error('Server Supabase environment variables are not configured')
 return {url,anon}
}
export async function requireUser(req:any){
 const auth=String(req.headers?.authorization||'')
 if(!auth.startsWith('Bearer '))throw new Error('Unauthenticated request')
 const {url,anon}=config()
 const r=await fetch(`${url}/auth/v1/user`,{headers:{Authorization:auth,apikey:anon}})
 if(!r.ok)throw new Error('Invalid or expired Supabase session')
 const user=await r.json() as {id:string;email?:string}
 return {user,token:auth.slice(7),authHeader:auth,url,anon}
}
export async function restGet<T>(ctx:{url:string;anon:string;authHeader:string},path:string):Promise<T>{
 const r=await fetch(`${ctx.url}/rest/v1/${path}`,{headers:{Authorization:ctx.authHeader,apikey:ctx.anon,Accept:'application/json'}})
 if(!r.ok)throw new Error(`Database read failed: ${r.status} ${await r.text()}`)
 return r.json() as Promise<T>
}
export async function restWrite<T>(ctx:{url:string;anon:string;authHeader:string},path:string,method:'POST'|'PATCH',body:unknown):Promise<T>{
 const r=await fetch(`${ctx.url}/rest/v1/${path}`,{method,headers:{Authorization:ctx.authHeader,apikey:ctx.anon,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(body)})
 if(!r.ok)throw new Error(`Database write failed: ${r.status} ${await r.text()}`)
 return r.json() as Promise<T>
}

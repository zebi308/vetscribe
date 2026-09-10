import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Activity, ClipboardList, FileText, HeartPulse, LogOut, PawPrint, Settings, ShieldCheck, Users } from 'lucide-react'
import { useAppState } from '../../lib/AppState'

const nav=[
 {to:'/dashboard',label:'Dashboard',icon:Activity},
 {to:'/consultations',label:'Consultations',icon:ClipboardList},
 {to:'/patients',label:'Patients',icon:PawPrint},
 {to:'/clients',label:'Clients',icon:Users},
 {to:'/owner-summaries',label:'Owner Summaries',icon:FileText},
]
export function AppShell(){
 const {practice,currentUser,logout}=useAppState(); const loc=useLocation();
 const title=loc.pathname.split('/').filter(Boolean).map(x=>x.replace(/-/g,' ')).map(x=>x.replace(/^./,c=>c.toUpperCase())).join(' / ')||'VetScribe'
 return <div className="min-h-screen bg-slate-50 md:flex">
  <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
   <div className="border-b px-5 py-5"><div className="flex items-center gap-2 text-xl font-bold text-slate-900"><span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl text-white" style={{backgroundColor:practice.primaryColor}}>{practice.logoUrl?<img src={practice.logoUrl} alt="Practice logo" className="h-full w-full object-cover"/>:<HeartPulse size={20}/>}</span>VetScribe</div><p className="mt-2 text-xs text-slate-500">AI drafts. The vet decides.</p></div>
   <nav className="flex-1 space-y-1 p-3">{nav.map(({to,label,icon:Icon})=><NavLink key={to} to={to} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive?'bg-brand-50 text-brand-800':'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18}/>{label}</NavLink>)}
   <div className="my-3 border-t"/><NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><Settings size={18}/>Settings</NavLink>
   {currentUser?.role==='super_admin'&&<NavLink to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><ShieldCheck size={18}/>Super Admin</NavLink>}</nav>
   <div className="border-t p-4"><div className="text-sm font-semibold">{currentUser?.firstName} {currentUser?.lastName}</div><div className="text-xs capitalize text-slate-500">{currentUser?.role.replace('_',' ')}</div><button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"><LogOut size={16}/>Sign out</button></div>
  </aside>
  <div className="min-w-0 flex-1 pb-16 md:pb-0"><header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8"><div><h1 className="text-lg font-semibold text-slate-900">{title}</h1></div><div className="text-right"><div className="text-sm font-medium">{practice.name}</div><div className="text-xs text-slate-500">Designed around UK veterinary record-keeping guidance.</div></div></header><main className="mx-auto max-w-7xl p-4 md:p-8"><Outlet/></main><nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t bg-white p-2 md:hidden">{nav.slice(0,5).map(({to,label,icon:Icon})=><NavLink key={to} to={to} className={({isActive})=>`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${isActive?'text-brand-800':'text-slate-500'}`}><Icon size={18}/><span className="max-w-full truncate">{label}</span></NavLink>)}</nav></div>
 </div>
}

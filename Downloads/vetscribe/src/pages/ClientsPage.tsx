import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { useAppState } from '../lib/AppState'
import { fullName } from '../lib/format'
export function ClientsPage(){const {clients,patients}=useAppState();const [q,setQ]=useState('');return <div className="space-y-5"><div><h2 className="text-2xl font-bold">Clients</h2><p className="text-sm text-slate-500">Personal data is shown only where needed for practice workflows.</p></div><Card><div className="border-b p-4"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, phone or email" className="w-full rounded-lg border px-3 py-2"/></div><div className="divide-y">{clients.filter(c=>`${fullName(c)} ${c.phone} ${c.email}`.toLowerCase().includes(q.toLowerCase())).map(c=><Link to={`/clients/${c.id}`} key={c.id} className="flex justify-between gap-4 p-5 hover:bg-slate-50"><div><p className="font-bold">{fullName(c)}</p><p className="text-sm text-slate-500">{c.email} · {c.phone}</p></div><p className="text-sm text-slate-500">{patients.filter(p=>p.clientId===c.id).length} linked animal(s)</p></Link>)}</div></Card></div>}

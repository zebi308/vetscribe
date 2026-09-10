import { Card } from '../components/ui/Card'
import { useAppState } from '../lib/AppState'
import { formatDateTime, fullName } from '../lib/format'
export function AuditPage(){const s=useAppState();return <div className="space-y-5"><div><h2 className="text-2xl font-bold">Audit log</h2><p className="text-sm text-slate-500">Human-readable practice activity.</p></div><Card className="divide-y">{s.auditLogs.map(a=>{const actor=s.profiles.find(p=>p.id===a.actorUserId);return <div key={a.id} className="p-5"><p className="text-sm font-semibold">{a.description}</p><p className="mt-1 text-xs text-slate-500">{formatDateTime(a.createdAt)} · {actor?fullName(actor):'System'} · {a.action}</p></div>})}</Card></div>}

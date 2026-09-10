import type { ConsultationStatus } from '../../types/models'
const classes:Record<ConsultationStatus,string>={draft:'bg-slate-100 text-slate-700',transcribing:'bg-blue-100 text-blue-700',generating:'bg-violet-100 text-violet-700',awaiting_review:'bg-amber-100 text-amber-800',approved:'bg-emerald-100 text-emerald-800',cancelled:'bg-red-100 text-red-700'}
export function StatusBadge({status}:{status:ConsultationStatus}){ return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{status.replace('_',' ')}</span> }

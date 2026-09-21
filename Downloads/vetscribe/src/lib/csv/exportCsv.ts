import type { ClinicalDraft } from '../../types/models'
function esc(v:string){return `"${String(v??'').replaceAll('"','""')}"`}
export function exportClinicalCsv(args:{patient:string;client:string;consultationDate:string;treatingVet:string;approvedBy:string;version:number;note:ClinicalDraft}){
 const rows=[
  ['patient','client','consultation_date','treating_vet','approved_by','version','subjective','objective','assessment','plan'],
  [args.patient,args.client,args.consultationDate,args.treatingVet,args.approvedBy,String(args.version),JSON.stringify(args.note.subjective),JSON.stringify(args.note.objective),JSON.stringify(args.note.assessment),JSON.stringify(args.note.plan)]
 ];
 const blob=new Blob([rows.map(r=>r.map(esc).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${args.patient.toLowerCase()}-clinical-record.csv`;a.click();URL.revokeObjectURL(url)
}

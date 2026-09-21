export const formatDate = (iso:string) => new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(iso))
export const formatDateTime = (iso:string) => new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso))
export const formatTime = (iso:string) => new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso))
export const fullName = (p:{firstName:string,lastName:string}) => `${p.firstName} ${p.lastName}`
export const ageYears = (dob:string) => {
  const birth=new Date(dob), now=new Date('2026-09-09T12:00:00Z');
  let age=now.getUTCFullYear()-birth.getUTCFullYear();
  const m=now.getUTCMonth()-birth.getUTCMonth(); if(m<0||(m===0&&now.getUTCDate()<birth.getUTCDate())) age--;
  return age
}

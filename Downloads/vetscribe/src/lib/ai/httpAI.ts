import type { AIService } from './types'
import type { ClinicalDraft, OwnerSummary } from '../../types/models'
import { supabase } from '../supabase/client'

const base=import.meta.env.VITE_AI_API_BASE || '/api'
async function authHeader(){const {data}=await supabase!.auth.getSession();const token=data.session?.access_token;if(!token)throw new Error('Authenticated Supabase session required');return `Bearer ${token}`}
async function post<T>(path:string, body:unknown):Promise<T>{
  const res=await fetch(`${base}${path}`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':await authHeader()},body:JSON.stringify(body),credentials:'include'})
  if(!res.ok) throw new Error((await res.text())||`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}
export const httpAI:AIService={
  async transcribe(audio){ const form=new FormData(); form.append('audio',audio,'consultation.webm'); form.append('model','gpt-4o-mini-transcribe'); const res=await fetch(`${base}/transcribe`,{method:'POST',headers:{'Authorization':await authHeader()},body:form,credentials:'include'}); if(!res.ok) throw new Error('Transcription failed'); const data=await res.json() as {text:string}; return data.text },
  generateClinicalNote(input){ return post<ClinicalDraft>('/clinical-note',input) },
  generateOwnerSummary(input){ return post<OwnerSummary>('/owner-summary',input) }
}

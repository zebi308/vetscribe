import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
export function ForgotPasswordPage(){return <div className="grid min-h-screen place-items-center bg-slate-50 p-4"><Card className="w-full max-w-md p-7"><h1 className="text-xl font-bold">Reset password</h1><p className="mt-2 text-sm text-slate-600">Password reset is handled by Supabase Auth in production. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable it.</p><Link to="/login" className="mt-5 inline-block text-sm font-semibold text-brand-700">Back to sign in</Link></Card></div>}

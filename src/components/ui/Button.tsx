import type { ButtonHTMLAttributes, ReactNode } from 'react'
export function Button({children,className='',variant='primary',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:'primary'|'secondary'|'danger'|'ghost'}){
 const styles={primary:'bg-brand-700 text-white hover:bg-brand-800',secondary:'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50',danger:'bg-red-600 text-white hover:bg-red-700',ghost:'bg-transparent text-slate-700 hover:bg-slate-100'}
 return <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>
}

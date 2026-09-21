import { Link } from 'react-router-dom'
export function NotFoundPage(){return <div className="py-20 text-center"><h2 className="text-2xl font-bold">Page not found</h2><Link className="mt-4 inline-block font-semibold text-brand-700" to="/dashboard">Return to dashboard</Link></div>}

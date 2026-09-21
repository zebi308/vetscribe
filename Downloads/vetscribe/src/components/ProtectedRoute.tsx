import { Navigate, Outlet } from "react-router-dom";

import { useAppState } from "../lib/AppState";

import type { Role } from "../types/models";


interface ProtectedRouteProps {

allowedRoles?: Role[];

}



export function ProtectedRoute({
allowedRoles
}: ProtectedRouteProps){



const {
currentUser,
authLoading
}=useAppState();





// Wait until authentication state is restored

if(authLoading){

return (

<div className="
min-h-screen
grid
place-items-center
text-slate-600
">

Loading...

</div>

);

}







// User not logged in

if(!currentUser){

return (

<Navigate

to="/login"

replace

/>

);

}







// Role restriction

if(

allowedRoles &&

!allowedRoles.includes(currentUser.role)

){

return (

<Navigate

to="/unauthorized"

replace

/>

);

}







return <Outlet/>;


}

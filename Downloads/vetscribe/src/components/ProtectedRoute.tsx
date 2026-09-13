import { Navigate, Outlet } from "react-router-dom";

import { useAppState } from "../lib/AppState";



interface ProtectedRouteProps {

allowedRoles?: string[];

}



export function ProtectedRoute({
allowedRoles
}:ProtectedRouteProps){



const {
currentUser
}=useAppState();





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
to="/dashboard"
replace
/>

);

}







return <Outlet/>;


}
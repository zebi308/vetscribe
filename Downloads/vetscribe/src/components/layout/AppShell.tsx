import {
  NavLink,
  Outlet,
  useLocation
} from "react-router-dom";


import {
  Activity,
  ClipboardList,
  FileText,
  HeartPulse,
  LogOut,
  PawPrint,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";


import { useAppState } from "../../lib/AppState";





const navigation = [

{
label:"Dashboard",
path:"/dashboard",
icon:Activity,
roles:[
"vet",
"practice_manager",
"super_admin"
]
},


{
label:"Consultations",
path:"/dashboard/consultations",
icon:ClipboardList,
roles:[
"vet",
"practice_manager",
"super_admin"
]
},


{
label:"Patients",
path:"/dashboard/patients",
icon:PawPrint,
roles:[
"vet",
"practice_manager",
"super_admin"
]
},


{
label:"Clients",
path:"/dashboard/clients",
icon:Users,
roles:[
"vet",
"practice_manager",
"super_admin"
]
},


{
label:"Owner Summaries",
path:"/dashboard/owner-summaries",
icon:FileText,
roles:[
"vet",
"practice_manager",
"super_admin"
]
},


{
label:"Staff",
path:"/dashboard/settings/staff",
icon:Users,
roles:[
"practice_manager",
"super_admin"
]
},


{
label:"Templates",
path:"/dashboard/settings/templates",
icon:FileText,
roles:[
"practice_manager",
"super_admin"
]
},


{
label:"Audit",
path:"/dashboard/settings/audit",
icon:ShieldCheck,
roles:[
"practice_manager",
"super_admin"
]
},


{
label:"Admin",
path:"/dashboard/admin",
icon:ShieldCheck,
roles:[
"super_admin"
]
}


];









export function AppShell(){



const {
practice,
currentUser,
logout
}=useAppState();



const location =
useLocation();





const userRole =
currentUser?.role || "";





const allowedNavigation =
navigation.filter(item =>
item.roles.includes(userRole)
);





const title =
location.pathname
.split("/")
.filter(Boolean)
.map(
word =>
word
.replace("-"," ")
.replace(
/^\w/,
c=>c.toUpperCase()
)
)
.join(" / ");








return (

<div className="
min-h-screen
bg-slate-50
md:flex
">







{/* SIDEBAR */}



<aside className="
hidden
w-64
border-r
border-slate-200
bg-white
md:flex
md:flex-col
">






<div className="
border-b
px-5
py-5
">



<div className="
flex
items-center
gap-2
text-xl
font-bold
text-slate-900
">


<div className="
grid
h-10
w-10
place-items-center
overflow-hidden
rounded-xl
bg-teal-600
text-white
">


{

practice?.logoUrl

?

<img

src={practice.logoUrl}

alt="logo"

className="
h-full
w-full
object-cover
"

/>

:

<HeartPulse size={22}/>

}


</div>


VetScribe


</div>





<p className="
mt-2
text-xs
text-slate-500
">

AI drafts. The vet decides.

</p>




</div>









<nav className="
flex-1
space-y-1
p-3
">


{

allowedNavigation.map(
(item)=>{


const Icon =
item.icon;


return (

<NavLink

key={item.path}

to={item.path}

className={({isActive})=>

`
flex
items-center
gap-3
rounded-lg
px-3
py-2.5
text-sm
font-medium

${
isActive

?

"bg-teal-50 text-teal-700"

:

"text-slate-600 hover:bg-slate-50"

}

`

}


>


<Icon size={18}/>

{item.label}


</NavLink>


)


}

)

}






<div className="
my-3
border-t
"/>







<NavLink

to="/dashboard/settings"

className={({isActive})=>

`
flex
items-center
gap-3
rounded-lg
px-3
py-2.5
text-sm
font-medium

${
isActive

?

"bg-teal-50 text-teal-700"

:

"text-slate-600 hover:bg-slate-50"

}

`

}

>


<Settings size={18}/>

Settings


</NavLink>





</nav>









<div className="
border-t
p-4
">


<p className="
text-sm
font-semibold
text-slate-900
">

{currentUser?.firstName}

{" "}

{currentUser?.lastName}

</p>



<p className="
text-xs
capitalize
text-slate-500
">

{
currentUser?.role?.replace("_"," ")
}

</p>




<button

onClick={logout}

className="
mt-3
flex
items-center
gap-2
text-sm
text-slate-600
hover:text-slate-900
"

>


<LogOut size={16}/>

Sign out


</button>



</div>







</aside>









{/* MAIN CONTENT */}



<div className="
min-w-0
flex-1
">





<header className="
sticky
top-0
z-20
flex
items-center
justify-between
border-b
bg-white/95
px-4
py-3
backdrop-blur
md:px-8
">


<div>

<h1 className="
text-lg
font-semibold
text-slate-900
">

{title || "Dashboard"}

</h1>

</div>




<div className="
text-right
">


<p className="
text-sm
font-medium
">

{practice?.name}

</p>


<p className="
text-xs
text-slate-500
">

{
userRole.replace("_"," ")
}

</p>


</div>



</header>








<main className="
mx-auto
max-w-7xl
p-4
md:p-8
">

<Outlet/>

</main>






</div>





</div>


);

}
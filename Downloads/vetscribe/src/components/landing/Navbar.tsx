import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function Navbar(){


const navigate = useNavigate();


const [menuOpen,setMenuOpen] = useState(false);



const scrollToSection = (id:string)=>{


document
.getElementById(id)
?.scrollIntoView({

behavior:"smooth"

});


setMenuOpen(false);


};




return (


<nav className="landing-navbar">





{/* LOGO */}


<div 
className="landing-logo"
onClick={()=>window.scrollTo({
top:0,
behavior:"smooth"
})}
>


🐾

<span>
VetScribe
</span>


</div>








{/* DESKTOP MENU */}



<div 
className={`nav-links ${menuOpen ? "open" : ""}`}
>


<button
onClick={()=>scrollToSection("features")}
>
Features
</button>


<button
onClick={()=>scrollToSection("workflow")}
>
How It Works
</button>


<button
onClick={()=>scrollToSection("pricing")}
>
Pricing
</button>


<button
onClick={()=>scrollToSection("faq")}
>
FAQ
</button>


</div>








{/* ACTION BUTTONS */}



<div className="nav-actions">


<button

className="login-btn"

onClick={()=>navigate("/login")}

>

Login

</button>





<button

className="register-btn"

onClick={()=>navigate("/register")}

>

Register

</button>





<button

className="trial-btn"

onClick={()=>navigate("/register")}

>

Start Free Trial

</button>




</div>








{/* MOBILE BUTTON */}



<button

className="mobile-menu-btn"

onClick={()=>setMenuOpen(!menuOpen)}

>

☰

</button>





</nav>


);


}
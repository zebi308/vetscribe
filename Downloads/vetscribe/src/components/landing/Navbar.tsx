import { useNavigate } from "react-router-dom";
import logo from "../../assets/VetScribe logo.png";


export function Navbar(){


const navigate = useNavigate();




const scrollToSection = (id:string)=>{


document
.getElementById(id)
?.scrollIntoView({

behavior:"smooth"

});


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


<img

src={logo}

alt="VetScribe"

className="navbar-logo-image"

/>



</div>









{/* DESKTOP MENU */}



<div className="nav-links">


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


</div>






</nav>


);


}
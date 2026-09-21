import logo from "../../assets/VetScribe logo.png";
import privacyPolicy from "../../assets/VetScribe_Privacy_Policy.pdf";


export function Footer(){


return (

<footer className="landing-footer">



<div className="footer-top">



<div className="footer-brand">


<img

src={logo}

alt="VetScribe"

className="footer-logo"

/>



<p>

AI-assisted veterinary documentation built
for modern veterinary practices.

</p>



</div>







<div className="footer-links">



<div>


<h4>

Product

</h4>


<a href="#features">

Features

</a>


<a href="#workflow">

How It Works

</a>


<a href="#pricing">

Pricing

</a>



</div>







<div>


<h4>

Company

</h4>



<a

href={`mailto:vetscribe@clariana.co.uk`}

>

Contact

</a>



<a

href={privacyPolicy}

target="_blank"

rel="noopener noreferrer"

>

Privacy

</a>



</div>





</div>





</div>









<div className="footer-bottom">



<div className="footer-bottom-logo">


<img

src={logo}

alt="VetScribe"

className="footer-logo-small"

/>


</div>





<p>

© 2026 VetScribe. All rights reserved.

</p>



<p>

Product by{" "}


<a

href="https://www.clariana.co.uk/"

target="_blank"

rel="noopener noreferrer"

>

<strong>

Clariana

</strong>

</a>


</p>




</div>





</footer>


);


}
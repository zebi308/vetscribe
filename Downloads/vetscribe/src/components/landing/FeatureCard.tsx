interface Props{

title:string;
description:string;

}


export function FeatureCard({
title,
description
}:Props){


return(

<div className="feature-card">

<h3>
{title}
</h3>

<p>
{description}
</p>


</div>


)


}
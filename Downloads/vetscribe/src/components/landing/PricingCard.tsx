import React from "react";


interface PricingCardProps {

    title: string;

    price: string;

    description: string;

    features: string[];

    popular?: boolean;

    buttonText?: string;

}



export function PricingCard({

    title,

    price,

    description,

    features,

    popular = false,

    buttonText = "Start Free Trial"

}: PricingCardProps) {


    return (

        <div 
            className={`pricing-card ${popular ? "popular" : ""}`}
        >


            {popular && (

                <div className="popular-badge">

                    Most Popular

                </div>

            )}




            <h3>

                {title}

            </h3>




            <div className="price">

                {price}

                <span>
                    /month
                </span>

            </div>





            <p className="pricing-description">

                {description}

            </p>





            <ul className="pricing-features">


                {features.map((feature, index) => (

                    <li key={index}>

                        <span>
                            ✓
                        </span>

                        {feature}

                    </li>

                ))}


            </ul>





            <button className="pricing-button">

                {buttonText}

            </button>





        </div>

    );

}
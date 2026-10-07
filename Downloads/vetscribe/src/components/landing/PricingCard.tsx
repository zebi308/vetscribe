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
        <div className={`pricing-card ${popular ? "featured" : ""}`}>
            {popular && (
                <div className="pricing-badge">
                    ★ MOST POPULAR
                </div>
            )}

            <div className="pricing-plan-label">
                {title === "Starter" && "FOR SMALL PRACTICES"}
                {title === "Practice Plus" && "FOR GROWING PRACTICES"}
                {title === "Enterprise" && "FOR LARGER ORGANISATIONS"}
            </div>

            <h3>{title}</h3>

            <p className="pricing-description">
                {description}
            </p>

            <div className="pricing-price-area">
                <div className="price">
                    {price}
                </div>

                {price !== "Custom" && (
                    <div className="price-period">
                        per month
                    </div>
                )}

                {price === "Custom" && (
                    <div className="price-period">
                        Pricing
                    </div>
                )}
            </div>

            <ul>
                {features.map((feature, index) => (
                    <li key={index}>
                        <span style={{color:"#18b8aa"}}>✓</span> {feature}
                    </li>
                ))}
            </ul>

            <button className="pricing-button">
                {buttonText}
            </button>
        </div>
    );
}

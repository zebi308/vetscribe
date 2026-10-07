import React from "react";

import logo from "../../assets/VetScribe logo.png";

import privacyPolicy from "../../assets/privacy-policy.html?url";
import termsOfService from "../../assets/terms-of-service.html?url";
import dataProcessingAgreement from "../../assets/data-processing-agreement.html?url";
import aiUsagePolicy from "../../assets/ai-usage-policy.html?url";
import cookiePolicy from "../../assets/cookie-policy.html?url";
import securityStatement from "../../assets/security-statement.html?url";


export function Footer() {

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


            <a href="mailto:vetscribe@clariana.co.uk">
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




          <div className="footer-compliance">

            <h4>
              Compliance &amp; Legal
            </h4>


            <a
              href={privacyPolicy}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>


            <a
              href={termsOfService}
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>


            <a
              href={dataProcessingAgreement}
              target="_blank"
              rel="noopener noreferrer"
            >
              Data Processing Agreement (DPA)
            </a>


            <a
              href={aiUsagePolicy}
              target="_blank"
              rel="noopener noreferrer"
            >
              AI Usage Policy
            </a>


            <a
              href={cookiePolicy}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cookie Policy
            </a>


            <a
              href={securityStatement}
              target="_blank"
              rel="noopener noreferrer"
            >
              Security Statement
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

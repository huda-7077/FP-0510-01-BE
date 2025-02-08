export const applicationAcceptanceTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      /* Modern CSS Reset */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* Base Styles */
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        padding: 20px;
        line-height: 1.6;
        color: #334155;
      }

      /* Container */
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }

      /* Header Section */
      .email-header {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        padding: 40px 20px;
        text-align: center;
        color: #ffffff;
      }

      .company-logo {
        width: 120px;
        height: 120px;
        margin: 0 auto 24px;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.2);
        padding: 4px;
        background: #ffffff;
        display: block;
        object-fit: cover;
      }

      .email-header h1 {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        padding: 0;
        line-height: 1.4;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        color: #ffffff;
      }

      /* Body Section */
      .email-body {
        padding: 40px;
        font-size: 16px;
        text-align: center;
      }

      .email-body p {
        margin-bottom: 24px;
        color: #475569;
      }

      /* Button Styles */
      .button {
        display: inline-block;
        background: #059669;
        color: #ffffff;
        padding: 16px 32px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
        margin-top: 24px;
      }

      .button:hover {
        background: #047857;
        transform: translateY(-1px);
        box-shadow: 0 6px 8px -1px rgba(5, 150, 105, 0.3);
      }

      /* Divider */
      .divider {
        border: none;
        height: 1px;
        background: #e2e8f0;
        margin: 32px 0;
      }

      /* Footer Section */
      .email-footer {
        padding: 0 40px 40px;
        text-align: center;
        font-size: 14px;
        color: #64748b;
      }

      .email-footer p {
        margin-bottom: 16px;
      }

      strong {
        color: #059669;
      }

      /* Responsive Design */
      @media (max-width: 600px) {
        body {
          padding: 10px;
        }

        .email-container {
          margin: 10px auto;
        }

        .email-header {
          padding: 30px 15px;
        }

        .email-body {
          padding: 30px 20px;
        }

        .email-footer {
          padding: 0 20px 30px;
        }

        .company-logo {
          width: 100px;
          height: 100px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <img
          src="{{company_logo}}"
          alt="{{company_name}} Logo"
          class="company-logo" />
        <h1>Congratulations, {{applicant_name}}!</h1>
      </div>
      <div class="email-body">
        <p>Dear {{applicant_name}},</p>
        <p>
          We are pleased to inform you that your application for the position of
          <strong>{{position}}</strong> at <strong>{{company_name}}</strong> has
          been accepted!
        </p>
        <p>
          We were truly impressed with your qualifications and believe you will
          be a great addition to our team.
        </p>
        <p>
          Our HR team will be reaching out to you shortly with the next steps in
          the onboarding process.
        </p>
        <a href="{{company_website}}" class="button"> View Next Steps </a>
      </div>
      <hr class="divider" />
      <div class="email-footer">
        <p>We are excited to welcome you to {{company_name}}!</p>
        <p>
          Best regards,<br /><strong>{{company_name}} Recruitment Team</strong>
        </p>
      </div>
    </div>
  </body>
</html>

`;

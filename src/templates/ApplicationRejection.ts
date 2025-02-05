export const applicationRejectionTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #F5F5F5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .email-header h1 {
      color: #2C3E50;
      font-size: 28px;
      margin: 0;
      padding: 0;
    }
    .email-body {
      font-size: 18px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body p {
      margin-bottom: 20px;
    }
    .email-footer {
      margin-top: 40px;
      text-align: center;
      font-size: 16px;
      color: #888888;
    }
    .footer-link {
      color: #3498db;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      background-color: #e74c3c;
      color: #ffffff;
      padding: 16px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 25px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #c0392b;
    }
    .divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }
    .company-logo {
      display: block;
      width: 150px;
      height: auto;
      margin: 0 auto 30px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="{{company_logo}}" alt="{{company_name}} Logo" class="company-logo">
      <h1>Application Status: {{position}}</h1>
    </div>
    <div class="email-body">
      <p>Dear {{applicant_name}},</p>
      <p>Thank you for applying for the position of {{position}} at {{company_name}}. After careful consideration, we regret to inform you that we have decided to move forward with another candidate for this role.</p>
      <p>We appreciate the time and effort you put into your application, and we encourage you to apply for future openings that match your qualifications.</p>
      <p>We wish you the best in your job search and future endeavors.</p>
      <a href="{{company_website}}" class="button">Visit Our Careers Page</a>
    </div>
    <hr class="divider">
    <div class="email-footer">
      <p>Thank you again for your interest in {{company_name}}.</p>
      <p>Best regards,<br>{{company_name}} Recruitment Team</p>
    </div>
  </div>
</body>
</html>
`;

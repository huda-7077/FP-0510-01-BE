export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to SupaJob</title>
    <style>
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2d3748;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f7fafc;
      }
      .container { 
        max-width: 600px;
        margin: 40px auto;
        padding: 40px;
        border-radius: 16px;
        background-color: #ffffff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo img {
        height: 50px;
      }
      h1 { 
        text-align: center;
        color: #2b6cb0;
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: 700;
      }
      .welcome-text {
        font-size: 18px;
        margin-bottom: 25px;
        color: #4a5568;
      }
      .button-container {
        text-align: center;
        margin: 35px 0;
      }
      .button { 
        display: inline-block;
        padding: 14px 32px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background-color: #3182ce;
        text-decoration: none;
        border-radius: 8px;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #2c5282;
      }
      .highlight { 
        color: #2b6cb0;
        font-weight: 600;
      }
      .divider {
        height: 1px;
        background-color: #e2e8f0;
        margin: 30px 0;
      }
      .footer {
        text-align: center;
        color: #718096;
        font-size: 14px;
      }
      .footer p {
        margin: 5px 0;
      }
      .social-links {
        text-align: center;
        margin-top: 20px;
      }
      .social-links a {
        margin: 0 10px;
        color: #4a5568;
        text-decoration: none;
      }
      .expiry-notice {
        font-size: 14px;
        color: #718096;
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <!-- Add your logo URL here -->
        <img src="https://res.cloudinary.com/dwptrdpk0/image/upload/v1737946276/logo_avlbsa.svg" alt="SupaJob Logo" />
      </div>
      <h1>Reset Your Password</h1>
      <p class="welcome-text">Hello <span class="highlight">{{name}}</span>,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <div class="button-container">
        <a href="{{resetPasswordLink}}" target="_blank" class="button">Reset Password</a>
      </div>
      <p class="expiry-notice">This link will expire in 15 minutes.</p>
      <div class="divider"></div>
      <div class="footer">
        <p><strong>SupaJob</strong> - Your Path to Career Success</p>
        <p>Need assistance? Our support team is here to help!</p>
        <p>Email: support@supajob.com</p>
        <div class="social-links">
          <a href="#">LinkedIn</a> • 
          <a href="#">Twitter</a> • 
          <a href="#">Instagram</a>
        </div>
        <p style="margin-top: 20px; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>
`;

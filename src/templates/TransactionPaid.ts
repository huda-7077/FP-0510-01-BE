export const transactionPaidTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Transaction Receipt</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        text-align: center;
        color: #007bff;
        margin-bottom: 20px;
      }
      .info {
        margin: 10px 0;
        border-top: 1px dashed #ccc;
        padding-top: 10px;
      }
      .info p {
        margin: 5px 0;
      }
      .info strong {
        display: inline-block;
        width: 150px;
        font-weight: bold;
        color: #555;
      }
      .footer {
        margin-top: 20px;
        font-size: 0.9em;
        color: #666;
      }
      .footer p {
        margin: 5px 0;
      }
      .highlight {
        font-weight: bold;
        color: #007bff;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Transaction {{transactionStatus}}</h1>
      <p>Dear <span class="highlight">{{name}}</span>,</p>
      <p>Thank you for your transaction! Below are the details:</p>
      <div class="info">
        <p><strong>Payment ID:</strong> {{paymentId}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Status:</strong> {{transactionStatus}}</p>
        <p><strong>Plan:</strong> {{plan}}</p>
        <p><strong>Duration:</strong> {{duration}}</p>
        <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
        <p><strong>Total:</strong> Rp. {{total}}</p>
        <p><strong>Invoice URL:</strong> <a href="{{invoiceUrl}}">View Invoice</a></p>
      </div>
      <div class="footer">
        <p>SupaJob - Your trusted platform for job hunters.</p>
        <p>Need help? Contact our support team at
          <a href="mailto:support@supajob.com">support@supajob.com</a>.</p>
        <p>Thank you for choosing <a href="{{siteUrl}}"> <span class="highlight">SupaJob</span></a>!</p>
      </div>
    </div>
  </body>
</html>
`;

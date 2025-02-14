export const interviewReminderTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Segoe UI", Arial, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        line-height: 1.6;
        color: #334155;
      }

      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .email-header {
        background: linear-gradient(135deg, #194bb6 0%, #2562ea 100%);
        padding: 40px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .email-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('/api/placeholder/600/200') center/cover;
        opacity: 0.1;
        mix-blend-mode: overlay;
      }

      .company-logo {
        width: 100px;
        height: 100px;
        margin: 0 auto 24px;
        border-radius: 20px;
        background: #ffffff;
        padding: 3px;
        display: block;
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .email-header h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        padding: 0;
        line-height: 1.4;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .email-header .position {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 8px;
      }

      .email-body {
        padding: 40px;
      }

      .greeting {
        font-size: 20px;
        color: #1e293b;
        margin-bottom: 24px;
      }

      .intro {
        font-size: 16px;
        color: #475569;
        margin-bottom: 32px;
        line-height: 1.6;
      }

      .interview-details {
        background: #f8fafc;
        border-radius: 16px;
        padding: 24px;
        margin: 32px 0;
      }

      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .detail-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .detail-label {
        flex: 0 0 120px;
        font-weight: 600;
        color: #64748b;
      }

      .detail-value {
        flex: 1;
        color: #1e293b;
        font-weight: 500;
      }

      .button-container {
        text-align: center;
        margin: 32px 0;
      }

      .button {
        display: inline-flex;
        align-items: center;
        background: #2562ea;
        color: #ffffff;
        padding: 16px 32px;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(37, 98, 234, 0.2);
      }

      .button i {
        margin-right: 8px;
      }

      .button:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(37, 98, 234, 0.3);
      }

      .notes-section {
        background: #fffbeb;
        border-radius: 12px;
        padding: 24px;
        margin: 32px 0;
      }

      .notes-title {
        font-weight: 600;
        color: #92400e;
        margin-bottom: 12px;
      }

      .notes-content {
        color: #92400e;
        font-size: 15px;
        line-height: 1.6;
      }

      .email-footer {
        padding: 32px 40px;
        text-align: center;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
      }

      .footer-content {
        max-width: 400px;
        margin: 0 auto;
      }

      .company-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 16px;
        margin-top: 8px;
      }

      @media (max-width: 600px) {
        .email-container {
          margin: 10px;
          border-radius: 16px;
        }

        .email-header {
          padding: 32px 20px;
        }

        .email-body {
          padding: 24px;
        }

        .interview-details {
          padding: 20px;
        }

        .detail-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .detail-label {
          margin-bottom: 4px;
        }

        .email-footer {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <img src="{{company_logo}}" alt="{{company_name}} Logo" class="company-logo" />
        <h1>Interview Schedule Reminder</h1>
        <div class="position">{{position}}</div>
      </div>

      <div class="email-body">
        <p class="greeting">Dear {{applicant_name}},</p>
        
        <p class="intro">
          We're looking forward to your upcoming interview for the position of
          <strong>{{position}}</strong> at <strong>{{company_name}}</strong>.
        </p>
        
        <div class="interview-details">
          <div class="detail-row">
            <div class="detail-label">
              <i class="far fa-calendar-alt"></i>&nbsp; Date & Time
            </div>
            <div class="detail-value">{{scheduledDate}}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="far fa-user"></i>&nbsp; Interviewer
            </div>
            <div class="detail-value">{{interviewerName}}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="far fa-building"></i>&nbsp; Location
            </div>
            <div class="detail-value">{{location}}</div>
          </div>
        </div>

        {{#eq location "Online"}}
        <div class="button-container">
          <a href="{{meetingLink}}" target="_blank" class="button">
            <i class="fas fa-video"></i> Join Meeting
          </a>
        </div>
        {{/eq}}

        {{#if notes}}
        <div class="notes-section">
          <div class="notes-title">
            <i class="fas fa-info-circle"></i>&nbsp; Additional Notes:
          </div>
          <div class="notes-content">{{notes}}</div>
        </div>
        {{/if}}

        <p class="intro">
          Please ensure you join the interview on time. If you need to reschedule or
          have any questions, don't hesitate to contact our recruitment team.
        </p>
      </div>

      <div class="email-footer">
        <div class="footer-content">
          <p>Best regards,</p>
          <p class="company-name">{{company_name}} Recruitment Team</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

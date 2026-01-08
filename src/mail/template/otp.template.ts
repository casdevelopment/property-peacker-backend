export const otpTemplate = (otpCode: number, expiresAt: Date) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔑 Property Picker - OTP Verification</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1.6;
      }
      
      .container {
        background: white;
        border-radius: 24px;
        padding: 40px;
        max-width: 480px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.5s ease-out;
      }
      
      .header {
        text-align: center;
        margin-bottom: 32px;
      }
      
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 20px;
        color: #1a202c;
      }
      
      .logo-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
      
      .app-name {
        font-family: 'Poppins', sans-serif;
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .title {
        font-family: 'Poppins', sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 8px;
      }
      
      .subtitle {
        color: #718096;
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 32px;
      }
      
      .otp-container {
        background: linear-gradient(135deg, #f6f9ff 0%, #f0f4ff 100%);
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        margin-bottom: 32px;
        border: 2px dashed #c3dafe;
      }
      
      .otp-label {
        font-size: 14px;
        color: #718096;
        margin-bottom: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }
      
      .otp-code {
        font-family: 'Poppins', monospace;
        font-size: 48px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 8px;
        margin: 16px 0;
        animation: pulse 2s infinite;
      }
      
      .expiry-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #fff5f5;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 32px;
        border-left: 4px solid #fc8181;
      }
      
      .expiry-icon {
        color: #fc8181;
        font-size: 20px;
      }
      
      .expiry-text {
        color: #c53030;
        font-size: 14px;
        font-weight: 500;
      }
      
      .expiry-time {
        font-weight: 700;
        color: #1a202c;
      }
      
      .instructions {
        background: #f7fafc;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 32px;
      }
      
      .instructions-title {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .instructions-list {
        list-style: none;
        padding-left: 0;
      }
      
      .instructions-list li {
        padding: 8px 0;
        color: #4a5568;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .instructions-list li:before {
        content: "✓";
        color: #48bb78;
        font-weight: bold;
      }
      
      .warning {
        text-align: center;
        padding: 20px;
        background: #fefcbf;
        border-radius: 12px;
        border: 1px solid #f6e05e;
        color: #744210;
        font-size: 14px;
        font-weight: 500;
      }
      
      .footer {
        text-align: center;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
        color: #a0aec0;
        font-size: 14px;
      }
      
      .footer a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      
      @media (max-width: 600px) {
        .container {
          padding: 24px;
          margin: 12px;
        }
        
        .otp-code {
          font-size: 36px;
          letter-spacing: 6px;
        }
        
        .title {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">🏠</div>
          <div class="app-name">Property Picker</div>
        </div>
        <h1 class="title">Secure Verification</h1>
        <p class="subtitle">Enter this code to continue with your property search</p>
      </div>
      
      <div class="otp-container">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${String(otpCode).padStart(6, '0').split('').join(' ')}</div>
        <div style="color: #718096; font-size: 14px;">Valid for 10 minutes</div>
      </div>
      
      <div class="expiry-info">
        <div class="expiry-icon">⏰</div>
        <div class="expiry-text">
          Expires at: <span class="expiry-time">${expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      <div class="instructions">
        <div class="instructions-title">📱 How to use this code:</div>
        <ul class="instructions-list">
          <li>Return to the Property Picker app</li>
          <li>Enter the 6-digit code above</li>
          <li>Complete your verification instantly</li>
          <li>Start exploring properties right away</li>
        </ul>
      </div>
      
      <div class="warning">
        ⚠️ For your security, never share this code with anyone. Property Picker will never ask for your password or other sensitive information via email.
      </div>
      
      <div class="footer">
        <p>Having trouble? <a href="mailto:support@propertypicker.com">Contact our support team</a></p>
        <p style="margin-top: 8px;">© ${new Date().getFullYear()} Property Picker. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
import nodemailer from 'nodemailer'

export async function sendVerificationEmail({ to, token }) {
     try {
          const transporter = nodemailer.createTransport({
               host: 'mail.privateemail.com',
               port: 465, // Use 465 for secure connection
               secure: true, // Use SSL/TLS
               auth: {
                    user: 'verification@qption.com',
                    pass: encodeURIComponent('CR.fmms(WQQ)X2n'),
               },
          })

          transporter.verify((error, success) => {
               if (error) {
                    console.error('Error connecting to SMTP server:', error)
               } else {
                    console.log('SMTP server sent emails to ' + to)
               }
          })
          // 3. Define mail options
          const mailOptions = {
               from: 'verification@qption.com', // Sender address
               to, // Recipient (user's email)
               subject: 'Account Verification - Please Verify Your Email',
               html: `
        <h2>Hello!</h2>
        <p>Thank you for registering with qption.com. Please verify your email with the code bellow:</p>
        ${token}
      `,
          }

          // 4. Send the email
          try {
               const info = await transporter.sendMail(mailOptions)
               console.log('Verification email sent:', info.messageId)
          } catch (error) {
               console.error('Error sending email:', error)
          }
     } catch (error) {
          console.error('Error sending verification email:', error)
     }
}
export async function sendEmailValidation({ to, otp }) {
     try {
          const transporter = nodemailer.createTransport({
               host: 'mail.privateemail.com',
               port: 465, // Use 465 for secure connection
               secure: true, // Use SSL/TLS
               auth: {
                    user: 'validation@qption.com',
                    pass: '2Gx3@g/RmRr?8uZ',
               },
          })

          transporter.verify((error, success) => {
               if (error) {
                    console.error('Error connecting to SMTP server:', error)
               } else {
                    console.log('SMTP server is ready to send emails')
               }
          })
          const mailOptions = {
               from: 'validation@qption.com', // Sender address
               to, // Recipient (user's email)
               subject: 'One time password ',
               html: `
               <!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
               <title>Qption Email Verification</title>
               <style>
               body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
               }
               .email-container {
                    max-width: 480px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #eaeaea;
               }

               .header {
                    background-color: #0d1117;
                    padding: 24px;
                    color: #fcd535;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 1px;
               }

               .content {
                    padding: 32px 24px;
                    text-align: center;
                    color: #333333;
               }

               .content h2 {
                    font-size: 20px;
                    margin-bottom: 16px;
               }

               .otp-code {
                    display: inline-block;
                    background-color: #fcd535;
                    color: #0d1117;
                    font-weight: bold;
                    font-size: 28px;
                    padding: 12px 24px;
                    border-radius: 8px;
                    letter-spacing: 6px;
                    margin: 24px 0;
               }

               .note {
                    font-size: 14px;
                    color: #666666;
                    margin-top: 20px;
               }

               .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    padding: 20px;
               }

               @media (max-width: 520px) {
                    .otp-code {
                    font-size: 24px;
                    padding: 10px 20px;
                    letter-spacing: 4px;
                    }
               }
               </style>
               </head>
               <body>
               <div class="email-container">
               <div class="header">
                    Qption
               </div>

               <div class="content">
                    <h2>Verify your email address</h2>
                    <p>Use the code below to complete your email verification.</p>
                    
                    <div class="otp-code">${otp}</div>

                    <p>Please enter this code in the Qption app or website to verify your email.</p>

                    <div class="note">
                    This code will expire in 2 minutes.<br/> If you didn’t request this, you can safely ignore this email.
                    </div>
               </div>

               <div class="footer">
                    &copy; 2025 Qption. All rights reserved.
               </div>
               </div>
               </body>
               </html>

               `,
          }

          // 4. Send the email
          try {
               await transporter.sendMail(mailOptions)
          } catch (error) {
               console.error('Error sending email:', error)
          }
     } catch (error) {
          console.error('Error sending  email:', error)
     }
}
export async function sendEmailOtp({ to, otp }) {
     try {

          const transporter = nodemailer.createTransport({
               host: 'mail.privateemail.com',
               port: 465, // Use 465 for secure connection
               secure: true, // Use SSL/TLS
               auth: {
                    user: 'validation@qption.com',
                    pass: '2Gx3@g/RmRr?8uZ',
               },
               logger: true,
               debug: true,
               tls: {
                    minVersion: 'TLSv1.2',
                    // rejectUnauthorized: false, // only if you're sure you need to bypass CA issues
               },
          })

          transporter.verify((error, success) => {
               if (error) {
                    console.error('Error connecting to SMTP server:', error)
               } else {
                    console.log('SMTP server is ready to send emails')
               }
          })
          const mailOptions = {
               from: 'validation@qption.com',
               to,
               subject: 'One time code ',
               html: `
               <!DOCTYPE html>
               <html lang="en">
               <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
               <title>Qption Email Verification</title>
               <style>
               body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
               }
               .email-container {
                    max-width: 480px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #eaeaea;
               }

               .header {
                    background-color: #0d1117;
                    padding: 24px;
                    color: #fcd535;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 1px;
               }

               .content {
                    padding: 32px 24px;
                    text-align: center;
                    color: #333333;
               }

               .content h2 {
                    font-size: 20px;
                    margin-bottom: 16px;
               }

               .otp-code {
                    display: inline-block;
                    background-color: #fcd535;
                    color: #0d1117;
                    font-weight: bold;
                    font-size: 28px;
                    padding: 12px 24px;
                    border-radius: 8px;
                    letter-spacing: 6px;
                    margin: 24px 0;
               }

               .note {
                    font-size: 14px;
                    color: #666666;
                    margin-top: 20px;
               }

               .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    padding: 20px;
               }

               @media (max-width: 520px) {
                    .otp-code {
                    font-size: 24px;
                    padding: 10px 20px;
                    letter-spacing: 4px;
                    }
               }
               </style>
               </head>
               <body>
               <div class="email-container">
               <div class="header">
                    Qption
               </div>

               <div class="content">
                    <h2>Verify your email address</h2>
                    <p>Use the code below to complete your email verification.</p>
                    
                    <div class="otp-code">${otp}</div>

                    <p>Please enter this code in the Qption app or website to verify your email.</p>

                    <div class="note">
                    This code will expire in 2 minutes.<br/> If you didn’t request this, you can safely ignore this email.
                    </div>
               </div>

               <div class="footer">
                    &copy; 2025 Qption. All rights reserved.
               </div>
               </div>
               </body>
               </html>

               `,
          }

          // 4. Send the email
          try {
               await transporter.sendMail(mailOptions)
          } catch (error) {
               console.error('Error sending email:', error)
          }
     } catch (error) {
          console.error('Error sending  email:', error)
     }
}

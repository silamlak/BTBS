import nodemailer from "nodemailer";
import fs from "fs";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendConfirmationEmail = async (to, confirmationCode, msg) => {
  console.log(to, confirmationCode);
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007BFF;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content h2 {
          color: #333333;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          color: #007BFF;
          display: inline-block;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${msg}</h1>
        </div>
        <div class="content">
          <h2>Your ${msg}</h2>
          <p>Please use the following code to complete your verification:</p>
          <div class="code">${confirmationCode}</div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p><a href="#">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await transporter.sendMail({
    from: process.env.EMAIL_NAME,
    to,
    subject: msg, // Subject line
    text: `Your confirmation code is: ${confirmationCode}`,
    html: htmlContent,
  });

  //   return info;
};

export const sendBookingConfirmationEmail = async (
  to,
  { passenger, booked, seat, busDetail, scheduleDetail }
) => {
  console.log(to);
  const bookingDate = new Date(
    scheduleDetail?.schedule_date
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007BFF;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content h2 {
          color: #333333;
        }
        .details {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          text-align: left;
          font-size: 16px;
          margin: 10px 0;
        }
        .details p {
          margin: 5px 0;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          color: #007BFF;
          margin: 10px 0;
          display: inline-block;
        }
        .cta {
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          color: #ffffff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <h2>Thank you for booking with us!</h2>
          <p>Your booking has been successfully confirmed. Below are your details:</p>
          
          <div class="details">
           <p><strong>Booking Date:</strong> ${bookingDate}</p>
            <p><strong>Passenger:</strong> ${passenger?.first_name} ${
    passenger?.last_name
  }</p>
            <p><strong>Departure:</strong> ${scheduleDetail?.from}</p>
            <p><strong>Arrival:</strong> ${scheduleDetail?.to}</p>
            <p><strong>Seat Number:</strong> ${seat?.seatNo}</p>
            <p><strong>Price:</strong> ${booked?.total_price}</p>
          </div>

          <p>Your confirmation code is:</p>
          <div class="code">${booked?.confirmationCode}</div>

          <div class="cta">
            <a href="#" class="btn">View Booking Details</a>
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Habesha Bus. All rights reserved.</p>
          <p><a href="#">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: process.env.EMAIL_NAME,
    to,
    subject: "Booking Confirmation",
    text: `Your booking has been confirmed. Confirmation Code: ${booked?.confirmationCode}`,
    html: htmlContent,
  });
};

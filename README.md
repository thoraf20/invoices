# Invoice Generation App

## Overview
The Invoice Generation App is a comprehensive solution for businesses and freelancers to create, manage, and send invoices to clients. This app helps streamline the billing process, track payments, and keep financial records organized. With features such as invoice creation, client management, payment tracking, and reporting, this app provides everything needed to efficiently manage invoicing tasks.

## Features
- Invoice Creation: Create detailed invoices with line items, quantities, unit prices, and automatic tax and discount calculations.
- Client Management: Store and manage client information, including names, addresses, and contact details.
- Invoice Management: View, filter, and search invoices by status (paid, unpaid, overdue), client, or date.
- Payment Tracking: Record payments and update invoice status (paid, partially paid, unpaid).
- Multi-currency Support: Generate invoices in different currencies for clients from different regions.
- Automated Notifications: Email reminders for unpaid or overdue invoices and notifications for new invoices.
- PDF Generation: Export invoices as PDF files and email them directly to clients.

## Technologies Used
Node.js, TypeScript, Express.js, (MongoDB & Mongoose), Nodemailer, Node-Cron, PDFKit

# Installation

## Prerequisites
- Node.js (v12 or above)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)
- npm (Node package manager)

# Step-by-Step Setup

1. Clone the Repository

2. Install dependencies

npm install

3. Environment Configuration
Create a .env file in the root directory to store environment variables:

touch .env

Inside the .env file, add the following:

MONGO_URI=mongodb://localhost:27017/invoiceDB  # Replace with your MongoDB connection string
PORT=5000                                      # Define the port for the app to run on
SECRET_KEY=your_secret_key_here                # Set a secret key for authentication and encryption

4. Build the app

npm run build

5. Start the app in development mode

npm run dev


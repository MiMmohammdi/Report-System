
# Daily Sales Report Email Service

  

## Project Overview

  

This is a NestJS-based microservice that handles daily sales report email notifications using RabbitMQ for message queuing and Nodemailer for email transmission.

  

## Features

  

- 🚀 RabbitMQ message queue integration

- 📧 Automated email sending

- 🔒 Environment-based configuration

- 🧪 Comprehensive unit testing

  

## Prerequisites

  

- Node.js (v16+ recommended)

- npm or yarn

- RabbitMQ

- Mailhog (for local email testing)

  

## Technology Stack

  

- NestJS

- RabbitMQ (amqplib)

- Nodemailer

- TypeScript

  

## Installation

  

1. Clone the repository


	```bash
    git  clone <your-repo-url>
    cd  daily-sales-report-service
2. Install  dependencies
	```bash
    npm  install
3. Set  up  environment  variable
Create  a  .env  file  in  the  project  root  with  the  following  content:
	 ```bash
	 PORT=3001
	MAIL_FROM=email@example.com
	MAIL_TO=recipient@example.com
## Local Development Setup
RabbitMQ

1.Install  RabbitMQ  locally
2.Ensure  RabbitMQ  is  running  on  localhost:5672

  

Mailhog (Optional but  Recommended)
For  local  email  testing:

	docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

	
## Running the Application
### Development Mode


	
	npm run start:dev

### Production Mode

	npm run build
	npm run start:prod
	
## Testing

Run unit tests:

	npm test
Run test coverage:

	npm run test:cov

## Configuration

### Environment Variables

-   `PORT`: Application listening port
-   `MAIL_FROM`: Sender email address
-   `MAIL_TO`: Recipient email address

### Email Configuration

The service uses local SMTP (Mailhog) by default:

-   Host: `localhost`
-   Port: `1025`
-   Secure: `false`

## Message Queue Flow

1.  RabbitMQ Queue: `daily_sales_report`
2.  Message Format: JSON object representing daily sales report
3.  Automatic email generation upon message receipt

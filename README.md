
# Daily Sales Reporting System

## 🚀 Project Overview

A robust microservices-based application for invoice management and automated daily sales reporting, leveraging modern cloud-native technologies.

## 🌟 Key Features

- 📋 Invoice Management Microservice

- 📧 Email Notification Service

- 📊 Daily Automated Reporting

- 🔄 Message Queue Integration (RabbitMQ)

- 📦 Persistent Data Storage (MongoDB)

- 🐳 Containerized Deployment

## 🛠 System Architecture

```
+----------------+ 			+----------------+ 		+----------------+
| Invoice Service|	---->	| RabbitMQ Queue |----> | Email Service  | 
+----------------+ 			+----------------+ 		+----------------+
	|														|
	v 														v
+----------------+ 									+-------------------+
	| MongoDB | 									| Daily Sales Report|
+----------------+ 									+-------------------+

  ```

## 🔧 Technology Stack

### Backend

- NestJS

- TypeScript

- MongoDB

- Mongoose ODM

- RabbitMQ

- Nodemailer

### Infrastructure

- Docker

- Docker Compose

- Mailhog (Local Email Testing)

## 🚀 Quick Start

### Prerequisites

- Docker

- Docker Compose

- Node.js (v16+)

### Installation Steps

1. Clone the Repository
	```
	git clone <your-repository-url>

	cd daily-sales-reporting
	```
2. Create Environment Files

	`invoice-service/.env`:

	```PORT=3000
	MONGO_URI=mongodb://mongo:27017/invoicedb

	RABBITMQ_URL=amqp://rabbitmq

	`email-service/.env`:

	PORT=3001

	MAIL_FROM=<sales@company.com>

	MAIL_TO=<manager@company.com>

	RABBITMQ_URL=amqp://rabbitmq```

3. Start Full System

	```
	docker-compose up -d --build
	```
  
## 📘 API Documentation

### Swagger UI

Access the interactive API documentation at:

- Local: <http://localhost:3000/api-docs>

- Staging/Production: [Your Domain]/api-docs

#### Key Endpoints

- `POST /invoices`: Create a new invoice

- `GET /invoices`: List all invoices

- `GET /invoices/:id`: Get specific invoice

- `GET /invoices/date-range`: Filter invoices by date range


##  View MailHug Inbox 

``http://localhost:8025``
## 🔧 Docker Compose Configuration

```
version: '3.8'

services:

# MongoDB Service

mongo:

image: mongo:latest

container_name: mongodb

ports:

- "27017:27017"

volumes:

- mongo-data:/data/db

networks:

- sales-network

  

# RabbitMQ Service

rabbitmq:

image: rabbitmq:3-management

container_name: rabbitmq

ports:

- "5672:5672"

- "15672:15672"

volumes:

- rabbitmq-data:/var/lib/rabbitmq

networks:

- sales-network

  

# Mailhog (Local Email Testing)

mailhog:

image: mailhog/mailhog

container_name: mailhog

ports:

- "1025:1025" # SMTP server

- "8025:8025" # Web UI

networks:

- sales-network

  

# Invoice Service

invoice-service:

build:

context: ./invoice-service

dockerfile: Dockerfile

container_name: invoice-service

ports:

- "3000:3000"

environment:

- MONGO_URI=mongodb://mongo:27017/invoicedb

- RABBITMQ_URL=amqp://rabbitmq

depends_on:

- mongo

- rabbitmq

networks:

- sales-network

  

# Email Service

email-service:

build:

context: ./email-service

dockerfile: Dockerfile

container_name: email-service

ports:

- "3001:3001"

environment:

- MAIL_FROM=sales@company.com

- MAIL_TO=manager@company.com

- RABBITMQ_URL=amqp://rabbitmq

depends_on:

- rabbitmq

- mailhog

networks:

- sales-network

  

volumes:

mongo-data:

rabbitmq-data:

  

networks:

sales-network:

driver: bridge
  ```

## 📊 System Workflow

1. Invoice Creation

- Invoices stored in MongoDB

- Trigger daily report generation

2. Daily Report Generation

- Cron job runs at noon

- Calculates total sales

- Sends report to RabbitMQ

3. Email Notification

- Consumes report from RabbitMQ

- Sends email via Mailhog

## 🧪 Testing

### Invoice Service

	``cd invoice-service

	npm test``

### Email Service

	``cd email-service

	npm test``

## 🔒 Security Considerations

- Environment-based configuration

- Network isolation

- Minimal port exposure

- Use secrets management in production

## 🚀 Deployment Strategies

### Development

- Docker Compose

- Local development with hot reloading

### Production Recommendations

- Kubernetes deployment

- Managed MongoDB

- Production-grade message queue

- Secured email service

## 🔮 Future Improvements

- Add user authentication

- Implement comprehensive logging

- Create advanced reporting

- Add monitoring (Prometheus/Grafana)

- Implement retry mechanisms

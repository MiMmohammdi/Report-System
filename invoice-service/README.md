# Invoice Management Service with Daily Reporting

## 🚀 Project Overview

A robust NestJS-based microservice for invoice management, featuring automated daily sales reporting, RabbitMQ message queuing, and MongoDB data persistence.

## 🌟 Key Features

-   📋 Invoice CRUD Operations
-   📊 Daily Sales Reporting
-   🚀 Automated Scheduled Reports
-   🔄 RabbitMQ Message Queue Integration
-   📦 MongoDB Database
-   🕒 Cron-based Scheduled Tasks

## 🛠 Technology Stack

-   NestJS
-   MongoDB
-   Mongoose ODM
-   RabbitMQ
-   TypeScript
-   @nestjs/schedule

## 📋 Prerequisites

-   Node.js (v16+)
-   Docker
-   Docker Compose

## 🚀 Quick Start

### 1. Clone Repository
	git clone <your-repository-url>
	cd invoice-service
### 2. Environment Configuration

Create `.env` file:


	PORT=3000
	MONGO_URI=mongodb://mongo:27017/invoicedb
	RABBITMQ_URL=amqp://rabbitmq

### 3. Docker Deployment


	docker-compose up -d

## 🔍 Service Details

### Invoice Service

-   Create invoices
-   Retrieve invoices
-   Filter invoices by date range

### Reporting Service

-   Generates daily sales reports
-   Scheduled at 12:00 PM daily
-   Calculates total sales and item-wise sales

### RabbitMQ Service

-   Queues daily sales reports
-   Enables asynchronous communication

## 📊 Daily Report Structure

	{
	  "totalSales": 10000,
	  "itemSales": {
	    "SKU001": 5,
	    "SKU002": 3
	  }
	}

## 🧪 Testing

### Run Tests

	npm test


### Test Coverage


	npm run test:cov

## 🔒 Security Considerations

-   Environment-based configuration
-   Error handling
-   Input validation

## 🔧 Local Development

### Installation

	npm install
	npm run start:dev

### Database Setup

-   MongoDB running on localhost:27017
-   Default database: invoicedb

### RabbitMQ

-   Management UI: [http://localhost:15672](http://localhost:15672)
-   Default Port: 5672

## 📦 Docker Composition

### Services

-   MongoDB
-   RabbitMQ
-   Application Service

### Network

-   Bridge network for inter-service communication

## 🚀 Deployment

### Production Deployment

	npm run build
	npm run start:prod

## 🔮 Future Improvements

-   Add authentication
-   Implement more comprehensive logging
-   Create more detailed reporting
-   Add rate limiting
-   Enhance error handling

## 📘 API Documentation
### Swagger UI

Access the interactive API documentation at:
- Local: http://localhost:3000/api-docs
- Staging/Production: [Your Domain]/api-docs


#### Key Endpoints
- `POST /invoices`: Create a new invoice
- `GET /invoices`: List all invoices
- `GET /invoices/:id`: Get specific invoice
- `GET /invoices/date-range`: Filter invoices by date range

### Reports

-   Automatically generated via cron job
-   Queued in RabbitMQ

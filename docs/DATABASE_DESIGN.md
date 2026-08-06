# Shine On Workshop Management System

# Database Design Document

Version: 1.0

---

# Overview

The database is designed around a **Job Card**.

Every operation performed in the workshop originates from a Job Card.

The Job Card acts as the center of the application.

```
Customer
      │
      ▼
Vehicle
      │
      ▼
Job Card
      │
 ┌────┼───────────────┬─────────────┬───────────────┐
 ▼    ▼               ▼             ▼               ▼

Services
Payments
Expenses
Inventory Usage
Photos
```

---

# Design Principles

- Store only essential data.
- Never store calculated values.
- Calculate totals dynamically.
- Use UUIDs as primary keys.
- Keep the schema simple and scalable.
- Design around real workshop workflows.

---

# Database Tables

## Customer

Stores customer information.

| Field | Type | Description |
|------|------|-------------|
| id | UUID | Primary Key |
| name | String | Customer Name |
| phone | String | Unique Mobile Number |
| isActive | Boolean | Soft delete |
| createdAt | DateTime | Creation Time |
| updatedAt | DateTime | Last Update |

Relationship

```
Customer

1 ------ N

Vehicle
```

---

## Vehicle

Stores customer vehicles.

| Field | Type |
|------|------|
| id | UUID |
| customerId | FK |
| registrationNumber | String |
| brand | String |
| model | String |
| createdAt | DateTime |
| updatedAt | DateTime |

Relationship

```
Vehicle

1 ------ N

Job Card
```

---

## Service

Stores workshop services.

Examples

- Car Wash
- Bike Wash
- Painting
- Interior Cleaning
- Denting
- Polishing
- Coating
- Accessories

No price is stored because every vehicle has a different quotation.

---

## Job Card

Central table.

Represents one customer visit.

Contains

- Customer
- Vehicle
- Status
- Delivery Date
- Notes

Everything else references the Job Card.

---

## Job Card Service

Stores all services included in a Job.

Each selected service becomes one row.

Example

```
Job Card 15

Painting

₹25000
```

Another row

```
Job Card 15

Interior Cleaning

₹5000
```

Estimate is calculated as

```
SUM(price)
```

---

## Payment

Stores all customer payments.

Types

- Advance
- Partial
- Final

Methods

- Cash
- UPI
- Card

Total Paid

```
SUM(Payment.amount)
```

---

## Expense

Stores expenses for a specific Job Card.

Examples

- Paint
- Primer
- Labor
- Accessories

Job Expense

```
SUM(Expense.amount)
```

---

## Expense Category

Predefined expense categories.

Examples

- Paint
- Primer
- Labor
- Material
- Accessories
- Equipment
- Other

---

## Inventory

Stores available stock.

Examples

- Paint
- Shampoo
- Wax
- Foam
- Compound

---

## Inventory Usage

Tracks material consumed for each Job Card.

This automatically reduces inventory quantity.

---

## Photo

Stores before, during and after work photos.

Types

- BEFORE
- DURING
- AFTER

Purpose

Provides proof of vehicle condition.

---

# Calculated Values

The following values are **never stored**.

Estimate

```
SUM(JobCardService.price)
```

Total Paid

```
SUM(Payment.amount)
```

Total Expense

```
SUM(Expense.amount)
```

Balance Due

```
Estimate - Total Paid
```

Estimated Profit

```
Estimate - Total Expense
```

Current Cash Position

```
Total Paid - Total Expense
```

---

# Job Status

```
RECEIVED

↓

INSPECTION

↓

WAITING_APPROVAL

↓

APPROVED

↓

IN_PROGRESS

↓

READY

↓

DELIVERED

↓

CLOSED
```

---

# Financial Workflow

Customer pays Advance

↓

Advance stored in Payment

↓

Workshop purchases Paint

↓

Expense recorded

↓

Customer pays remaining balance

↓

Final Payment recorded

↓

Profit calculated automatically

---

# Business Rules

1. Customer can own multiple vehicles.

2. Vehicle belongs to one customer.

3. Vehicle can have multiple Job Cards.

4. Every Job Card belongs to one Vehicle.

5. Every Payment belongs to one Job Card.

6. Every Expense belongs to one Job Card.

7. Inventory usage always belongs to one Job Card.

8. Photos belong to one Job Card.

9. Job totals are never stored.

10. Reports are generated using calculations.

---

# Version 1 Scope

Included

- Customers
- Vehicles
- Job Cards
- Services
- Payments
- Expenses
- Inventory
- Photos

Future Versions

- Employee Management
- Supplier Management
- Notifications
- Customer Portal
- Multi-Branch Support
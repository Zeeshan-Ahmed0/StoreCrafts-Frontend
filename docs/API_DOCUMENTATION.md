# StoreCrafts API Documentation

## Overview
This document provides comprehensive documentation for all API endpoints, including request/response data types, query parameters, and authentication requirements.

---

## Base URL
```
/api
```

---

## Authentication
- **JWT Token**: Required for most endpoints marked with 🔒
- **Header**: `Authorization: Bearer <token>`
- **Roles**: 
  - `super_admin`: Full system access
  - `store_admin`: Store-specific access
  - `user`: Public access

---

## Endpoints by Module

### 1. Health Check

#### GET `/health/`
Check API health status

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
{
  "status": "ok",
  "storeId": "string|null",
  "timestamp": "2026-02-05T10:30:00.000Z"
}
```

**Status Code**: 200

---

### 2. Authentication

#### POST `/auth/admin/login` 🔒
Admin login endpoint

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Response**:
```json
{
  "token": "string (JWT token)",
  "admin": {
    "id": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "super_admin | store_admin",
    "storeId": "string|null",
    "isActive": "boolean"
  }
}
```

**Status Code**: 200
**Error Codes**: 400, 401

---

#### POST `/auth/user/register`
User registration endpoint

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**Request Body**:
```json
{
  "storeId": "string (required)",
  "phone": "string (required)",
  "name": "string (required)",
  "email": "string (optional, valid email)",
  "password": "string (required)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "email": "string|null",
  "name": "string",
  "phone": "string|null",
  "password": "string (hashed)",
  "isActive": "boolean (default: true)"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### POST `/auth/user/login`
User login endpoint

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**Request Body**:
```json
{
  "storeId": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "email": "string",
  "name": "string",
  "phone": "string|null",
  "password": "string (hashed)",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 400, 401

---

### 3. Admin Management

**Authentication**: 🔒 Required  
**Authorization**: super_admin only

#### GET `/admin/dashboard`
Get dashboard analytics

**Query Parameters**:
- `storeId` (optional): string - Filter by specific store

**Request Body**: None

**Response**:
```json
{
  "totalStores": "number",
  "totalUsers": "number",
  "totalOrders": "number",
  "totalRevenue": "number"
}
```

**Status Code**: 200

---

#### POST `/admin/create`
Create new admin

**Query Parameters**: None

**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)",
  "role": "super_admin | store_admin (required)",
  "storeId": "string (optional, required if role is store_admin)"
}
```

**Response**:
```json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "super_admin | store_admin",
  "storeId": "string|null",
  "isActive": "boolean (default: true)"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### GET `/admin/all`
List all store admins

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "store_admin",
    "storeId": "string|null",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### GET `/admin/detail/:adminId`
Get admin details

**Query Parameters**: None

**URL Parameters**:
- `adminId` (required): string

**Request Body**: None

**Response**:
```json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "super_admin | store_admin",
  "storeId": "string|null",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### PUT `/admin/update/:adminId`
Update admin details

**Query Parameters**: None

**URL Parameters**:
- `adminId` (required): string

**Request Body**:
```json
{
  "email": "string (optional, valid email)",
  "password": "string (optional)",
  "role": "super_admin | store_admin (optional)",
  "storeId": "string|null (optional)",
  "isActive": "boolean (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "super_admin | store_admin",
  "storeId": "string|null",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### DELETE `/admin/delete/:adminId`
Delete admin

**Query Parameters**: None

**URL Parameters**:
- `adminId` (required): string

**Request Body**: None

**Response**:
```json
{
  "id": "string"
}
```

**Status Code**: 200
**Error Codes**: 404

---

### 4. Store Management

**Authentication**: 🔒 Required (super_admin only)  
**Authorization**: super_admin only

#### POST `/admin/stores/create`
Create new store

**Query Parameters**: None

**Request Body**:
```json
{
  "name": "string (required)",
  "subtitle": "string (required)",
  "description": "string (required)",
  "logo": "string|null (optional, URL)",
  "theme": "object|null (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "subtitle": "string",
  "description": "string",
  "logo": "string|null",
  "theme": "object|null"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### GET `/admin/stores/all`
List all stores

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "subtitle": "string",
    "description": "string",
    "logo": "string|null",
    "theme": "object|null"
  }
]
```

**Status Code**: 200

---

#### GET `/admin/stores/detail/:storeId`
Get store details

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "subtitle": "string",
  "description": "string",
  "logo": "string|null",
  "theme": "object|null"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### PUT `/admin/stores/update/:storeId`
Update store details

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**:
```json
{
  "name": "string (optional)",
  "subtitle": "string (optional)",
  "description": "string (optional)",
  "logo": "string|null (optional, URL)",
  "theme": "object|null (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "subtitle": "string",
  "description": "string",
  "logo": "string|null",
  "theme": "object|null"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### DELETE `/admin/stores/delete/:storeId`
Delete store

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
{
  "id": "string"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### POST `/admin/stores/:storeId/assign-admin`
Assign admin to store

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**:
```json
{
  "adminId": "string (required)"
}
```

**Response**: Depends on assignment logic

**Status Code**: 200
**Error Codes**: 400, 404

---

### 5. Banners

#### GET `/banners/public/:storeId`
Get public banners for store

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "title": "string|null",
    "image": "string (URL)",
    "link": "string|null",
    "position": "number",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### GET `/banners/`
Get all banners for authenticated store

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "title": "string|null",
    "image": "string (URL)",
    "link": "string|null",
    "position": "number",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### POST `/banners/`
Create new banner

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "image": "string (required, URL)",
  "title": "string|null (optional)",
  "link": "string|null (optional)",
  "position": "number (optional, default: 0)",
  "isActive": "boolean (optional, default: true)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "title": "string|null",
  "image": "string",
  "link": "string|null",
  "position": "number",
  "isActive": "boolean"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/banners/:bannerId`
Update banner

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `bannerId` (required): number

**Request Body**:
```json
{
  "title": "string|null (optional)",
  "image": "string|null (optional, URL)",
  "link": "string|null (optional)",
  "position": "number (optional)",
  "isActive": "boolean (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "title": "string|null",
  "image": "string",
  "link": "string|null",
  "position": "number",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/banners/:bannerId`
Delete banner

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `bannerId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 404

---

### 6. Categories

#### GET `/categories/all`
Get all categories

**Authentication**: None  
**Authorization**: Public

**Query Parameters**:
- `storeId` (optional): string - Header or query parameter

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "name": "string",
    "image": "string (URL)",
    "subtitle": "string|null",
    "description": "string|null"
  }
]
```

**Status Code**: 200
**Error Codes**: 400 (if storeId missing)

---

#### POST `/categories/create`
Create new category

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "name": "string (required)",
  "image": "string (required, URL)",
  "subtitle": "string|null (optional)",
  "description": "string|null (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "name": "string",
  "image": "string",
  "subtitle": "string|null",
  "description": "string|null"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/categories/update/:categoryId`
Update category

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `categoryId` (required): number

**Request Body**:
```json
{
  "name": "string (optional)",
  "image": "string|null (optional, URL)",
  "subtitle": "string|null (optional)",
  "description": "string|null (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "name": "string",
  "image": "string",
  "subtitle": "string|null",
  "description": "string|null"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/categories/delete/:categoryId`
Delete category

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `categoryId` (required): number

**Request Body**: None

**Response**:
```json
{}
```

**Status Code**: 200

---

### 7. Coupons

#### GET `/coupons/public/:storeId`
Get public active coupons

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "code": "string",
    "isPercentage": "boolean",
    "value": "number",
    "startsAt": "date|null",
    "endsAt": "date|null",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### POST `/coupons/public/:storeId/validate`
Validate coupon code

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**:
```json
{
  "code": "string (required)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "code": "string",
  "isPercentage": "boolean",
  "value": "number",
  "startsAt": "date|null",
  "endsAt": "date|null",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### GET `/coupons/`
Get all coupons for store

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**:
- `active` (optional): "true|false" - Filter active coupons
- `expired` (optional): "true|false" - Filter expired coupons
- `sort` (optional): "discount" - Sort by discount value

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "code": "string",
    "isPercentage": "boolean",
    "value": "number",
    "startsAt": "date|null",
    "endsAt": "date|null",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### POST `/coupons/`
Create new coupon

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "code": "string (required)",
  "value": "number (required)",
  "isPercentage": "boolean (optional, default: true)",
  "startsAt": "date|null (optional, ISO format)",
  "endsAt": "date|null (optional, ISO format)",
  "isActive": "boolean (optional, default: true)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "code": "string",
  "isPercentage": "boolean",
  "value": "number",
  "startsAt": "date|null",
  "endsAt": "date|null",
  "isActive": "boolean"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/coupons/:couponId`
Update coupon

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `couponId` (required): number

**Request Body**:
```json
{
  "code": "string (optional)",
  "isPercentage": "boolean (optional)",
  "value": "number (optional)",
  "startsAt": "date|null (optional, ISO format)",
  "endsAt": "date|null (optional, ISO format)",
  "isActive": "boolean (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "code": "string",
  "isPercentage": "boolean",
  "value": "number",
  "startsAt": "date|null",
  "endsAt": "date|null",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/coupons/:couponId`
Delete coupon

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `couponId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 404

---

### 8. Footers

#### GET `/footers/public/:storeId`
Get public footer links

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "label": "string",
    "url": "string"
  }
]
```

**Status Code**: 200

---

#### GET `/footers/`
Get all footer links for store

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "label": "string",
    "url": "string"
  }
]
```

**Status Code**: 200

---

#### POST `/footers/`
Create new footer link

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "label": "string (required)",
  "url": "string (required)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "label": "string",
  "url": "string"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/footers/:footerId`
Update footer link

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `footerId` (required): number

**Request Body**:
```json
{
  "label": "string (optional)",
  "url": "string (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "label": "string",
  "url": "string"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/footers/:footerId`
Delete footer link

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `footerId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 404

---

### 9. Navbar Options

#### GET `/navbar/public/:storeId`
Get public navbar options

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "label": "string",
    "url": "string",
    "type": "string",
    "position": "number",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### GET `/navbar/`
Get all navbar options for store

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "label": "string",
    "url": "string",
    "type": "string",
    "position": "number",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200

---

#### POST `/navbar/`
Create new navbar option

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "label": "string (required)",
  "url": "string (required)",
  "type": "string (optional, default: 'link')",
  "position": "number (optional, default: 0)",
  "isActive": "boolean (optional, default: true)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "label": "string",
  "url": "string",
  "type": "string",
  "position": "number",
  "isActive": "boolean"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/navbar/:optionId`
Update navbar option

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `optionId` (required): number

**Request Body**:
```json
{
  "label": "string (optional)",
  "url": "string (optional)",
  "type": "string (optional)",
  "position": "number (optional)",
  "isActive": "boolean (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "label": "string",
  "url": "string",
  "type": "string",
  "position": "number",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/navbar/:optionId`
Delete navbar option

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `optionId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### PUT `/navbar/reorder`
Reorder navbar options

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "items": [
    {
      "id": "number (required)",
      "position": "number (optional, default: 0)"
    }
  ]
}
```

**Response**:
```json
{
  "count": "number"
}
```

**Status Code**: 200
**Error Codes**: 400

---

### 10. Orders

**Authentication**: 🔒 Required  
**Authorization**: super_admin or store_admin

#### GET `/orders/all`
Get all orders

**Query Parameters**:
- `status` (optional): string - Filter by order status
- `storeId` (optional): string - Filter by store (super_admin only)
- `userId` (optional): number - Filter by user
- `sort` (optional): "total_value|date" - Sort orders

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "userId": "number|null",
    "name": "string",
    "phone": "string",
    "address": "string",
    "paymentMethod": "string",
    "status": "string",
    "totalValue": "number",
    "createdAt": "date"
  }
]
```

**Status Code**: 200

---

#### GET `/orders/detail/:orderId`
Get order details

**Query Parameters**: None

**URL Parameters**:
- `orderId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "userId": "number|null",
  "name": "string",
  "phone": "string",
  "address": "string",
  "paymentMethod": "string",
  "status": "string",
  "createdAt": "date",
  "items": [
    {
      "id": "number",
      "orderId": "number",
      "productId": "number",
      "variantId": "number|null",
      "name": "string",
      "quantity": "number",
      "price": "number",
      "comparePrice": "number|null"
    }
  ]
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### POST `/orders/create`
Create new order

**Query Parameters**: None

**Request Body**:
```json
{
  "storeId": "string (required for super_admin)",
  "userId": "number|null (optional)",
  "name": "string (required)",
  "phone": "string (required)",
  "address": "string (required)",
  "paymentMethod": "string (optional, default: 'cod')",
  "items": [
    {
      "productId": "number (required)",
      "variantId": "number|null (optional)",
      "name": "string (required)",
      "quantity": "number (optional, default: 1)",
      "price": "number (required)",
      "comparePrice": "number|null (optional)"
    }
  ]
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "userId": "number|null",
  "name": "string",
  "phone": "string",
  "address": "string",
  "paymentMethod": "string",
  "status": "pending"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### POST `/orders/cancel/:orderId/`
Cancel order

**Query Parameters**: None

**URL Parameters**:
- `orderId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "userId": "number|null",
  "name": "string",
  "phone": "string",
  "address": "string",
  "paymentMethod": "string",
  "status": "cancelled"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

### 11. Policies

#### GET `/policies/public/:storeId`
Get public store policies

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "privacy": "string|null",
    "shipping": "string|null",
    "returnPolicy": "string|null"
  }
]
```

**Status Code**: 200

---

#### GET `/policies/`
Get all policies for store

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "privacy": "string|null",
    "shipping": "string|null",
    "returnPolicy": "string|null"
  }
]
```

**Status Code**: 200

---

#### POST `/policies/`
Create new policy

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "privacy": "string|null (optional)",
  "shipping": "string|null (optional)",
  "returnPolicy": "string|null (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "privacy": "string|null",
  "shipping": "string|null",
  "returnPolicy": "string|null"
}
```

**Status Code**: 201

---

#### PUT `/policies/:policyId`
Update policy

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `policyId` (required): number

**Request Body**:
```json
{
  "privacy": "string|null (optional)",
  "shipping": "string|null (optional)",
  "returnPolicy": "string|null (optional)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "privacy": "string|null",
  "shipping": "string|null",
  "returnPolicy": "string|null"
}
```

**Status Code**: 200
**Error Codes**: 404

---

#### DELETE `/policies/:policyId`
Delete policy

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `policyId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 404

---

### 12. Products

#### GET `/products/all`
Get all products

**Authentication**: None  
**Authorization**: Public

**Query Parameters**:
- `storeId` (optional): string - Required if not authenticated
- `categoryId` (optional): number - Filter by category
- `minPrice` (optional): number - Minimum price filter
- `maxPrice` (optional): number - Maximum price filter
- `search` (optional): string - Search by product name

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "categoryId": "number|null",
    "name": "string",
    "description": "string|null",
    "tag": "string|null",
    "primaryImage": "string|null",
    "secondaryImage": "string|null",
    "price": "number",
    "comparePrice": "number|null",
    "isActive": "boolean",
    "displayPrice": "number",
    "displayComparePrice": "number|null",
    "variants": [
      {
        "id": "number",
        "price": "number",
        "comparePrice": "number|null"
      }
    ]
  }
]
```

**Status Code**: 200
**Error Codes**: 400

---

#### GET `/products/detail/:productId`
Get product details

**Authentication**: None  
**Authorization**: Public

**Query Parameters**:
- `storeId` (optional): string - Required if not authenticated

**URL Parameters**:
- `productId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "categoryId": "number|null",
  "name": "string",
  "description": "string|null",
  "tag": "string|null",
  "primaryImage": "string|null",
  "secondaryImage": "string|null",
  "price": "number",
  "comparePrice": "number|null",
  "isActive": "boolean",
  "variants": [
    {
      "id": "number",
      "productId": "number",
      "name": "string",
      "value": "string",
      "image": "string|null",
      "price": "number",
      "comparePrice": "number|null",
      "default": "boolean",
      "isActive": "boolean"
    }
  ],
  "reviews": [
    {
      "id": "number",
      "rating": "number",
      "comment": "string|null",
      "image": "string|null"
    }
  ]
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### POST `/products/create`
Create new product

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**Request Body**:
```json
{
  "name": "string (required)",
  "price": "number (required)",
  "categoryId": "number|null (optional)",
  "description": "string|null (optional)",
  "tag": "string|null (optional)",
  "primaryImage": "string|null (optional, URL)",
  "secondaryImage": "string|null (optional, URL)",
  "comparePrice": "number|null (optional)",
  "isActive": "boolean (optional, default: true)",
  "variants": [
    {
      "name": "string (optional, default: 'Default')",
      "value": "string (optional)",
      "image": "string|null (optional, URL)",
      "price": "number (optional)",
      "comparePrice": "number|null (optional)",
      "default": "boolean (optional, default: false)",
      "isActive": "boolean (optional, default: true)"
    }
  ]
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "categoryId": "number|null",
  "name": "string",
  "description": "string|null",
  "tag": "string|null",
  "primaryImage": "string|null",
  "secondaryImage": "string|null",
  "price": "number",
  "comparePrice": "number|null",
  "isActive": "boolean"
}
```

**Status Code**: 201
**Error Codes**: 400

---

#### PUT `/products/update/:productId`
Update product

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `productId` (required): number

**Request Body**:
```json
{
  "name": "string (optional)",
  "price": "number (optional)",
  "categoryId": "number|null (optional)",
  "description": "string|null (optional)",
  "tag": "string|null (optional)",
  "primaryImage": "string|null (optional, URL)",
  "secondaryImage": "string|null (optional, URL)",
  "comparePrice": "number|null (optional)",
  "isActive": "boolean (optional)",
  "variants": [
    {
      "id": "number (optional, omit for new variants)",
      "name": "string (optional)",
      "value": "string (optional)",
      "image": "string|null (optional, URL)",
      "price": "number (optional)",
      "comparePrice": "number|null (optional)",
      "default": "boolean (optional)",
      "isActive": "boolean (optional)"
    }
  ]
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "categoryId": "number|null",
  "name": "string",
  "description": "string|null",
  "tag": "string|null",
  "primaryImage": "string|null",
  "secondaryImage": "string|null",
  "price": "number",
  "comparePrice": "number|null",
  "isActive": "boolean"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### DELETE `/products/delete/:productId`
Delete product

**Authentication**: 🔒 Required  
**Authorization**: store_admin

**Query Parameters**: None

**URL Parameters**:
- `productId` (required): number

**Request Body**: None

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 200
**Error Codes**: 400, 404

---

### 13. Public Endpoints

#### GET `/public/stores/:storeId/products`
Get products for public store view

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "categoryId": "number|null",
    "name": "string",
    "description": "string|null",
    "tag": "string|null",
    "primaryImage": "string|null",
    "secondaryImage": "string|null",
    "price": "number",
    "comparePrice": "number|null",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200
**Error Codes**: 400

---

#### GET `/public/stores/:storeId/products/:productId/variants`
Get variants for product

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string
- `productId` (required): number

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "productId": "number",
    "name": "string",
    "value": "string",
    "image": "string|null",
    "price": "number",
    "comparePrice": "number|null",
    "default": "boolean",
    "isActive": "boolean"
  }
]
```

**Status Code**: 200
**Error Codes**: 400, 404

---

#### POST `/public/stores/:storeId/orders`
Create public order (guest checkout)

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**URL Parameters**:
- `storeId` (required): string

**Request Body**:
```json
{
  "userId": "number|null (optional)",
  "name": "string (required)",
  "phone": "string (required)",
  "address": "string (required)",
  "items": [
    {
      "productId": "number (required)",
      "variantId": "number|null (optional)",
      "name": "string (required)",
      "quantity": "number (optional, default: 1)",
      "price": "number (required)",
      "comparePrice": "number|null (optional)"
    }
  ]
}
```

**Response**:
```json
{
  "id": "number"
}
```

**Status Code**: 201
**Error Codes**: 400

---

### 14. Reviews

#### GET `/reviews/`
Get all reviews (admin only)

**Authentication**: 🔒 Required  
**Authorization**: super_admin or store_admin

**Query Parameters**:
- `storeId` (optional): string - Filter by store (super_admin only)
- `rating` (optional): number - Filter by rating
- `withImage` (optional): "true|false" - Filter reviews with images
- `sort` (optional): "rating" - Sort by rating

**Request Body**: None

**Response**:
```json
[
  {
    "id": "number",
    "storeId": "string",
    "productId": "number",
    "orderItemId": "number",
    "userId": "number|null",
    "rating": "number",
    "comment": "string|null",
    "image": "string|null",
    "isApproved": "boolean"
  }
]
```

**Status Code**: 200
**Error Codes**: 400

---

#### POST `/reviews/`
Create new review

**Authentication**: None  
**Authorization**: Public

**Query Parameters**: None

**Request Body**:
```json
{
  "storeId": "string (required)",
  "orderItemId": "number (required)",
  "userId": "number|null (optional)",
  "rating": "number (required, 1-5)",
  "comment": "string|null (optional)",
  "image": "string|null (optional, URL)"
}
```

**Response**:
```json
{
  "id": "number",
  "storeId": "string",
  "productId": "number",
  "orderItemId": "number",
  "userId": "number|null",
  "rating": "number",
  "comment": "string|null",
  "image": "string|null",
  "isApproved": "boolean"
}
```

**Status Code**: 201
**Error Codes**: 400, 404

---

### 15. Store Overview

**Authentication**: 🔒 Required  
**Authorization**: store_admin

#### GET `/store/overview`
Get store overview/dashboard

**Query Parameters**: None

**Request Body**: None

**Response**:
```json
{
  "message": "Store overview"
}
```

**Status Code**: 200

---

### 16. File Uploads

**Authentication**: 🔒 Required  
**Authorization**: super_admin or store_admin

#### POST `/uploads/image`
Upload image file

**Content-Type**: multipart/form-data

**Query Parameters**: None

**Form Data**:
- `image` (required): File - Image file to upload

**Response**:
```json
{
  "filename": "string",
  "url": "string",
  "size": "number",
  "mimetype": "string"
}
```

**Status Code**: 200
**Error Codes**: 400

---

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "string"
}
```

All error responses follow this format:
```json
{
  "success": false,
  "error": "string",
  "statusCode": "number"
}
```

---

## Common Error Codes

- **400**: Bad Request - Invalid input or missing required fields
- **401**: Unauthorized - Invalid credentials or token
- **404**: Not Found - Resource does not exist
- **500**: Internal Server Error - Server error

---

## Notes

- Dates should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Store scope is automatically enforced for store_admin users
- Prices are numeric values (no currency symbol)
- All string fields have a length limit based on database schema
- Boolean values can be sent as `true/false`, `1/0`, or `"true"/"false"`


# StoreCrafts

StoreCrafts is a multi-tenant e-commerce platform that enables multiple independent stores to operate within a single system, with strict data isolation enforced via `store_id`.

## Architecture

* Backend: Node.js (Express)
* Frontend: Next.js (Admin + Storefront)
* Database: PostgreSQL
* ORM: Sequelize
* Model: Shared database, tenant-scoped using `store_id`

## Multi-Tenancy Rules

* Each tenant represents a single store
* All tenant-specific data must include `store_id`
* No cross-store data access is allowed

## Core Modules

* Stores: Store configuration and branding
* Products: Product management with multiple variants
* Orders: Cash on Delivery (COD) only; address stored within the Orders table
* Users: Store-specific customers
* Content: Navbar, Footer, Banners, Store Policies
* Extras: Reviews and Coupons

## API Principles

* RESTful architecture
* All endpoints must be tenant-aware
* Modular structure (Controller / Service pattern)

## Constraints (v1)

* No online payments (COD only)
* No activity logs
* No microservices

## Domains & Responsibilities (v1)

* `storecrafts.com` → Marketing site (landing, pricing, how-it-works)
* `admin.storecrafts.com` → Super Admin panel (platform-level control)
* `storecrafts.com/[storename]` → Storefront (customer-facing)
* `[storename].admin.storecrafts.com` → Store Admin panel (merchant dashboard)

> Note: Custom domains for stores will be introduced in v2

## Routing Strategy (v1)

* Use Next.js App Router with route groups:
  `(marketing)`, `(superadmin)`, `(storefront)`, `(storeadmin)`

* Implement host-based routing via `middleware.ts`:

  * Detect host from request headers
  * Rewrite requests to the appropriate route group

* Use slug-based routing instead of IDs:

  * Example:
    `/storecrafts.com/[storename]/[productSlug]`
    instead of
    `/storecrafts.com/store/12345`

* Extract `storename` from:

  * URL path → `/storecrafts.com/[storename]`
  * Subdomain → `[storename].admin.storecrafts.com`

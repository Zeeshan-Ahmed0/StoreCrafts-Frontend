# Frontend Route Groups - Migration Guide

This guide explains how to reorganize the existing frontend code to match the new route groups structure specified in Storecrafts-Summary.md.

## New Structure Overview

```
app/
├── (marketing)/              ← Landing page, public pages
│   ├── layout.tsx           ✅ Created
│   ├── page.tsx            👈 MOVE: app/page.tsx → here
│   ├── pricing/
│   ├── how-it-works/
│   └── about/
│
├── (superadmin)/             ← Platform admin (super_admin role only)
│   ├── layout.tsx           ✅ Created
│   ├── page.tsx            👈 MOVE: app/superadmin/page.tsx → here
│   ├── dashboard/          👈 MOVE: app/superadmin/dashboard/ → here
│   ├── stores/             👈 MOVE: app/superadmin/stores/ → here
│   └── users/              👈 MOVE: app/superadmin/users/ → here
│
├── (storeadmin)/             ← Store merchant dashboard
│   └── [storename]/         ← Dynamic store context
│       ├── layout.tsx       ✅ Created (extracts [storename] param)
│       ├── page.tsx        👈 MOVE: app/admin/page.tsx → here
│       ├── dashboard/      👈 MOVE: app/admin/dashboard/ → here
│       ├── catalog/        👈 MOVE: app/admin/catalog/ → here
│       ├── orders/         👈 MOVE: app/admin/orders/ → here
│       ├── coupons/        👈 MOVE: app/admin/coupons/ → here
│       ├── reviews/        👈 MOVE: app/admin/reviews/ → here
│       ├── users/          👈 MOVE: app/admin/users/ → here
│       ├── store-content/  👈 MOVE: app/admin/store-content/ → here
│       ├── profile/        👈 MOVE: app/admin/profile/ → here
│       └── layout.tsx      👈 MOVE: app/admin/layout.tsx → here (update to use [storename])
│
├── (storefront)/             ← Customer storefront
│   └── [storename]/         ← Dynamic store context
│       ├── layout.tsx       ✅ Created (extracts [storename] param)
│       ├── page.tsx        👈 MOVE: app/shop/... → here (home page)
│       ├── [category]/
│       │   └── [product]/  👈 MOVE: app/shop/[category]/[product]/ → here
│       ├── cart/           👈 MOVE: app/cart/ → here
│       ├── checkout/       👈 MOVE: app/checkout/ → here
│       ├── orders/         👈 MOVE: app/orders/ → here (customer order history)
│       └── policies/       👈 MOVE: app/policies/ → here (public view)
│
├── (auth)/                   ← Authentication pages
│   ├── layout.tsx           ✅ Created
│   ├── login/              👈 MOVE: app/login/ → here
│   └── forgot-password/    👈 MOVE: app/forgot-password/ → here
│
├── globals.css              ⭐ KEEP: No change
├── layout.tsx               ⭐ KEEP: Root layout (no change)
└── favicon.ico              ⭐ KEEP: No change
```

---

## Migration Steps

### Step 1: Move Root Application Files
```bash
# Keep at top level - NO CHANGES
app/globals.css    # Copy if not already there
app/layout.tsx     # Copy if not already there
app/favicon.ico    # Copy if not already there
```

### Step 2: Move Marketing Pages
```bash
# FROM: app/page.tsx
# TO:   app/(marketing)/page.tsx
# ACTION: Move file
```

Create additional marketing pages:
```bash
app/(marketing)/pricing/page.tsx           # New file
app/(marketing)/how-it-works/page.tsx      # New file
app/(marketing)/about/page.tsx             # New file
```

### Step 3: Move Super Admin Pages
```bash
# FROM: app/superadmin/
# TO:   app/(superadmin)/

# Move these files:
app/superadmin/page.tsx         → app/(superadmin)/page.tsx
app/superadmin/dashboard/       → app/(superadmin)/dashboard/
app/superadmin/stores/          → app/(superadmin)/stores/
app/superadmin/users/           → app/(superadmin)/users/

# NO CHANGES to file contents
```

### Step 4: Move Store Admin Pages
This requires updating file contents to use `[storename]` parameter!

```bash
# FROM: app/admin/
# TO:   app/(storeadmin)/[storename]/

# Move these files:
app/admin/page.tsx              → app/(storeadmin)/[storename]/page.tsx
app/admin/dashboard/            → app/(storeadmin)/[storename]/dashboard/
app/admin/catalog/              → app/(storeadmin)/[storename]/catalog/
app/admin/orders/               → app/(storeadmin)/[storename]/orders/
app/admin/coupons/              → app/(storeadmin)/[storename]/coupons/
app/admin/reviews/              → app/(storeadmin)/[storename]/reviews/
app/admin/users/                → app/(storeadmin)/[storename]/users/
app/admin/store-content/        → app/(storeadmin)/[storename]/store-content/
app/admin/profile/              → app/(storeadmin)/[storename]/profile/
app/admin/layout.tsx            → app/(storeadmin)/[storename]/layout.tsx (UPDATE)
```

**IMPORTANT:** Update existing admin layout.tsx to use [storename]:
- Extract `storename` from `useParams()`
- Pass storename to API calls (typically already in AuthContext)
- Validate user has access to this storename

### Step 5: Move Storefront Pages
Update file contents to use `[storename]` parameter!

```bash
# FROM: app/shop/, app/cart/, app/checkout/, app/orders/, app/policies/
# TO:   app/(storefront)/[storename]/

# Move these files:
app/shop/page.tsx                           → app/(storefront)/[storename]/page.tsx
app/shop/[category]/[product]/page.tsx      → app/(storefront)/[storename]/[category]/[product]/page.tsx
app/shop/[category]/page.tsx                → app/(storefront)/[storename]/[category]/page.tsx (if exists)
app/cart/*                                  → app/(storefront)/[storename]/cart/
app/checkout/*                              → app/(storefront)/[storename]/checkout/
app/orders/*                                → app/(storefront)/[storename]/orders/
app/policies/*                              → app/(storefront)/[storename]/policies/
```

**IMPORTANT:** Update storefront pages to extract [storename]:
- Use `useParams()` to get `storename`
- Pass storename to API calls: `GET /api/public/stores/{storename}/products`
- Display store name/branding at top

### Step 6: Move Auth Pages
```bash
# FROM: app/login/, app/forgot-password/
# TO:   app/(auth)/

# Note: login/forgot-password work for BOTH store admin and public users
# Keep them shared in (auth) group
app/login/*              → app/(auth)/login/
app/forgot-password/*    → app/(auth)/forgot-password/

# NO CHANGES to file contents needed - auth already handles redirects
```

---

## Content Updates Required

### For Store Admin Pages (storeadmin)
After moving files to `app/(storeadmin)/[storename]/`, update the layout and components:

```typescript
// In components or pages under (storeadmin)/[storename]/
import { useParams } from "next/navigation";

export default function SomeComponent() {
  const params = useParams();
  const storename = params.storename as string;
  
  // Now pass storename to API calls
  const response = await apiService.get(`/api/products`, {
    store_slug: storename
  });
  
  return <div>{/* Use storename in display */}</div>;
}
```

### For Storefront Pages (storefront)
After moving files to `app/(storefront)/[storename]/`, update components:

```typescript
// In pages under (storefront)/[storename]/
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const storename = params.storename as string;
  
  // Fetch store-specific products
  const products = await apiService.get(
    `/api/public/stores/${storename}/products`
  );
  
  return <div>{/* Display products for this store */}</div>;
}
```

---

## Deletion (After Migration)

Once all files have been moved and verified working:

```bash
# DELETE THESE EMPTY DIRECTORIES:
rm -rf app/admin/
rm -rf app/superadmin/
rm -rf app/shop/
rm -rf app/cart/
rm -rf app/checkout/
rm -rf app/orders/
rm -rf app/login/
rm -rf app/forgot-password/
rm -rf app/policies/

# KEEP app/page.tsx is already moved, but if old one still exists:
# rm app/page.tsx (old)

# KEEP these at root level
# app/globals.css
# app/layout.tsx
# app/favicon.ico
```

---

## Middleware in Action

With middleware.ts in place, here's how routing works:

### Example 1: Store Admin Access
```
URL: https://mystore.admin.storecrafts.com/dashboard
↓
middleware detects: mystore.admin.storecrafts.com
↓
rewrites to: /(storeadmin)/mystore/dashboard
↓
loaded route: app/(storeadmin)/[storename]/dashboard/page.tsx
↓
[storename] param = "mystore"
```

### Example 2: Storefront Access
```
URL: https://storecrafts.com/awesome-store/products/shoe-123
↓
middleware detects /awesome-store as storename
↓
rewrites to: /(storefront)/awesome-store/products/shoe-123
↓
loaded route: app/(storefront)/[storename]/products/[...slug]/page.tsx
↓
[storename] param = "awesome-store"
```

### Example 3: Marketing Page
```
URL: https://storecrafts.com/pricing
↓
middleware detects reservedRoute("pricing")
↓
rewrites to: /(marketing)/pricing
↓
loaded route: app/(marketing)/pricing/page.tsx
```

### Example 4: Super Admin
```
URL: https://admin.storecrafts.com/stores
↓
middleware detects: admin.storecrafts.com
↓
rewrites to: /(superadmin)/stores
↓
loaded route: app/(superadmin)/stores/page.tsx
```

---

## Local Development (without subdomains)

For local testing without setting up DNS/subdomains:

```bash
# Use query parameters to simulate subdomains:

# Store Admin (mystore)
http://localhost:3000?admin=mystore/dashboard

# Super Admin
http://localhost:3000?superadmin=true/stores

# Marketing (default)
http://localhost:3000/
http://localhost:3000/pricing

# Storefront
http://localhost:3000/mystore/products
```

---

## Files Already Created / Ready

✅ `middleware.ts` - Host-based routing detection & rewriting
✅ `app/(marketing)/layout.tsx` - Marketing layout
✅ `app/(superadmin)/layout.tsx` - SuperAdmin layout
✅ `app/(storeadmin)/[storename]/layout.tsx` - StoreAdmin layout with param extraction
✅ `app/(storefront)/[storename]/layout.tsx` - Storefront layout with param extraction
✅ `app/(auth)/layout.tsx` - Auth layout

## Next Steps

1. **Manually move existing files** from old locations to new route group structure
2. **Test routing** with middleware:
   - Visit different URLs to verify correct route loads
   - Check console for any "storename is undefined" errors
3. **Update component code** in moved files to use `useParams()` for `[storename]`
4. **Update API service calls** to include store context
5. **Delete old directories** after verifying all is working

## Files Requiring Content Updates (Priority)

- [ ] AdminLayout → StoreAdminLayout (extract [storename])
- [ ] ProductDetail page (storefront) → use [storename]
- [ ] Products list page (storeadmin) → use [storename]
- [ ] Checkout page → use [storename]
- [ ] Cart page → use [storename]

---

## Troubleshooting

### Issue: Route not found (404)
**Solution:** Verify middleware.ts is in the correct location (`StoreCrafts-Frontend/middleware.ts` at root)

### Issue: [storename] shows as undefined in params
**Solution:** Make sure layout.tsx is extracting params correctly:
```typescript
const params = useParams();
const storename = params?.storename as string;
```

### Issue: API calls failing with 401
**Solution:** Pass store context correctly to API endpoints:
```typescript
// Include store_slug in parameters
const products = await apiService.get(
  `/api/products?store_slug=${storename}`
);
```

---

## Summary of Changes

| Area | Change | Impact |
|------|--------|--------|
| **Middleware** | Added host-based routing | Enables subdomain routing (admin.storecrafts.com) |
| **Route Groups** | Organized into 5 groups | Separates concerns: marketing, auth, superadmin, storeadmin, storefront |
| **Layouts** | Created 5 new layouts | Each group has isolated layout logic |
| **Params** | Added [storename] dynamic | Store admin and storefront routes now have store context |
| **Auth** | RoleGuard applied | SuperAdmin routes check for super_admin role |
| **Backward Compat** | Old routes still work (path-based) | Can transition gradually before deleting old dirs |

---

**Status:** All infrastructure created. Ready for file migration! ✅

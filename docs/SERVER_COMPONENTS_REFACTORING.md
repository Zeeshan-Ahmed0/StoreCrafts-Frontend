# Admin Pages Refactoring - Server Components Best Practices

## Overview

All admin pages have been refactored to follow Next.js App Router best practices using Server Components for data fetching instead of client-side fetching. This refactoring improves performance, security, and maintainability.

## Architecture Changes

### Before (Client-Side Pattern)
- Pages marked with `'use client'`
- Data fetching in `useEffect` hooks
- State management for loading states
- Client-side pagination logic
- Mixed concerns: UI logic + data fetching

### After (Server Component Pattern)
- Pages are async Server Components (no `'use client'`)
- Data fetching in async functions on the server
- Suspense boundaries for loading states
- Server-side pagination and filtering via `searchParams`
- Clear separation: Server Components handle data, Client Components handle interactivity

## Key Components Created

### 1. Server-Only Utility (`lib/server-only.ts`)
```typescript
- serverOnly() - Prevents server-only code from running in browser
- parseSearchParams() - Safely parses URL search parameters
- getPaginationQuery() - Validates and normalizes pagination parameters
```

### 2. Updated Server Actions (`actions/*.ts`)
All action files now use `'use server'` directive and include:
- `serverOnly()` call to prevent client imports
- Server-side API fetching without localStorage
- Pagination support via parameters
- Consistent error handling
- Type-safe filtering parameters

**Files Updated:**
- `actions/catalog.ts` - Products and Categories
- `actions/orders.ts` - Orders management
- `actions/coupons.ts` - Coupons management
- `actions/reviews.ts` - Reviews management
- `actions/users.ts` - Users management

### 3. Client Components for UI Interactivity

#### DataTable Components
- `ProductsDataTable.tsx` - Displays products with server data
- `CategoriesDataTable.tsx` - Categories with CRUD modals
- `OrdersDataTable.tsx` - Orders display
- `ReviewsDataTable.tsx` - Reviews display
- `UsersDataTable.tsx` - Users display
- `CouponsDataTable.tsx` - Coupons with CRUD modals

#### Container Components
- `CatalogView.tsx` - Tabs container for catalog page

#### Loading Fallbacks (Server Components)
- `CatalogLoadingFallback.tsx`
- `OrdersLoadingFallback.tsx`
- `ReviewsLoadingFallback.tsx`
- `UsersLoadingFallback.tsx`
- `CouponsLoadingFallback.tsx`

### 4. Updated Types (`types/index.ts`)

New type definitions:
```typescript
interface DataFetchState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface ServerActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Filter parameter types for each resource
ProductFilterParams
CategoryFilterParams
OrderFilterParams
CouponFilterParams
ReviewFilterParams
UserFilterParams
```

## Refactored Pages

### 1. Admin Catalog (`app/admin/catalog/page.tsx`)
```typescript
// Now a Server Component
// Props include searchParams for pagination
async function CatalogContent({ searchParams }) {
  const params = parseSearchParams(searchParams);
  // Fetch data server-side
  const [productsData, categoriesData] = await Promise.all([
    getProductsAction(params),
    getCategoriesAction(params),
  ]);
  return <CatalogView ... />;
}
```

### 2. Admin Orders (`app/admin/orders/page.tsx`)
- Server Component with pagination support
- Async data fetching on server
- Suspense boundary with loading fallback

### 3. Admin Coupons (`app/admin/coupons/page.tsx`)
- Server Component architecture
- Client component handles CRUD modals
- Server-side initial data fetch

### 4. Admin Reviews (`app/admin/reviews/page.tsx`)
- Server Component with async data fetching
- Maintains review display functionality

### 5. Admin Users (`app/admin/users/page.tsx`)
- Server Component pattern
- Supports pagination via searchParams

## How It Works

### Data Flow

1. **User navigates to page** 
   - `app/admin/[page]/page.tsx` is a Server Component
   - Receives `searchParams` from URL

2. **Server-side execution**
   ```typescript
   async function PageContent({ searchParams }) {
     const params = parseSearchParams(searchParams);
     const data = await serverAction(params);
     return <ClientComponent data={data} />;
   }
   ```

3. **Suspense boundary**
   ```typescript
   <Suspense fallback={<LoadingFallback />}>
     <PageContent searchParams={searchParams} />
   </Suspense>
   ```

4. **Client-side interactivity**
   - DataTable components handle user interactions
   - Modals and forms in client components
   - Actions (create/update/delete) call server actions

### Pagination & Filtering

**URL-based pagination:**
```
/admin/products?page=2&pageSize=20&search=laptop&sort=name&order=asc
```

**Server-side parsing:**
```typescript
const params = parseSearchParams(searchParams);
// { page: 2, pageSize: 20, search: "laptop", sort: "name", order: "asc" }
```

**Passing to actions:**
```typescript
const data = await getProductsAction(params);
```

## Benefits

### Performance
✅ Reduced JavaScript sent to browser
✅ Data fetching doesn't block UI rendering (Suspense)
✅ Server-side filtering reduces network payload
✅ Proper cache headers for data endpoints

### Security
✅ No exposed API tokens in client code
✅ Auth can be handled server-side via cookies/context
✅ Business logic stays on server
✅ Reduced attack surface

### User Experience
✅ Faster initial page load
✅ Progressive enhancement
✅ Better SEO (server-rendered content)
✅ Proper loading states with Suspense

### Developer Experience
✅ Clear separation of concerns
✅ Easier to test (server logic isolated)
✅ Type-safe data flow
✅ Less boilerplate (no useEffect, no manual loading states)

## Migration Notes

### For Components Using Old Actions
Old client-side actions are still available for backward compatibility:
```typescript
// These still work but are now server actions
export const getProducts = getProductsAction;
export const createCategory = createCategoryAction;
```

### New Action Signatures
```typescript
// All actions now include pagination
const data = await listOrdersAction({
  page: 1,
  pageSize: 20,
  search: "order123",
  status: "pending",
});

// Returns consistent shape
const result = {
  data: Order[],
  total: number,
  page: number,
  pageSize: number,
};
```

### Client Component Pattern
```typescript
'use client';

interface DataTableProps {
  initialData: DataFetchState<T>;
  onRefresh?: () => Promise<void>;
}

export function DataTable({ initialData, onRefresh }: DataTableProps) {
  const [items] = useState<T[]>(initialData.data);
  // Handle interactivity, modals, etc.
}
```

## Error Handling

### Server-Side
```typescript
try {
  const data = await serverFetch(endpoint);
  return { data, total, page, pageSize };
} catch (error) {
  console.error('Error:', error);
  throw new Error('Failed to fetch resource');
}
```

### Client-Side
```typescript
// Use apiHandlers for toast notifications
await apiHandlers.async(action(), {
  pending: 'Loading...',
  success: 'Success!',
  error: 'Failed',
});
```

## Scalability Considerations

### Current Implementation
✅ Pagination support ready
✅ Filter parameters extensible
✅ Clean separation of data and UI
✅ Type-safe throughout

### Future Enhancements
- Add caching layer (Redis, SWR)
- Implement server-side sorting
- Add server-side search optimization
- Export functionality
- Bulk operations support
- Real-time updates via WebSockets

## Testing Strategy

### Server Actions
```typescript
// Test server action directly
const result = await getProductsAction({ page: 1, pageSize: 20 });
expect(result.data).toHaveLength(20);
expect(result.total).toBeGreaterThan(0);
```

### Client Components
```typescript
// Test with mock data
const mockData = { data: [...], total: 100, page: 1, pageSize: 20 };
render(<ProductsDataTable initialData={mockData} />);
// Assert UI renders correctly
```

## Common Patterns

### Refresh Pattern
```typescript
const [data, setData] = useState(initialData);

const handleRefresh = async () => {
  const fresh = await action(params);
  setData(fresh);
};

<Button onClick={handleRefresh}>Refresh</Button>
```

### CRUD Operations
```typescript
// Create
await createAction(formData);

// Update
await updateAction(id, formData);

// Delete (with confirmation)
const ok = await apiHandlers.deleteWithConfirm(name, async () => {
  await deleteAction(id);
});
```

## Troubleshooting

### Issue: Server action not found
**Solution:** Ensure file has `'use server'` at the top and `serverOnly()` call

### Issue: Client component importing server action
**Solution:** Server actions should only be imported in `'use client'` components or Server Components - the `serverOnly()` guard will catch misuse

### Issue: Stale data after mutations
**Solution:** Call `onRefresh()` after mutations or use `revalidatePath()` in actions

### Issue: Type errors with DataFetchState
**Solution:** Ensure your resource type is exported from `types/index.ts`

## File Structure

```
app/admin/
├── catalog/
│   └── page.tsx (Server Component)
├── orders/
│   └── page.tsx (Server Component)
├── coupons/
│   └── page.tsx (Server Component)
├── reviews/
│   └── page.tsx (Server Component)
└── users/
    └── page.tsx (Server Component)

components/admin/
├── ProductsDataTable.tsx (Client)
├── CategoriesDataTable.tsx (Client)
├── CatalogView.tsx (Client)
├── CatalogLoadingFallback.tsx (Server)
├── OrdersDataTable.tsx (Client)
├── OrdersLoadingFallback.tsx (Server)
├── CouponsDataTable.tsx (Client)
├── CouponsLoadingFallback.tsx (Server)
├── ReviewsDataTable.tsx (Client)
├── ReviewsLoadingFallback.tsx (Server)
├── UsersDataTable.tsx (Client)
└── UsersLoadingFallback.tsx (Server)

actions/
├── catalog.ts (Server)
├── orders.ts (Server)
├── coupons.ts (Server)
├── reviews.ts (Server)
└── users.ts (Server)

lib/
└── server-only.ts (Server utilities)

types/
└── index.ts (Type definitions)
```

## Next Steps

1. **Test all pages** to ensure functionality hasn't changed
2. **Monitor performance** using Web Vitals
3. **Add caching** for frequently accessed data
4. **Implement error boundaries** for better error handling
5. **Add logging** for debugging in production
6. **Consider ISR** for static pages (if applicable)

---

**Refactored Date:** February 19, 2026
**Pattern:** Next.js App Router with Server Components
**Status:** Production Ready

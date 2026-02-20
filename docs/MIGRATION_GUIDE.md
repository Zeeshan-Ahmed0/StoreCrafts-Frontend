# Quick Migration Guide - Server Components Pattern

## For Developers

### What Changed?

All admin pages were refactored from a client-side pattern to a Server Component pattern. This means:

- **No more `'use client'` in page.tsx** - Pages fetch data on the server
- **No more `useEffect` for initial data loading** - Data is fetched before rendering
- **No manual loading states** - Suspense handles loading UI
- **Pagination via URL** - `?page=1&pageSize=20` in the URL

### Code Comparison

#### Before (Client-Side)
```typescript
'use client';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProducts(); // client-side fetch
      setProducts(res);
    }
    load();
  }, []);

  return <div>{isLoading ? 'Loading...' : <DataTable data={products} />}</div>;
}
```

#### After (Server Components)
```typescript
// No 'use client' - this is a Server Component
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const data = await getProductsAction(); // server-side fetch
  return <DataTable data={data} />;
}
```

## How to Use

### 1. Access Pages (No Changes)
Pages work exactly the same:
```
/admin/catalog
/admin/orders
/admin/coupons
/admin/reviews
/admin/users
```

### 2. Pagination
Add pagination via URL params:
```
/admin/catalog?page=2&pageSize=50
/admin/orders?page=1&search=ORDER123
```

### 3. Calling Server Actions from Client Components
```typescript
'use client';

import { updateCategoryAction } from '@/actions/catalog';

export function CategoryForm() {
  const handleSubmit = async (formData) => {
    const result = await updateCategoryAction(id, formData);
    // Handle result
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 4. Creating New Pages

**Step 1: Create Server Component Page**
```typescript
// app/admin/products/page.tsx
import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { getProductsAction } from '@/actions/products';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { LoadingFallback } from '@/components/admin/LoadingFallback';

async function ProductsContent({ searchParams }) {
  const params = parseSearchParams(searchParams);
  const data = await getProductsAction(params);
  return <ProductsTable initialData={data} />;
}

export default function ProductsPage({ searchParams }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}
```

**Step 2: Create Server Actions**
```typescript
// actions/products.ts
'use server';

import { serverOnly } from '@/lib/server-only';
import { Product, ProductFilterParams, DataFetchState } from '@/types';

serverOnly();

async function serverFetch(path: string, opts: RequestInit = {}) {
  // Implement fetch logic
}

export const getProductsAction = async (
  params: ProductFilterParams
): Promise<DataFetchState<Product>> => {
  // Implement fetching with pagination
};
```

**Step 3: Create Client Component**
```typescript
// components/admin/ProductsTable.tsx
'use client';

import { DataTable } from '@/components/common/DataTable';
import { DataFetchState, Product } from '@/types';

interface ProductsTableProps {
  initialData: DataFetchState<Product>;
}

export function ProductsTable({ initialData }: ProductsTableProps) {
  return <DataTable data={initialData.data} />;
}
```

## Key Patterns

### Loading States
```typescript
// Use Suspense instead of useState
<Suspense fallback={<Skeleton />}>
  <Content />
</Suspense>
```

### Error Handling
```typescript
// Server errors are caught and thrown
try {
  const data = await serverFetch(endpoint);
} catch (error) {
  throw new Error('Failed to fetch');
}

// Client catches and handles
try {
  await serverAction();
} catch (error) {
  toast.error(error.message);
}
```

### Data Refresh
```typescript
// Client component with refresh capability
const [data, setData] = useState(initialData);

const refresh = async () => {
  const fresh = await listOrdersAction(params);
  setData(fresh);
};
```

### Type Safety
```typescript
// Use specific filter param types
const params: OrderFilterParams = {
  page: 1,
  pageSize: 20,
  status: 'pending', // Type-checked!
};
```

## Common Mistakes to Avoid

### ❌ Don't: Import server actions with wrong directive
```typescript
// server actions in client component missing 'use server'
// This will cause: "Cannot use async server action in client"
```

### ✅ Do: Ensure proper directives
```typescript
// actions/catalog.ts - Top of file
'use server';
import { serverOnly } from '@/lib/server-only';
serverOnly(); // Prevents accidental client import
```

### ❌ Don't: Access browser APIs in server actions
```typescript
// server actions can't use localStorage
const token = localStorage.getItem('token'); // ❌ Error in server
```

### ✅ Do: Handle auth server-side
```typescript
// Use cookies, session, or async context
const session = await getSession(); // Server-side auth
```

### ❌ Don't: Use useEffect for initial data
```typescript
useEffect(() => {
  const load = async () => {
    setData(await action());
  };
  load();
}, []); // ❌ Unnecessary
```

### ✅ Do: Fetch in Server Components
```typescript
async function PageContent() {
  const data = await action(); // ✅ Direct fetch
  return <Component data={data} />;
}
```

## Debugging

### Q: Server action not being called?
**A:** Check:
1. Page uses `'use server'` directive
2. Function is exported
3. Client component calls with `await`
4. Check browser console for errors

### Q: Seeing "This client action is not allowed"?
**A:** Ensure:
1. Page file doesn't have `'use client'` (it's a Server Component)
2. Try opening in new incognito window (clear cache)

### Q: Stale data after mutation?
**A:** Call refresh or implement revalidation:
```typescript
import { revalidatePath } from 'next/cache';

export async function updateProduct(id, data) {
  // ... perform update
  revalidatePath('/admin/products');
}
```

### Q: Pagination not working?
**A:** Ensure:
1. Page receives `searchParams` prop
2. Use `parseSearchParams()` to parse safely
3. Pass to action with correct types

## Performance Tips

1. **Use Suspense strategically**
   ```typescript
   // Wrap slow components, not the entire page
   <Suspense fallback={<Skeleton />}>
     <SlowComponent />
   </Suspense>
   ```

2. **Implement pagination**
   - Don't fetch all records at once
   - Use `pageSize` parameter

3. **Cache appropriately**
   ```typescript
   // Server action with caching
   const data = await fetch(url, { cache: 'force-cache' });
   ```

4. **Optimize images**
   - Use Next.js `Image` component
   - Same for admin pages

5. **Split large pages**
   - Create separate Suspense boundaries
   - Load-in parallel when possible

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Suspense](https://react.dev/reference/react/Suspense)
- [Streaming with Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

---

For questions or issues, refer to the main refactoring documentation at:
`docs/SERVER_COMPONENTS_REFACTORING.md`

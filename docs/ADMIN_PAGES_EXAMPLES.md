# Admin Pages Implementation Examples

## Catalog Page (Products & Categories)

### Page Structure
```typescript
// app/admin/catalog/page.tsx
interleave async function CatalogContent({ searchParams })
  - Parses searchParams
  - Fetches products and categories in parallel
  - Renders CatalogView component

CatalogView ('use client')
  - Manages tab state (products/categories)
  - Renders ProductsDataTable or CategoriesDataTable
  - Handles product/category links
```

### Data Flow
```
URL: /admin/catalog?page=1&pageSize=20
  ↓
Page Component (Server)
  ↓
parseSearchParams() → { page: 1, pageSize: 20, ... }
  ↓
getProductsAction(params)
getCategoriesAction(params) [parallel]
  ↓
DataFetchState<Product> + DataFetchState<Category>
  ↓
CatalogView (renders tabs)
  ↓
ProductsDataTable OR CategoriesDataTable (user interaction)
```

### CRUD Operations
```typescript
// CategoriesDataTable ('use client')
const handleSaveCategory = async () => {
  if (selectedCategory) {
    await updateCategoryAction(id, formData); // Server action
  } else {
    await createCategoryAction(formData); // Server action
  }
  await onRefresh?.(); // Refresh data
};
```

### Key Features
- ✅ Tabbed interface switching categories/products
- ✅ Client components handle modals and forms
- ✅ Server components handle initial data fetch
- ✅ Pagination support via URL params
- ✅ Type-safe filtering

---

## Orders Page

### Page Structure
```typescript
// app/admin/orders/page.tsx
async function OrdersContent({ searchParams })
  - Read-only display of orders
  - Fetches orders with pagination
  - Shows order table with status badges
```

### Data Flow
```
URL: /admin/orders?page=1&search=ORDER123
  ↓
OrdersContent (Server)
  ↓
parseSearchParams() → { page: 1, search: "ORDER123" }
  ↓
listOrdersAction(params)
  ↓
DataFetchState<Order>
  ↓
OrdersDataTable (displays table)
```

### Display Features
- Order number badges
- Customer info and email
- Total amount with currency formatting
- Order status badges (pending, processing, shipped, delivered)
- Payment status indicators
- Created date formatting
- View action (can add modal/detail page)

### Type Safety
```typescript
type OrderFilterParams = {
  page: number;
  pageSize: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
};
```

---

## Coupons Page

### Page Structure
```typescript
// app/admin/coupons/page.tsx
async function CouponsContent({ searchParams })
  - Fetches coupons with pagination
  - Renders CouponsDataTable

CouponsDataTable ('use client')
  - Manages modal state (add/edit)
  - Manages delete confirmation
  - Handles CRUD operations
```

### CRUD Implementation
```typescript
// Create
const handleAdd = () => {
  setSelectedCoupon(null);
  setForm({ code: '', discountType: 'percentage', ... });
  setShowModal(true);
};

const handleSave = async () => {
  if (selectedCoupon) {
    await updateCouponAction(selectedCoupon.id, form);
  } else {
    await createCouponAction(form);
  }
  await onRefresh?.();
  setShowModal(false);
};

// Delete
const handleConfirmDelete = async () => {
  const ok = await apiHandlers.deleteWithConfirm(code, async () => {
    await deleteCouponAction(id);
  });
  if (ok) await onRefresh?.();
};
```

### Form Fields
- Code (e.g., "SAVE10")
- Description
- Discount Type (percentage | fixed)
- Discount Value
- Max Uses
- Expiry Date
- Min Order Value

### Display Columns
- Code
- Description
- Discount (formatted as "10%" or "$5")
- Uses (current uses count)
- Status (active/inactive badge)
- Created date

---

## Reviews Page

### Page Structure
```typescript
// app/admin/reviews/page.tsx
async function ReviewsContent({ searchParams })
  - Fetches reviews with pagination
  - Renders ReviewsDataTable (read-only)
```

### Display Features
```typescript
const columns = [
  'productName',      // Product being reviewed
  'userName',         // Customer who left review
  'rating',           // Star rating display
  'title',            // Review title
  'status',           // pending/approved/rejected
  'createdAt',        // When review was created
];
```

### Star Rating Display
```typescript
{
  key: 'rating',
  render: (val) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: val }).map((_, i) => (
        <Star key={i} size={16} className="fill-yellow-400" />
      ))}
    </div>
  )
}
```

### Status Badges
- pending → outline badge (gray)
- approved → default badge (green)
- rejected → outline badge (gray)

### Type Safety
```typescript
type ReviewFilterParams = {
  page: number;
  pageSize: number;
  status?: 'pending' | 'approved' | 'rejected';
  rating?: number;
};
```

---

## Users Page

### Page Structure
```typescript
// app/admin/users/page.tsx
async function UsersContent({ searchParams })
  - Fetches users with pagination
  - Renders UsersDataTable (read-only)
```

### Display Features
```typescript
const columns = [
  'name',           // User full name
  'email',          // Email address
  'role',           // Role badge (admin/manager/staff)
  'status',         // Status indicator
  'joinDate',       // When user joined
];
```

### Status Indicator
```typescript
{
  key: 'status',
  render: (val) => (
    <span className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${val === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
      }
    `}>
      {val}
    </span>
  )
}
```

### Role Badges
```typescript
{
  key: 'role',
  render: (val) => (
    <Badge variant="outline" className="capitalize">
      {val}
    </Badge>
  )
}
```

### Type Safety
```typescript
type UserFilterParams = {
  page: number;
  pageSize: number;
  role?: 'admin' | 'manager' | 'staff';
  status?: 'active' | 'inactive';
};
```

---

## Common Patterns Used

### 1. Data Fetching Pattern
```typescript
// In Server Component
async function PageContent({ searchParams }) {
  const params = parseSearchParams(searchParams);
  const data = await listAction(params);
  return <ClientComponent data={data} />;
}

// With Suspense
export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  );
}
```

### 2. Client Component Pattern
```typescript
'use client';

interface DataTableProps {
  initialData: DataFetchState<T>;
  onRefresh?: () => Promise<void>;
}

export function DataTable({ initialData, onRefresh }: DataTableProps) {
  const [items] = useState(initialData.data);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return <>{/* Component JSX */}</>;
}
```

### 3. Modal Form Pattern
```typescript
'use client';

const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [form, setForm] = useState({ /* initial values */ });

const handleSave = async () => {
  try {
    if (selectedItem) {
      await updateAction(selectedItem.id, form);
    } else {
      await createAction(form);
    }
    if (onRefresh) await onRefresh();
    setShowModal(false);
  } catch (error) {
    console.error('Save error:', error);
  }
};
```

### 4. Delete Confirmation Pattern
```typescript
'use client';

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleDelete = (item) => {
  setSelectedItem(item);
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  try {
    const ok = await apiHandlers.deleteWithConfirm(
      selectedItem.name,
      async () => {
        await deleteAction(selectedItem.id);
      }
    );
    if (ok && onRefresh) await onRefresh();
  } finally {
    setShowDeleteModal(false);
  }
};
```

---

## Type Definitions Used

### DataFetchState
```typescript
interface DataFetchState<T> {
  data: T[];              // Array of items
  total: number;          // Total count (for pagination)
  page: number;           // Current page
  pageSize: number;       // Items per page
}
```

### Pagination
```typescript
interface PaginationParams {
  page: number;           // 1-indexed page number
  pageSize: number;       // Items to fetch (1-100)
  search?: string;        // Search query
  sort?: string;          // Field to sort by
  order?: 'asc' | 'desc'; // Sort direction
}
```

### Resource-Specific Filters
```typescript
// Example: ProductFilterParams
interface ProductFilterParams extends PaginationParams {
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
}
```

---

## Error Handling Examples

### Server-Side
```typescript
export const getProductsAction = async (params) => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      // ... other params
    });
    const data = await serverFetch(`/products?${query}`);
    return {
      data: data.data || data,
      total: data.total || data.length,
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};
```

### Client-Side
```typescript
const handleSave = async () => {
  try {
    await apiHandlers.async(updateAction(id, data), {
      pending: 'Updating...',
      success: 'Updated successfully',
      error: 'Failed to update',
    });
    await onRefresh?.();
  } catch (error) {
    console.error('Save error:', error);
    // Error already handled by apiHandlers
  }
};
```

---

## URL Examples for Testing

```
# Pagination
/admin/catalog?page=1&pageSize=20

# Search
/admin/orders?search=ORDER123

# Filter + Sort
/admin/products?status=active&sort=name&order=asc

# Combined
/admin/coupons?page=2&search=SALE&sort=createdAt&order=desc
```

---

This guide shows the exact patterns and structures used across all admin pages. Use these as templates when adding new admin pages or features.

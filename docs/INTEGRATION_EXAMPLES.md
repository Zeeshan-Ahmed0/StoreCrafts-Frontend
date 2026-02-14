# Toast & Confirmation Integration Examples

Real-world examples for common scenarios in your StoreCrafts application.

## 🛍️ E-Commerce Examples

### Add to Cart
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';

export function AddToCartButton({ productId, productName }) {
  const { toast } = useNotification();

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      toast.success(`${productName} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item. Please try again.');
    }
  };

  return <Button onClick={handleAddToCart}>Add to Cart</Button>;
}
```

### Checkout Process
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function CheckoutForm() {
  const { toast, confirm } = useNotification();

  const handleCheckout = async (cartData) => {
    const success = await apiHandlers.formSubmit(
      () => submitCheckout(cartData),
      'Order placed successfully!'
    );

    if (success) {
      // Redirect to success page
      window.location.href = '/order-success';
    }
  };

  return <button onClick={() => handleCheckout(cartData)}>Place Order</button>;
}
```

## 👤 Admin Examples

### Delete User
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function UserActions({ userId, userName }) {
  const handleDeleteUser = async () => {
    const success = await apiHandlers.deleteWithConfirm(
      `user ${userName}`,
      () => deleteUser(userId)
    );

    if (success) {
      // Refresh user list
      window.location.reload();
    }
  };

  return <button onClick={handleDeleteUser} className="text-red-600">Delete</button>;
}
```

### Bulk Delete Products
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function BulkDeleteProducts({ selectedIds }) {
  const handleBulkDelete = async () => {
    const success = await apiHandlers.bulkAction(
      'Delete',
      selectedIds.length,
      () => fetch('/api/products/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedIds }),
      })
    );

    if (success) {
      // Refresh list
    }
  };

  return (
    <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
      Delete Selected ({selectedIds.length})
    </button>
  );
}
```

## 📝 Form Examples

### Login Form
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function LoginForm() {
  const { toast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    const result = await apiHandlers.async(
      loginUser(email, password),
      {
        pending: 'Logging you in...',
        success: 'Login successful!',
        error: 'Invalid credentials',
      }
    );

    setIsLoading(false);

    if (result) {
      // Redirect to dashboard
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Product Form with Validation
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function ProductForm({ productId }) {
  const { toast, confirm } = useNotification();

  const handleSubmit = async (formData) => {
    // Validate form
    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await apiHandlers.formSubmit(
      () => saveProduct(productId, formData),
      `Product ${productId ? 'updated' : 'created'} successfully!`
    );
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```

## 📊 Data Operations

### Import CSV
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export function ImportCSV() {
  const { toast } = useNotification();

  const handleImport = async (file: File) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }

    const toastId = toast.loading('Processing CSV file...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Import failed');

      const { rowsImported } = await response.json();

      toast.update(toastId, {
        render: `Successfully imported ${rowsImported} rows!`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Failed to import file. Please check the format.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return <input type="file" onChange={(e) => handleImport(e.target.files[0])} />;
}
```

### Export Data
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export function ExportButton({ dataType }) {
  const { toast } = useNotification();

  const handleExport = async () => {
    const toastId = toast.loading(`Exporting ${dataType}...`);

    try {
      const response = await fetch(`/api/export/${dataType}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}-${new Date().toISOString()}.csv`;
      a.click();

      toast.update(toastId, {
        render: 'File downloaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Failed to export data',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return <button onClick={handleExport}>Export {dataType}</button>;
}
```

## 🔐 Auth Examples

### Change Password
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { apiHandlers } from '@/lib/apiHandlers';

export function ChangePasswordForm() {
  const { toast } = useNotification();

  const handleChangePassword = async (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    await apiHandlers.formSubmit(
      () => changePassword(oldPassword, newPassword),
      'Password changed successfully!'
    );
  };

  return <form onSubmit={handleChangePassword}>{/* fields */}</form>;
}
```

### Logout Confirmation
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export function LogoutButton() {
  const { confirm } = useNotification();

  const handleLogout = async () => {
    const confirmed = await confirm.simple(
      'Confirm Logout',
      'Are you sure you want to log out?'
    );

    if (confirmed) {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## 📱 Store Management

### Activate/Deactivate Store
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export function StoreToggle({ storeId, isActive }) {
  const { confirm, toast } = useNotification();

  const handleToggle = async () => {
    const action = isActive ? 'deactivate' : 'activate';
    const confirmed = await confirm.simple(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Store`,
      `Are you sure you want to ${action} this store?`
    );

    if (confirmed) {
      const loadingId = toast.loading(`${action}ing store...`);

      try {
        await fetch(`/api/stores/${storeId}`, {
          method: 'PATCH',
          body: JSON.stringify({ active: !isActive }),
        });

        toast.update(loadingId, {
          render: `Store ${action}d successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        toast.update(loadingId, {
          render: `Failed to ${action} store`,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <button onClick={handleToggle}>
      {isActive ? 'Deactivate' : 'Activate'} Store
    </button>
  );
}
```

## 🎁 Coupon Management

### Create Coupon with Input
```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export function CreateCouponDialog({ onSuccess }) {
  const { confirm, toast } = useNotification();

  const handleCreateCoupon = async () => {
    const code = await confirm.input('Generate Coupon Code', 'text');

    if (!code) return;

    const discount = await confirm.input('Discount Percentage', 'number', '10');

    if (!discount) return;

    const toastId = toast.loading('Creating coupon...');

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        body: JSON.stringify({ code, discount: parseInt(discount) }),
      });

      toast.update(toastId, {
        render: 'Coupon created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      onSuccess?.();
    } catch (error) {
      toast.update(toastId, {
        render: 'Failed to create coupon',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return <button onClick={handleCreateCoupon}>Create Coupon</button>;
}
```

## 🎯 Best Practices Shown

✅ Always validate before submission
✅ Use loading state for async operations
✅ Confirm destructive actions
✅ Handle errors gracefully
✅ Provide clear feedback
✅ Type-safe implementations
✅ Proper error message extraction
✅ User-friendly messages
✅ Redirect on success when needed
✅ Clean up resources
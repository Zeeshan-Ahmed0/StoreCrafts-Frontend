# Toast & Confirmation Modal Implementation

## Overview

A complete, production-ready notification system with:
- **React Toastify**: Dynamic toast notifications
- **SweetAlert2**: Elegant confirmation modals
- **Hooks & Services**: Easy-to-use API across the app
- **TypeScript**: Full type safety
- **Demo Component**: Interactive examples

## 📦 Installed Packages

```json
{
  "react-toastify": "^10.x",
  "sweetalert2": "^11.x"
}
```

## 📁 File Structure

```
src/
├── lib/
│   ├── toastService.ts       // Toast service with all methods
│   ├── confirmService.ts     // Confirmation service
│   └── apiHandlers.ts        // Common API patterns
├── contexts/
│   ├── AuthContext.tsx       // Auth context (existing)
│   └── ToastProvider.tsx     // Toast container provider
├── hooks/
│   └── useNotification.ts    // Hook for using services
└── components/
    └── NotificationDemo.tsx  // Demo component

app/
└── layout.tsx               // Updated with providers
```

## 🎯 Features

### Toast Notifications
- ✅ Success, Error, Info, Warning, Default types
- ✅ Loading state with updates
- ✅ Promise-based toasts (pending → success/error)
- ✅ Customizable position, duration, animation
- ✅ Auto-dismiss and manual dismiss
- ✅ Max 3 concurrent toasts
- ✅ Keyboard and click dismissible

### Confirmation Modals
- ✅ Simple confirm (Yes/No)
- ✅ Confirm with deny option (Yes/No/Cancel)
- ✅ Specialized delete confirmation
- ✅ Alert dialogs (Success, Error, Info, Warning)
- ✅ Input dialog
- ✅ Custom dialog support
- ✅ Modal state management
- ✅ Customizable buttons and messages

### API Helpers
- ✅ Automatic success/error handling
- ✅ Delete with confirmation
- ✅ Form submission with validation
- ✅ Data fetching with loading state
- ✅ Bulk operations with confirmation
- ✅ Promise-based operations

## 🚀 Quick Start

### 1. Basic Toast Usage

```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export default function MyComponent() {
  const { toast } = useNotification();

  return (
    <button onClick={() => toast.success('Hello!')}>
      Show Toast
    </button>
  );
}
```

### 2. Basic Confirmation

```tsx
const { confirm } = useNotification();

const handleDelete = async () => {
  if (await confirm.delete('User Account')) {
    // User confirmed deletion
    toast.success('Deleted successfully!');
  }
};
```

### 3. Advanced Promise Pattern

```tsx
await toast.promise(
  fetchUserData(),
  {
    pending: 'Loading...',
    success: 'Loaded!',
    error: 'Failed!'
  }
);
```

### 4. API Integration Example

```tsx
import { apiHandlers } from '@/lib/apiHandlers';

const handleSubmit = async () => {
  const success = await apiHandlers.formSubmit(
    () => submitForm(),
    'Form saved successfully!'
  );
};

const handleDelete = async () => {
  await apiHandlers.deleteWithConfirm(
    'User',
    () => deleteUser(userId)
  );
};
```

## 📋 Toast API Reference

### Methods

```typescript
// Basic toasts
toast.success(message: string, config?: ToastConfig)
toast.error(message: string, config?: ToastConfig)
toast.info(message: string, config?: ToastConfig)
toast.warning(message: string, config?: ToastConfig)
toast.default(message: string, config?: ToastConfig)

// Advanced
toast.loading(message: string, config?: ToastConfig): toastId
toast.promise<T>(
  promise: Promise<T>,
  messages: { pending, success, error },
  config?: ToastConfig
)
toast.update(toastId, options: ToastOptions)
toast.dismiss(toastId?: string | number)
toast.isActive(toastId: string | number): boolean
```

### Configuration

```typescript
interface ToastConfig {
  position?: 'top-left' | 'top-right' | 'top-center' | 
            'bottom-left' | 'bottom-right' | 'bottom-center'
  autoClose?: number | false  // milliseconds or false
  hideProgressBar?: boolean
  closeOnClick?: boolean
  pauseOnHover?: boolean
  draggable?: boolean
  progress?: number
  transition?: typeof Bounce | typeof Zoom | typeof Flip | typeof Slide
}
```

## 📋 Confirmation API Reference

### Methods

```typescript
// Basic confirmations
confirm.simple(title: string, message?: string): Promise<boolean>
confirm.withDeny(
  title: string,
  message?: string,
  confirmText?: string,
  denyText?: string
): Promise<'confirm' | 'deny' | 'cancel'>

// Specialized dialogs
confirm.delete(itemName?: string): Promise<boolean>
confirm.success(title: string, message?: string): Promise<void>
confirm.error(title: string, message?: string): Promise<void>
confirm.info(title: string, message?: string): Promise<void>
confirm.warning(title: string, message?: string): Promise<void>

// Input dialog
confirm.input(
  title: string,
  inputType?: 'text' | 'email' | 'password' | 'number',
  placeholder?: string
): Promise<string | null>

// Custom
confirm.custom(config: SweetAlertOptions): Promise<SweetAlertResult>

// Utilities
confirm.close()
confirm.hide()
confirm.loading(title: string): Promise<void>
```

## 🔧 API Handlers Reference

```typescript
// Success/Error handling
apiHandlers.success(message?: string)
apiHandlers.error(error: any, defaultMessage?: string)

// Common patterns
apiHandlers.deleteWithConfirm(
  itemName: string,
  onConfirm: () => Promise<void>
): Promise<boolean>

apiHandlers.async<T>(
  operation: Promise<T>,
  messages: { pending, success, error }
): Promise<T | null>

apiHandlers.formSubmit(
  onSubmit: () => Promise<void>,
  successMessage?: string
): Promise<boolean>

apiHandlers.fetch<T>(
  fetchFn: () => Promise<T>,
  loadingMessage?: string
): Promise<T | null>

apiHandlers.bulkAction(
  action: string,
  count: number,
  onConfirm: () => Promise<void>
): Promise<boolean>
```

## 🎨 Configuration

### Toast Provider (app/layout.tsx)
- Position: top-right
- Auto-close: 3000ms
- Max toasts: 3
- Theme: light
- Drag to dismiss: enabled

### Confirmation Service (confirmService.ts)
- Confirm color: Blue (#3b82f6)
- Cancel color: Gray (#6b7280)
- Deny color: Red (#ef4444)
- Click outside: disabled
- Escape key: enabled

## 🧪 Demo Component

Visit `/demo` or add to any page:

```tsx
import NotificationDemo from '@/components/NotificationDemo';

export default function Page() {
  return <NotificationDemo />;
}
```

## 💡 Best Practices

1. **Use hooks in client components**: Always use `useNotification` in `'use client'` components
2. **Wrap async operations**: Use `toast.promise()` for better UX
3. **Confirm dangerous actions**: Always ask before delete/critical operations
4. **Be specific**: Use clear, action-oriented messages
5. **Limit toasts**: Max 3 concurrent toasts to avoid clutter
6. **Use appropriate types**: Error, warning, success based on context
7. **Handle errors**: Always catch and display errors to users

## 🔒 Type Safety

All services are fully typed with TypeScript:

```typescript
// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'
type ToastPosition = 'top-left' | 'top-right' | ... 
interface ToastConfig extends ToastOptions { ... }

// Confirmation types
type ConfirmAction = 'confirm' | 'cancel' | 'deny'
interface ConfirmConfig extends SweetAlertOptions { ... }
```

## 📱 Responsive Design

- Toasts adapt to screen size
- Confirmations are mobile-friendly
- Touch-friendly buttons
- Works on all modern browsers

## 🚫 Important Notes

- **Client-only**: Both services must be used in `'use client'` components
- **No Server Component**: Cannot use in Server Components
- **Layout Integration**: Providers are in `app/layout.tsx`
- **Import Paths**: Use `@/` aliases for clean imports

## 🔗 Related Files

- [TOAST_CONFIRMATION_GUIDE.md](./TOAST_CONFIRMATION_GUIDE.md) - Detailed usage guide
- [src/lib/toastService.ts](./src/lib/toastService.ts) - Service implementation
- [src/lib/confirmService.ts](./src/lib/confirmService.ts) - Service implementation
- [src/hooks/useNotification.ts](./src/hooks/useNotification.ts) - React hook
- [src/contexts/ToastProvider.tsx](./src/contexts/ToastProvider.tsx) - Provider component
- [src/lib/apiHandlers.ts](./src/lib/apiHandlers.ts) - API integration helpers

## 🎓 Examples

See [TOAST_CONFIRMATION_GUIDE.md](./TOAST_CONFIRMATION_GUIDE.md) for:
- Basic usage examples
- Advanced patterns
- API integration
- Complete component examples
- Demo component code
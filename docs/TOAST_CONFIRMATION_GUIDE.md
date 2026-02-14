# Toast & Confirmation Modal Usage Guide

## Overview
This guide shows how to use the toast notifications and confirmation modals throughout your application.

## Toast Notifications (React Toastify)

### Basic Setup
Toasts are automatically initialized in the root layout. Just use the `useNotification` hook in any client component.

### Usage Examples

```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export default function MyComponent() {
  const { toast, confirm } = useNotification();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    toast.warning('This is a warning message.');
  };

  const handleInfo = () => {
    toast.info('Here is some information.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

### Toast Types

- **success**: Green toast with checkmark
- **error**: Red toast with error icon (auto-closes in 4s)
- **info**: Blue toast with info icon
- **warning**: Orange toast with warning icon (auto-closes in 3.5s)
- **default**: Standard toast message
- **loading**: Indefinite loading state

### Advanced Toast Usage

```tsx
// Loading toast
const toastId = toast.loading('Processing your request...');

// Promise-based toast (auto handles loading, success, error)
toast.promise(
  fetchUserData(),
  {
    pending: 'Loading user data...',
    success: 'User data loaded successfully!',
    error: 'Failed to load user data'
  }
);

// Update existing toast
const id = toast.loading('Uploading...');
setTimeout(() => {
  toast.update(id, { 
    render: 'Upload complete!', 
    type: 'success',
    isLoading: false,
    autoClose: 3000
  });
}, 2000);

// Dismiss specific toast or all
toast.dismiss(toastId); // Dismiss specific
toast.dismiss(); // Dismiss all
```

## Confirmation Modals (SweetAlert2)

### Simple Confirmation

```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';

export default function DeleteButton() {
  const { confirm, toast } = useNotification();

  const handleDelete = async () => {
    const isConfirmed = await confirm.simple(
      'Delete Item',
      'Are you sure you want to delete this item?'
    );

    if (isConfirmed) {
      toast.success('Item deleted successfully!');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Delete Confirmation (Specialized)

```tsx
const handleDelete = async () => {
  const isConfirmed = await confirm.delete('User Account');
  
  if (isConfirmed) {
    await deleteUserAccount();
    toast.success('Account deleted successfully');
  }
};
```

### Confirmation with Three Options

```tsx
const action = await confirm.withDeny(
  'Save Changes',
  'Do you want to save these changes?',
  'Save',
  'Discard'
);

switch (action) {
  case 'confirm':
    toast.success('Changes saved!');
    break;
  case 'deny':
    toast.info('Changes discarded');
    break;
  case 'cancel':
    // User cancelled
    break;
}
```

### Alert Dialogs

```tsx
// Success
await confirm.success('Success!', 'Your operation was successful');

// Error
await confirm.error('Error!', 'Something went wrong');

// Info
await confirm.info('Information', 'Here is some information');

// Warning
await confirm.warning('Warning!', 'Please be careful with this action');
```

### Input Dialog

```tsx
const userName = await confirm.input(
  'Enter your name',
  'text',
  'John Doe'
);

if (userName) {
  toast.success(`Welcome, ${userName}!`);
}
```

## Complete Example Component

```tsx
'use client';

import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';

export default function FormComponent() {
  const { toast, confirm } = useNotification();

  const handleSubmit = async () => {
    // Show promise-based toast during async operation
    await toast.promise(
      submitForm(),
      {
        pending: 'Submitting form...',
        success: 'Form submitted successfully!',
        error: 'Failed to submit form'
      }
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirm.delete('this record');
    
    if (confirmed) {
      await toast.promise(
        deleteRecord(),
        {
          pending: 'Deleting...',
          success: 'Record deleted!',
          error: 'Failed to delete'
        }
      );
    }
  };

  const handleCustomConfirm = async () => {
    const result = await confirm.withDeny(
      'Update Settings',
      'Save current changes?',
      'Save',
      'Discard'
    );

    if (result === 'confirm') {
      toast.success('Settings saved!');
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleSubmit}>Submit Form</Button>
      <Button onClick={handleDelete} variant="destructive">Delete Record</Button>
      <Button onClick={handleCustomConfirm}>Update Settings</Button>
    </div>
  );
}
```

## Configuration

### Toast Configuration
Toasts are configured in `ToastProvider.tsx`:
- Position: top-right
- Auto-close: 3000ms (3 seconds)
- Max display: 3 toasts at a time
- Theme: light

### Confirmation Configuration
Confirmations use sensible defaults in `confirmService.ts`:
- Confirm button color: Blue (#3b82f6)
- Cancel button color: Gray (#6b7280)
- Deny button color: Red (#ef4444)
- Can't dismiss by clicking outside

## Direct Service Usage

If you prefer not to use the hook, you can directly import and use the services:

```tsx
import { toastService } from '@/lib/toastService';
import { confirmService } from '@/lib/confirmService';

toastService.success('Hello!');
const confirmed = await confirmService.confirm({ 
  title: 'Confirm Action' 
});
```

## Best Practices

1. **Use promises for async operations**: Always wrap async operations with `toast.promise()` for better UX
2. **Be specific with messages**: Use clear, actionable messages
3. **Use appropriate types**: error, warning, success based on context
4. **Confirm dangerous actions**: Always ask for confirmation on delete/critical operations
5. **Limit concurrent toasts**: Keep max 3 toasts visible to avoid cluttering
6. **Use loading states**: Show loading toast during long operations
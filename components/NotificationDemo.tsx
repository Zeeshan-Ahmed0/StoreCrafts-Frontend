'use client';

import { useState } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationDemo() {
  const { toast, confirm } = useNotification();
  const [loading, setLoading] = useState(false);

  // Toast Handlers
  const handleToastSuccess = () => {
    toast.success('Success! Operation completed successfully.');
  };

  const handleToastError = () => {
    toast.error('Error! Something went wrong.');
  };

  const handleToastInfo = () => {
    toast.info('Info: Here is some information for you.');
  };

  const handleToastWarning = () => {
    toast.warning('Warning: Please be careful with this action.');
  };

  const handleToastLoading = () => {
    const id = toast.loading('Processing your request...');
    setTimeout(() => {
      toast.update(id, {
        render: 'Done! Your request has been processed.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    }, 2000);
  };

  const handlePromiseToast = async () => {
    await toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve('Completed'), 2000);
      }),
      {
        pending: 'Loading your data...',
        success: 'Data loaded successfully!',
        error: 'Failed to load data',
      }
    );
  };

  // Confirmation Handlers
  const handleSimpleConfirm = async () => {
    const confirmed = await confirm.simple(
      'Are you sure?',
      'Do you want to proceed with this action?'
    );

    if (confirmed) {
      toast.success('Action confirmed!');
    } else {
      toast.info('Action cancelled');
    }
  };

  const handleConfirmWithDeny = async () => {
    const action = await confirm.withDeny(
      'Save Changes',
      'Do you want to save your changes?',
      'Save',
      'Discard'
    );

    if (action === 'confirm') {
      toast.success('Changes saved!');
    } else if (action === 'deny') {
      toast.info('Changes discarded');
    } else {
      toast.info('Action cancelled');
    }
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await confirm.delete('User Account');
    if (confirmed) {
      toast.success('Account deleted (simulated)');
    }
  };

  const handleAlertSuccess = async () => {
    await confirm.success('Success!', 'Your operation was completed successfully.');
    toast.success('User acknowledged the success message');
  };

  const handleAlertError = async () => {
    await confirm.error('Error Occurred', 'Something went wrong while processing your request.');
    toast.error('User acknowledged the error message');
  };

  const handleAlertWarning = async () => {
    await confirm.warning('Caution', 'This action may have consequences. Please be careful.');
    toast.warning('User acknowledged the warning');
  };

  const handleInputDialog = async () => {
    const name = await confirm.input('Enter your name', 'text', 'John Doe');
    if (name) {
      toast.success(`Welcome, ${name}!`);
    }
  };

  const handleAsyncWithConfirm = async () => {
    const confirmed = await confirm.simple(
      'Confirm Operation',
      'This will perform an async operation. Continue?'
    );

    if (confirmed) {
      setLoading(true);
      await toast.promise(
        new Promise((resolve) => setTimeout(() => resolve('Done'), 2000)),
        {
          pending: 'Processing...',
          success: 'Operation completed!',
          error: 'Operation failed',
        }
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Toast & Confirmation Demo</h1>
        <p className="text-gray-600">
          Explore all available toast notifications and confirmation modals
        </p>
      </div>

      {/* Toast Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Click buttons to see different types of toast messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={handleToastSuccess}
              className="bg-green-600 hover:bg-green-700"
            >
              Success Toast
            </Button>
            <Button
              onClick={handleToastError}
              variant="destructive"
            >
              Error Toast
            </Button>
            <Button
              onClick={handleToastInfo}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Info Toast
            </Button>
            <Button
              onClick={handleToastWarning}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Warning Toast
            </Button>
            <Button
              onClick={handleToastLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Loading Toast
            </Button>
            <Button
              onClick={handlePromiseToast}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Promise Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Dialogs</CardTitle>
          <CardDescription>
            Click buttons to see different confirmation dialog types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={handleSimpleConfirm}
              variant="outline"
            >
              Simple Confirm
            </Button>
            <Button
              onClick={handleConfirmWithDeny}
              variant="outline"
            >
              With Deny
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="destructive"
            >
              Delete Confirm
            </Button>
            <Button
              onClick={handleAlertSuccess}
              className="bg-green-600 hover:bg-green-700"
            >
              Success Alert
            </Button>
            <Button
              onClick={handleAlertError}
              className="bg-red-600 hover:bg-red-700"
            >
              Error Alert
            </Button>
            <Button
              onClick={handleAlertWarning}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Warning Alert
            </Button>
            <Button
              onClick={handleInputDialog}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Input Dialog
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Example */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Example</CardTitle>
          <CardDescription>
            Confirmation dialog followed by async operation with toast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAsyncWithConfirm}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {loading ? 'Processing...' : 'Start Async Operation'}
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            This button will ask for confirmation, then show a loading toast while
            simulating an async operation for 2 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
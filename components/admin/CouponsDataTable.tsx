'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Coupon, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from '@/actions/coupons';
import { apiHandlers } from '@/lib/apiHandlers';

interface CouponsDataTableProps {
  initialData: DataFetchState<Coupon>;
  onRefresh?: () => Promise<void>;
}

export function CouponsDataTable({
  initialData,
  onRefresh,
}: CouponsDataTableProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialData.data);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    maxUses: '',
    expiryDate: '',
    minOrderValue: '',
  });

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const columns: Column<Coupon>[] = [
    { key: 'code', label: 'Code', width: '120px' },
    { key: 'description', label: 'Description' },
    {
      key: 'discountValue',
      label: 'Discount',
      render: (val, row) =>
        row.discountType === 'percentage' ? `${val}%` : `$${val}`,
      width: '100px',
    },
    { key: 'currentUses', label: 'Uses', width: '80px' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            val === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {val}
        </span>
      ),
      width: '100px',
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (val) => formatDate(val),
      width: '150px',
    },
  ];

  const handleAdd = () => {
    setSelectedCoupon(null);
    setForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      maxUses: '',
      expiryDate: '',
      minOrderValue: '',
    });
    setShowModal(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      maxUses: String(coupon.maxUses || ''),
      expiryDate: coupon.expiryDate || '',
      minOrderValue: String(coupon.minOrderValue || ''),
    });
    setShowModal(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    try {
      if (selectedCoupon) {
        await apiHandlers.async(updateCouponAction(selectedCoupon.id, form as any), {
          pending: 'Updating coupon...',
          success: 'Coupon updated',
          error: 'Failed to update coupon',
        });
      } else {
        await apiHandlers.async(createCouponAction(form as any), {
          pending: 'Creating coupon...',
          success: 'Coupon created',
          error: 'Failed to create coupon',
        });
      }

      // Refresh the data
      if (onRefresh) {
        await onRefresh();
      }

      setShowModal(false);
    } catch (error) {
      console.error('Coupon save error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCoupon) return;
    try {
      const ok = await apiHandlers.deleteWithConfirm(selectedCoupon.code, async () => {
        await deleteCouponAction(selectedCoupon.id);
      });

      if (ok && onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Delete coupon error:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
          <Button onClick={handleAdd}>
            <Plus size={20} />
            Add Coupon
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={coupons}
            columns={columns}
            searchableFields={['code', 'description']}
            actions={[
              {
                label: 'Edit',
                icon: <Edit size={18} />,
                onClick: handleEdit,
              },
              {
                label: 'Delete',
                icon: <Trash2 size={18} />,
                variant: 'destructive',
                onClick: handleDelete,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Coupon Modal */}
      <FormModal
        open={showModal}
        title={selectedCoupon ? 'Edit Coupon' : 'Add Coupon'}
        onSubmit={handleSave}
        onCancel={() => setShowModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code *
            </label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g., SAVE10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Coupon description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <Input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              placeholder="10"
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${selectedCoupon?.code}"?`}
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

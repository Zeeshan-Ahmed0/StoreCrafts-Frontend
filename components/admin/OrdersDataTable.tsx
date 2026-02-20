'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Order, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';

interface OrdersDataTableProps {
  initialData: DataFetchState<Order>;
  onRefresh?: () => Promise<void>;
}

export function OrdersDataTable({ initialData, onRefresh }: OrdersDataTableProps) {
  const [orders] = useState<Order[]>(initialData.data);
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

  const ordersColumns: Column<Order>[] = [
    { key: 'orderNumber', label: 'Order #', width: '100px' },
    { key: 'customerName', label: 'Customer' },
    { key: 'customerEmail', label: 'Email' },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (val) => `$${val.toFixed(2)}`,
      width: '100px',
    },
    { key: 'itemCount', label: 'Items', width: '80px' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'delivered' ? 'default' : 'outline'}>
          {val}
        </Badge>
      ),
      width: '120px',
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (val) => (
        <Badge variant={val === 'paid' ? 'default' : 'destructive'}>
          {val}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (val) => formatDate(val),
      width: '150px',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Orders</CardTitle>
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
      </CardHeader>
      <CardContent>
        <DataTable
          data={orders}
          columns={ordersColumns}
          searchableFields={['orderNumber', 'customerName', 'customerEmail']}
          actions={[
            {
              label: 'View',
              icon: <Eye size={18} />,
              onClick: (order) => {
                // TODO: Open order detail modal or navigate to detail page
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Product, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProductsDataTableProps {
  initialData: DataFetchState<Product>;
  onRefresh?: () => Promise<void>;
}

export function ProductsDataTable({ initialData, onRefresh }: ProductsDataTableProps) {
  const [products] = useState<Product[]>(initialData.data);
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

  const productColumns: Column<Product>[] = [
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (val: any) => `$${val}` },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (val: any) => formatDate(val),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
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
          data={products}
          columns={productColumns}
          searchableFields={['name', 'category']}
          actions={[
            {
              label: 'View',
              icon: <Eye size={18} />,
              onClick: (product: any) => {
                // Navigate to product detail
              },
            },
            {
              label: 'Edit',
              icon: <Edit size={18} />,
              onClick: (product: any) => {
                // Navigate to edit
              },
            },
            {
              label: 'Delete',
              icon: <Trash2 size={18} />,
              variant: 'destructive',
              onClick: (product: any) => {
                // Handle delete
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

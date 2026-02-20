'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Review, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReviewsDataTableProps {
  initialData: DataFetchState<Review>;
  onRefresh?: () => Promise<void>;
}

export function ReviewsDataTable({ initialData, onRefresh }: ReviewsDataTableProps) {
  const [reviews] = useState<Review[]>(initialData.data);
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

  const columns: Column<Review>[] = [
    { key: 'productName', label: 'Product' },
    { key: 'userName', label: 'Customer' },
    {
      key: 'rating',
      label: 'Rating',
      render: (val) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: val }).map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      ),
      width: '120px',
    },
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'approved' ? 'default' : 'outline'}>
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
        <CardTitle>All Reviews</CardTitle>
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
          data={reviews}
          columns={columns}
          searchableFields={['productName', 'userName', 'title']}
        />
      </CardContent>
    </Card>
  );
}

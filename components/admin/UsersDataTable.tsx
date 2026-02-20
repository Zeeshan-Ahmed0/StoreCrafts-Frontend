'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoreUser, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface UsersDataTableProps {
  initialData: DataFetchState<StoreUser>;
  onRefresh?: () => Promise<void>;
}

export function UsersDataTable({ initialData, onRefresh }: UsersDataTableProps) {
  const [users] = useState<StoreUser[]>(initialData.data);
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

  const columns: Column<StoreUser>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <Badge variant="outline" className="capitalize">
          {val}
        </Badge>
      ),
      width: '120px',
    },
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
      key: 'joinDate',
      label: 'Join Date',
      render: (val) => formatDate(val),
      width: '150px',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Users</CardTitle>
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
          data={users}
          columns={columns}
          searchableFields={['name', 'email']}
        />
      </CardContent>
    </Card>
  );
}

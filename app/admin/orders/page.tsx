import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { OrderFilterParams } from '@/types';
import { listOrdersAction } from '@/actions/orders';
import { OrdersDataTable } from '@/components/admin/OrdersDataTable';
import { OrdersLoadingFallback } from '@/components/admin/OrdersLoadingFallback';

interface OrdersPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function OrdersContent({ searchParams }: OrdersPageProps) {
  // Parse search parameters
  const params = parseSearchParams(searchParams);

  // Prepare filter parameters
  const orderParams: OrderFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: params.order,
  };

  // Fetch data on the server
  const ordersData = await listOrdersAction(orderParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage all store orders</p>
      </div>

      <OrdersDataTable initialData={ordersData} />
    </div>
  );
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense fallback={<OrdersLoadingFallback />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}
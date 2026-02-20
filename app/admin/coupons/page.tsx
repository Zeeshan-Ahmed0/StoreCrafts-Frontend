import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { CouponFilterParams } from '@/types';
import { listCouponsAction } from '@/actions/coupons';
import { CouponsDataTable } from '@/components/admin/CouponsDataTable';
import { CouponsLoadingFallback } from '@/components/admin/CouponsLoadingFallback';

interface CouponsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function CouponsContent({ searchParams }: CouponsPageProps) {
  // Parse search parameters
  const params = parseSearchParams(searchParams);

  // Prepare filter parameters
  const couponParams: CouponFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: params.order,
  };

  // Fetch data on the server
  const couponsData = await listCouponsAction(couponParams);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons</p>
        </div>
      </div>

      <CouponsDataTable initialData={couponsData} />
    </div>
  );
}

export default function CouponsPage({ searchParams }: CouponsPageProps) {
  return (
    <Suspense fallback={<CouponsLoadingFallback />}>
      <CouponsContent searchParams={searchParams} />
    </Suspense>
  );
}
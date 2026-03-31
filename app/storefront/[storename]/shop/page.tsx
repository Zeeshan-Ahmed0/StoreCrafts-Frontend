import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { ProductFilterParams } from '@/types';
import { getProductsAction } from '@/actions/catalog';

interface ShopPageProps {
  searchParams: Record<string, string | string[] | undefined>;
  params: { storename: string };
}

async function ShopContent({ searchParams, params }: ShopPageProps) {
  const { storename } = params;
  const params_parsed = parseSearchParams(searchParams);

  const productParams: ProductFilterParams = {
    page: params_parsed.page,
    pageSize: params_parsed.pageSize,
    search: params_parsed.search,
    category: params_parsed.category,
    sort: params_parsed.sort,
    order: (params_parsed.order as 'asc' | 'desc' | undefined),
  };

  const productsData = await getProductsAction(productParams, storename);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Shop</h1>
        <p className="text-gray-600 mt-2">Browse our products</p>
      </div>

      {/* Filters and Sort could go here */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Showing {productsData.data.length} of {productsData.total} products</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Products would be rendered here */}
        {productsData.data.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <p className="col-span-full text-gray-600">Products: {productsData.total}</p>
        )}
      </div>

      {/* Pagination could go here */}
    </div>
  );
}

export default function ShopPage({ searchParams, params }: ShopPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent searchParams={searchParams} params={params} />
    </Suspense>
  );
}

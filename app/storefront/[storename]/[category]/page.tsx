import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { ProductFilterParams } from '@/types';
import { getProductsAction } from '@/actions/catalog';

interface CategoryPageProps {
  searchParams: Record<string, string | string[] | undefined>;
  params: { storename: string; category: string };
}

async function CategoryContent({ searchParams, params }: CategoryPageProps) {
  const { storename, category } = params;
  const params_parsed = parseSearchParams(searchParams);

  const productParams: ProductFilterParams = {
    page: params_parsed.page,
    pageSize: params_parsed.pageSize,
    category: category,
    search: params_parsed.search,
    sort: params_parsed.sort,
    order: (params_parsed.order as 'asc' | 'desc' | undefined),
  };

  const productsData = await getProductsAction(productParams, storename);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 capitalize">{category}</h1>
        <p className="text-gray-600 mt-2">Browse products in this category</p>
      </div>

      {/* Filters and Sort */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Showing {productsData.data.length} of {productsData.total} products</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Products would be rendered here */}
        {productsData.data.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No products found in this category</p>
          </div>
        ) : (
          <p className="col-span-full text-gray-600">Products: {productsData.total}</p>
        )}
      </div>

      {/* Pagination could go here */}
    </div>
  );
}

export default function CategoryPage({ searchParams, params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent searchParams={searchParams} params={params} />
    </Suspense>
  );
}


import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { ProductFilterParams, CategoryFilterParams } from '@/types';
import { getProductsAction, getCategoriesAction } from '@/actions/catalog';
import { CatalogView } from '@/components/admin/CatalogView';
import { CatalogLoadingFallback } from '@/components/admin/CatalogLoadingFallback';

interface CatalogPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  // Parse search parameters
  const params = parseSearchParams(searchParams);

  // Prepare filter parameters for products
  const productParams: ProductFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: (params.order as 'asc' | 'desc' | undefined),
  };

  // Prepare filter parameters for categories
  const categoryParams: CategoryFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: (params.order as 'asc' | 'desc' | undefined),
  };

  // Fetch data on the server
  const [productsData, categoriesData] = await Promise.all([
    getProductsAction(productParams),
    getCategoriesAction(categoryParams),
  ]);

  return (
    <CatalogView
      productsData={productsData}
      categoriesData={categoriesData}
    />
  );
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogLoadingFallback />}>
      <CatalogContent searchParams={searchParams} />
    </Suspense>
  );
}
import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { ProductFilterParams, CategoryFilterParams } from '@/types';
import { getProductsAction, getCategoriesAction } from '@/actions/catalog';
import { CatalogView } from '@/components/admin/CatalogView';
import { CatalogLoadingFallback } from '@/components/admin/CatalogLoadingFallback';

interface CatalogPageProps {
  searchParams: Record<string, string | string[] | undefined>;
  params: { storename: string };
}

async function CatalogContent({ searchParams, params }: CatalogPageProps) {
  const { storename } = params;

  // Parse search parameters
  const params_parsed = parseSearchParams(searchParams);

  // Prepare filter parameters for products
  const productParams: ProductFilterParams = {
    page: params_parsed.page,
    pageSize: params_parsed.pageSize,
    search: params_parsed.search,
    sort: params_parsed.sort,
    order: (params_parsed.order as 'asc' | 'desc' | undefined),
  };

  // Prepare filter parameters for categories
  const categoryParams: CategoryFilterParams = {
    page: params_parsed.page,
    pageSize: params_parsed.pageSize,
    search: params_parsed.search,
    sort: params_parsed.sort,
    order: (params_parsed.order as 'asc' | 'desc' | undefined),
  };

  // Fetch data on the server with store context
  const [productsData, categoriesData] = await Promise.all([
    getProductsAction(productParams, storename),
    getCategoriesAction(categoryParams, storename),
  ]);

  return (
    <CatalogView
      productsData={productsData}
      categoriesData={categoriesData}
    />
  );
}

export default function CatalogPage({ searchParams, params }: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogLoadingFallback />}>
      <CatalogContent searchParams={searchParams} params={params} />
    </Suspense>
  );
}
import { Suspense } from 'react';
import { getProductsAction, getCategoriesAction } from '@/actions/catalog';
import { ProductFilterParams, CategoryFilterParams } from '@/types';
import { StorefrontHome } from '@/components/storefront/StorefrontHome';
import { StorefrontLoadingFallback } from '@/components/storefront/StorefrontLoadingFallback';

interface StorefrontHomePageProps {
  params: { storename: string };
  searchParams: Record<string, string | string[] | undefined>;
}

async function StorefrontHomeContent({ params, searchParams }: StorefrontHomePageProps) {
  const { storename } = params;

  // For home page, show featured products and categories
  const productParams: ProductFilterParams = {
    page: 1,
    pageSize: 12,
    sort: 'created_at',
    order: 'desc',
  };

  const categoryParams: CategoryFilterParams = {
    page: 1,
    pageSize: 20,
  };

  const [productsData, categoriesData] = await Promise.all([
    getProductsAction(productParams, storename),
    getCategoriesAction(categoryParams, storename),
  ]);

  return (
    <StorefrontHome
      productsData={productsData}
      categoriesData={categoriesData}
      storename={storename}
    />
  );
}

export default function StorefrontHomePage(props: StorefrontHomePageProps) {
  return (
    <Suspense fallback={<StorefrontLoadingFallback />}>
      <StorefrontHomeContent {...props} />
    </Suspense>
  );
}
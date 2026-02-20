import { Suspense } from 'react';
import { ProductForm } from '@/components/catalog/ProductForm';
import { getProductAction, getCategoriesAction } from '@/actions/catalog';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

async function EditProductContent({ productId }: { productId: string }) {
  try {
    const [product, categoriesResult] = await Promise.all([
      getProductAction(productId),
      getCategoriesAction({
        page: 1,
        pageSize: 100,
      }),
    ]);

    if (!product) {
      notFound();
    }

    return (
      <ProductForm product={product} categories={categoriesResult.data} />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            Failed to load product. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function EditProductPage({
  params,
}: EditProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <EditProductContent productId={params.productId} />
    </Suspense>
  );
}
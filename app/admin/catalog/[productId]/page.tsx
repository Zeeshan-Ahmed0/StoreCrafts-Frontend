import { Suspense } from 'react';
import { ProductDetailContainer } from '@/components/catalog/ProductDetailContainer';
import { getProductAction } from '@/actions/catalog';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

async function ProductContent({ productId }: { productId: string }) {
  try {
    const product = await getProductAction(productId);

    if (!product) {
      notFound();
    }

    return <ProductDetailContainer product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            Failed to load product details. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ProductContent productId={params.productId} />
    </Suspense>
  );
}


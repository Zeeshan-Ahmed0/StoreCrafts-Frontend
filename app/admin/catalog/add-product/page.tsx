import { Suspense } from 'react';
import { ProductForm } from '@/components/catalog/ProductForm';
import { getCategoriesAction } from '@/actions/catalog';
import { Card, CardContent } from '@/components/ui/card';

async function AddProductContent() {
  try {
    const categoriesResult = await getCategoriesAction({
      page: 1,
      pageSize: 100,
    });

    return <ProductForm categories={categoriesResult.data} />;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">Failed to load categories. Please try again.</div>
        </CardContent>
      </Card>
    );
  }
}

export default function AddProductPage() {
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
      <AddProductContent />
    </Suspense>
  );
}
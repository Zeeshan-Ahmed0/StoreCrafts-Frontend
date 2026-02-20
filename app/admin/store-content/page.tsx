import { Suspense } from 'react';
import { StoreContentForm } from '@/components/store-content/StoreContentForm';
import { listBanners } from '@/actions/banners';
import { Card, CardContent } from '@/components/ui/card';

async function StoreContentContent() {
  try {
    const bannersResult = await listBanners();
    const banners = Array.isArray(bannersResult) ? bannersResult : [];

    return (
      <StoreContentForm initialBanners={banners} initialFooterLinks={[]} />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            Failed to load store content. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function StoreContentPage() {
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
      <StoreContentContent />
    </Suspense>
  );
}
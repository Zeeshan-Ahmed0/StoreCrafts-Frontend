import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { ReviewFilterParams } from '@/types';
import { listReviewsAction } from '@/actions/reviews';
import { ReviewsDataTable } from '@/components/admin/ReviewsDataTable';
import { ReviewsLoadingFallback } from '@/components/admin/ReviewsLoadingFallback';

interface ReviewsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function ReviewsContent({ searchParams }: ReviewsPageProps) {
  // Parse search parameters
  const params = parseSearchParams(searchParams);

  // Prepare filter parameters
  const reviewParams: ReviewFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: params.order,
  };

  // Fetch data on the server
  const reviewsData = await listReviewsAction(reviewParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">Manage customer reviews</p>
      </div>

      <ReviewsDataTable initialData={reviewsData} />
    </div>
  );
}

export default function ReviewsPage({ searchParams }: ReviewsPageProps) {
  return (
    <Suspense fallback={<ReviewsLoadingFallback />}>
      <ReviewsContent searchParams={searchParams} />
    </Suspense>
  );
}
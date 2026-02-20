import { Suspense } from 'react';
import { parseSearchParams } from '@/lib/server-only';
import { UserFilterParams } from '@/types';
import { listUsersAction } from '@/actions/users';
import { UsersDataTable } from '@/components/admin/UsersDataTable';
import { UsersLoadingFallback } from '@/components/admin/UsersLoadingFallback';

interface UsersPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function UsersContent({ searchParams }: UsersPageProps) {
  // Parse search parameters
  const params = parseSearchParams(searchParams);

  // Prepare filter parameters
  const userParams: UserFilterParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    order: params.order,
  };

  // Fetch data on the server
  const usersData = await listUsersAction(userParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage store users and staff</p>
      </div>

      <UsersDataTable initialData={usersData} />
    </div>
  );
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <Suspense fallback={<UsersLoadingFallback />}>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}
/**
 * Guard function to ensure code only runs on the server.
 * Throws an error if called from client-side code.
 */
export function serverOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'This function should only be called on the server. ' +
        'Remove "use server" directive or move this to a server action.'
    );
  }
}

/**
 * Parse and validate search parameters from URL query string.
 * Extracts and validates common admin filter parameters.
 */
export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = Math.max(1, parseInt(String(searchParams.page ?? 1)));
  const pageSize = Math.max(1, Math.min(100, parseInt(String(searchParams.pageSize ?? 10))));
  const search = String(searchParams.search ?? '').trim();
  const sort = String(searchParams.sort ?? '').trim();
  const order = String(searchParams.order ?? 'desc') as 'asc' | 'desc';
  const status = String(searchParams.status ?? '').trim();
  const category = String(searchParams.category ?? '').trim();

  return {
    page,
    pageSize,
    search,
    sort,
    order,
    status,
    category,
  };
}

/**
 * Build pagination query object from parsed search params.
 * Validates pagination values and returns safe defaults.
 */
export function getPaginationQuery(searchParams: Record<string, string | string[] | undefined>) {
  const { page, pageSize } = parseSearchParams(searchParams);

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  };
}

/**
 * Extract filter parameters specific to products.
 */
export function parseProductFilters(searchParams: Record<string, string | string[] | undefined>) {
  const { search, sort, order, category, status } = parseSearchParams(searchParams);

  return {
    search: search || undefined,
    categoryId: category ? parseInt(category) : undefined,
    status: (status || undefined) as 'active' | 'inactive' | 'draft' | undefined,
    sort: sort || 'createdAt',
    order,
  };
}

/**
 * Extract filter parameters specific to orders.
 */
export function parseOrderFilters(searchParams: Record<string, string | string[] | undefined>) {
  const { search, sort, order, status } = parseSearchParams(searchParams);

  return {
    search: search || undefined,
    status: (status || undefined) as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | undefined,
    sort: sort || 'createdAt',
    order,
  };
}

/**
 * Extract filter parameters specific to coupons.
 */
export function parseCouponFilters(searchParams: Record<string, string | string[] | undefined>) {
  const { search, sort, order, status } = parseSearchParams(searchParams);

  return {
    search: search || undefined,
    status: (status || undefined) as 'active' | 'inactive' | undefined,
    sort: sort || 'createdAt',
    order,
  };
}

/**
 * Extract filter parameters specific to reviews.
 */
export function parseReviewFilters(searchParams: Record<string, string | string[] | undefined>) {
  const { search, sort, order } = parseSearchParams(searchParams);

  return {
    search: search || undefined,
    sort: sort || 'createdAt',
    order,
  };
}

/**
 * Extract filter parameters specific to users.
 */
export function parseUserFilters(searchParams: Record<string, string | string[] | undefined>) {
  const { search, sort, order, status } = parseSearchParams(searchParams);

  return {
    search: search || undefined,
    status: (status || undefined) as 'active' | 'inactive' | undefined,
    sort: sort || 'createdAt',
    order,
  };
}

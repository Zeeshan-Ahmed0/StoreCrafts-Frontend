import React from 'react';

interface StorefrontHomeProps {
  productsData?: any;
  categoriesData?: any;
  storename?: string;
}

export function StorefrontHome({ productsData, categoriesData, storename }: StorefrontHomeProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{storename || 'Store'} Homepage</h1>
      <p>Products: {productsData?.data?.length ?? 0}</p>
      <p>Categories: {categoriesData?.data?.length ?? 0}</p>
    </div>
  );
}

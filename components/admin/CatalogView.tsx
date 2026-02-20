'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataFetchState, Product, Category } from '@/types';
import { ProductsDataTable } from '@/components/admin/ProductsDataTable';
import { CategoriesDataTable } from '@/components/admin/CategoriesDataTable';

interface CatalogViewProps {
  productsData: DataFetchState<Product>;
  categoriesData: DataFetchState<Category>;
  onRefreshProducts?: () => Promise<void>;
  onRefreshCategories?: () => Promise<void>;
}

export function CatalogView({
  productsData,
  categoriesData,
  onRefreshProducts,
  onRefreshCategories,
}: CatalogViewProps) {
  const [view, setView] = useState<'products' | 'categories'>('products');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalog</h1>
          <p className="text-gray-600 mt-1">Manage products and categories</p>
        </div>
        {view === 'products' && (
          <Link href="/admin/catalog/add-product">
            <Button>
              <Plus size={20} />
              Add Product
            </Button>
          </Link>
        )}
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'products' | 'categories')}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductsDataTable
            initialData={productsData}
            onRefresh={onRefreshProducts}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoriesDataTable
            initialData={categoriesData}
            onRefresh={onRefreshCategories}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

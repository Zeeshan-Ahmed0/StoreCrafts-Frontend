'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createProductAction, updateProductAction } from '@/actions/catalog';
import { Category, Product } from '@/types';
import { useNotification } from '@/hooks/useNotification';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useNotification();
  const isEditMode = !!product;

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    categoryId: product?.categoryId?.toString() || '',
    sku: product?.sku || '',
    stock: product?.stock?.toString() || '',
    status: (product?.status || 'active') as 'active' | 'inactive' | 'draft',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!form.name.trim()) {
      toast.error('Product name is required');
      setIsLoading(false);
      return;
    }

    if (!form.price) {
      toast.error('Product price is required');
      setIsLoading(false);
      return;
    }

    if (!form.categoryId) {
      toast.error('Product category is required');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        categoryId: form.categoryId || undefined,
        sku: form.sku,
        stock: parseInt(form.stock || '0', 10),
        status: form.status,
      };

      if (isEditMode && product) {
        const result = (await updateProductAction(product.id, payload as any)) as any;

        if (result?.success) {
          toast.success('Product updated successfully');
          router.push('/admin/catalog');
        } else {
          toast.error(result?.error || 'Failed to update product');
        }
      } else {
        const result = (await createProductAction(payload as any)) as any;

        if (result?.success) {
          toast.success('Product created successfully');
          router.push('/admin/catalog');
        } else {
          toast.error(result?.error || 'Failed to create product');
        }
      }
    } catch (error) {
      const message = isEditMode
        ? 'An error occurred while updating the product'
        : 'An error occurred while creating the product';
      toast.error(message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const backLink = isEditMode ? `/admin/catalog/${product?.id}` : '/admin/catalog';
  const pageTitle = isEditMode ? 'Edit Product' : 'Add Product';
  const pageDescription = isEditMode
    ? 'Update product details'
    : 'Create a new product in your catalog';
  const submitButtonText = isEditMode ? 'Update Product' : 'Create Product';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backLink}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-600 mt-1">{pageDescription}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <Input
                  required
                  value={form.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select value={form.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  placeholder="Enter original price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <Input
                  required
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4 justify-end pt-6">
              <Link href={backLink}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : submitButtonText}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

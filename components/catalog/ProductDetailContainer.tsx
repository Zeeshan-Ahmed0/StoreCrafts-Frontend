'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { deleteProductAction } from '@/actions/catalog';
import { Product } from '@/types';
import { useNotification } from '@/hooks/useNotification';

interface ProductDetailContainerProps {
  product: Product;
}

export function ProductDetailContainer({ product }: ProductDetailContainerProps) {
  const router = useRouter();
  const { toast } = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      const result = (await deleteProductAction(product.id)) as any;

      if (result?.success) {
        toast.success('Product deleted successfully');
        router.push('/admin/catalog');
      } else {
        toast.error(result?.error || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the product');
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/catalog">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">Product ID: {product.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/catalog/${product.id}/edit-product`}>
            <Button variant="outline">
              <Edit size={20} />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={20} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <p className="text-lg font-medium">{product.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <p className="text-gray-600">
                      {product.category || 'No category assigned'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <p className="text-gray-600">{product.sku || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <p className="text-gray-600">
                        {product.originalPrice
                          ? `$${product.originalPrice.toFixed(2)}`
                          : 'No original price'}
                      </p>
                    </div>
                  </div>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Discount: {(
                          ((product.originalPrice - product.price) / product.originalPrice) *
                          100
                        ).toFixed(0)}% off
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Stock
                    </label>
                    <p className="text-lg font-semibold">{product.stock || 0} units</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      {product.stock && product.stock > 10
                        ? '✓ Good stock level'
                        : product.stock && product.stock > 0
                        ? '⚠ Low stock'
                        : '✗ Out of stock'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {product.description || 'No description'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Images */}
              {product.images && product.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {product.image && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Main Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-medium">{formatDate(product.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium">{formatDate(product.updatedAt)}</p>
                  </div>
                  {product.rating && (
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="font-medium">{product.rating} / 5</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {product.reviews && product.reviews > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Total Reviews: <span className="font-semibold">{product.reviews}</span>
                  </p>
                  {product.rating && (
                    <div>
                      <p className="text-gray-600">Average Rating</p>
                      <div className="flex items-center gap-2 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${
                              i < Math.round(product.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-lg font-semibold ml-2">
                          {product.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteProduct}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

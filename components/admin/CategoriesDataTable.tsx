'use client';

import { useState, useCallback } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Category, DataFetchState } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/catalog';
import { apiHandlers } from '@/lib/apiHandlers';

interface CategoriesDataTableProps {
  initialData: DataFetchState<Category>;
  onRefresh?: () => Promise<void>;
}

export function CategoriesDataTable({
  initialData,
  onRefresh,
}: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialData.data);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryForm({ name: '', description: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (selectedCategory) {
        await apiHandlers.async(
          updateCategoryAction(selectedCategory.id, categoryForm),
          {
            pending: 'Updating category...',
            success: 'Category updated',
            error: 'Failed to update category',
          } as any
        );
      } else {
        await apiHandlers.async(createCategoryAction(categoryForm), {
          pending: 'Creating category...',
          success: 'Category created',
          error: 'Failed to create category',
        } as any);
      }

      // Refresh the data
      if (onRefresh) {
        await onRefresh();
      }

      setShowCategoryModal(false);
    } catch (error) {
      console.error('Category save error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      const ok = await apiHandlers.deleteWithConfirm(selectedCategory.name, async () => {
        await deleteCategoryAction(selectedCategory.id);
      });

      if (ok && onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Delete category error:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const categoryColumns: Column<Category>[] = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'productCount', label: 'Products' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (val: any) => formatDate(val),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
          <Button onClick={handleAddCategory}>
            <Plus size={20} />
            Add Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={categories}
            columns={categoryColumns}
            searchableFields={['name']}
            actions={[
              {
                label: 'Edit',
                icon: <Edit size={18} />,
                onClick: handleEditCategory,
              },
              {
                label: 'Delete',
                icon: <Trash2 size={18} />,
                variant: 'destructive',
                onClick: handleDeleteCategory,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Category Modal */}
      <FormModal
        open={showCategoryModal}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
        description={
          selectedCategory
            ? 'Update category details'
            : 'Create a new category'
        }
        submitText={selectedCategory ? 'Update' : 'Create'}
        onSubmit={handleSaveCategory}
        onCancel={() => setShowCategoryModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <Input
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
              placeholder="Enter category description"
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

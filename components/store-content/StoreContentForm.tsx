'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { Banner, FooterLink } from '@/types';
import { listBanners, createBanner, deleteBanner } from '@/actions/banners';
import { useNotification } from '@/hooks/useNotification';

interface StoreContentFormProps {
  initialBanners?: Banner[];
  initialFooterLinks?: FooterLink[];
}

export function StoreContentForm({
  initialBanners = [],
  initialFooterLinks = [],
}: StoreContentFormProps) {
  const { toast } = useNotification();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(initialFooterLinks);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    image: '',
    link: '',
  });

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const result = await listBanners();
        if (result && Array.isArray(result)) {
          setBanners(result);
        }
      } catch (error) {
        console.error('Error loading banners:', error);
      }
    };

    if (banners.length === 0) {
      loadBanners();
    }
  }, []);

  const handleAddBanner = async () => {
    if (!bannerForm.title || !bannerForm.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = (await createBanner(bannerForm)) as any;
      if (result?.success) {
        toast.success('Banner created successfully');
        const refreshed = await listBanners();
        if (refreshed && Array.isArray(refreshed)) {
          setBanners(refreshed);
        }
        setShowBannerForm(false);
        setBannerForm({ title: '', image: '', link: '' });
      } else {
        toast.error(result?.error || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Add banner error:', error);
      toast.error('Failed to create banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = (await deleteBanner(bannerId)) as any;
      if (result?.success) {
        toast.success('Banner deleted successfully');
        const refreshed = await listBanners();
        if (refreshed && Array.isArray(refreshed)) {
          setBanners(refreshed);
        }
      } else {
        toast.error(result?.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete banner error:', error);
      toast.error('Failed to delete banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFooterLink = async () => {
    // TODO: Add footer link to API
    toast.info('Coming soon');
  };

  const handleDeleteFooterLink = async (linkId: string) => {
    // TODO: Delete footer link from API
    setFooterLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Content</h1>
        <p className="text-gray-600 mt-1">Manage banners, theme, and footer links</p>
      </div>

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="footer">Footer Links</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowBannerForm(true)} disabled={isLoading}>
              <Plus size={20} />
              Add Banner
            </Button>
          </div>

          {showBannerForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title *
                    </label>
                    <Input
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                      placeholder="Enter banner title"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <Input
                      value={bannerForm.image}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, image: e.target.value })
                      }
                      placeholder="Enter image URL"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link (Optional)
                    </label>
                    <Input
                      value={bannerForm.link}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, link: e.target.value })
                      }
                      placeholder="Enter link URL"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowBannerForm(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddBanner} disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add Banner'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {banners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Banners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{banner.title}</h3>
                        <p className="text-sm text-gray-500">{banner.image}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddFooterLink} disabled={isLoading}>
              <Plus size={20} />
              Add Link
            </Button>
          </div>

          {footerLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Footer Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {footerLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{link.label}</h3>
                        <p className="text-sm text-gray-500">{link.url}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFooterLink(link.id)}
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Theme configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Layout customization coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

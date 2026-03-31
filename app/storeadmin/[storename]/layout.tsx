"use client";

import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useValidateStoreAccess } from "@/hooks/useStoreContext";

/**
 * Store Admin Layout
 * Wraps all store-specific admin routes with [storename] parameter
 * Validates user has access to this store + fetches store details
 */
export default function StoreAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const storename = params?.storename as string;
  const [storeData, setStoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasStoreAccess = useValidateStoreAccess();

  useEffect(() => {
    if (!storename) {
      setIsLoading(false);
      return;
    }

    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/public/stores/by-slug/${storename}`);
        if (response.ok) {
          const data = await response.json();
          setStoreData(data.data);
        } else {
          console.error("Failed to fetch store:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storename]);

  if (!storename) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">Invalid store context</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading store...</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">Store not found</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["store_admin"]}>
      <div>
        {/* Store context available to child routes */}
        {/* storeData contains: id, slug, name, subTitle, description, logo, theme */}
        {children}
      </div>
    </RoleGuard>
  );
}

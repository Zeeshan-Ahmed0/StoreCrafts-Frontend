"use client";

import { ReactNode } from "react";
import RoleGuard from "@/components/RoleGuard";

/**
 * Super Admin Layout
 * Wraps platform-level admin routes
 * Restricted to super_admin role users
 */
export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div>{children}</div>
    </RoleGuard>
  );
}

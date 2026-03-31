"use client";

import { ReactNode } from "react";

/**
 * Auth Layout
 * Wraps authentication pages (login, forgot-password)
 * No specific role requirement - accessible for authentication purposes
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}

'use client';

import ProtectedLayout from "@/components/protected-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={["Moderator"]}>
      {children}
    </ProtectedLayout>
  );
}

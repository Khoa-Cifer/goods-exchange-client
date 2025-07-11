'use client';

import ProtectedLayout from "@/components/protected-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRole={"Seller"}>
      {children}
    </ProtectedLayout>
  );
}

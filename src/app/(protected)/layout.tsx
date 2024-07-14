"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import ProtectedLayoutComponent from "@/layouts/ProtectedLayout";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!session && !isLoading && process.env.NODE_ENV === "production") {
      return router.push("/login");
    }
  }, [isLoading, router, session]);

  return (
    (session || process.env.NODE_ENV !== "production") && <ProtectedLayoutComponent>{children}</ProtectedLayoutComponent>
  );
}

"use client";
import Page from "@/components/Page";
import useLogout from "@/utils/hooks/useLogout";
import { useEffect } from "react";

export default function LogoutPage() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <Page>
      <div className="flex flex-col gap-4 flex-wrap">Logging out...</div>
    </Page>
  );
}

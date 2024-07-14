import NonAuthedLayout from "@/layouts/DefaultLayout";
import { PropsWithChildren } from "react";
import { RecoveryFlowProvider } from "@/contexts/RecoveryFlowContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recovery",
};

export default function RecoveryLayout({ children }: PropsWithChildren) {
  return (
    <NonAuthedLayout>
      <RecoveryFlowProvider>{children}</RecoveryFlowProvider>
    </NonAuthedLayout>
  );
}

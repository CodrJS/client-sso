import NonAuthedLayout from "@/layouts/DefaultLayout";
import { PropsWithChildren } from "react";
import { VerificationFlowProvider } from "@/contexts/VerificationFlowContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification",
};

export default function VerificationLayout({ children }: PropsWithChildren) {
  return (
    <NonAuthedLayout>
      <VerificationFlowProvider>{children}</VerificationFlowProvider>
    </NonAuthedLayout>
  );
}

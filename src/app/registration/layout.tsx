import NonAuthedLayout from "@/layouts/DefaultLayout";
import { PropsWithChildren } from "react";
import { RegistrationFlowProvider } from "@/contexts/RegistrationFlowContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration",
};

export default function RegistrationLayout({ children }: PropsWithChildren) {
  return (
    <NonAuthedLayout>
      <RegistrationFlowProvider>{children}</RegistrationFlowProvider>
    </NonAuthedLayout>
  );
}

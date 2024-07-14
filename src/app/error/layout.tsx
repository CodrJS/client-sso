import NonAuthedLayout from "@/layouts/DefaultLayout";
import { PropsWithChildren } from "react";
import { ErrorFlowProvider } from "@/contexts/ErrorFlowContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error | Bulmer SSO",
};

export default function LoginLayout({ children }: PropsWithChildren) {
  return (
    <NonAuthedLayout>
      <ErrorFlowProvider>{children}</ErrorFlowProvider>
    </NonAuthedLayout>
  );
}

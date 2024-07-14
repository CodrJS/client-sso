import NonAuthedLayout from "@/layouts/DefaultLayout";
import { PropsWithChildren } from "react";
import { LoginFlowProvider } from "@/contexts/LoginFlowContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginLayout({ children }: PropsWithChildren) {
  return (
    <NonAuthedLayout>
      <LoginFlowProvider>{children}</LoginFlowProvider>
    </NonAuthedLayout>
  );
}

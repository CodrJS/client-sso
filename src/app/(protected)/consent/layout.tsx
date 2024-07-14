import { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { ConsentFlowProvider } from "@/contexts/ConsentFlowContext";

export const metadata: Metadata = {
  title: "Consent | Bulmer SSO",
};

export default function LoginLayout({ children }: PropsWithChildren) {
  return <ConsentFlowProvider>{children}</ConsentFlowProvider>;
}

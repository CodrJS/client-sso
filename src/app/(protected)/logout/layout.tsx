import { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logout | Bulmer SSO",
};

export default function LogoutLayout({ children }: PropsWithChildren) {
  return children;
}

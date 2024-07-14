import { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions | Bulmer SSO",
};

export default function SessionsLayout({ children }: PropsWithChildren) {
  return children;
}

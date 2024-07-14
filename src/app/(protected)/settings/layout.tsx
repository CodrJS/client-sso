import { PropsWithChildren } from "react";
import { SettingsFlowProvider } from "@/contexts/SettingsFlowContext";
import type { Metadata } from "next";
import SettingsNavigation from "@/components/settings/Navigation";
import Page from "@/components/Page";

export const metadata: Metadata = {
  title: "Settings | Bulmer SSO",
};

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <SettingsFlowProvider>
      <Page>
        <div className="flex flex-col px-4 gap-4 sm:flex-row sm:px-0">
          <SettingsNavigation />
          <div className="grow flex flex-col gap-4">{children}</div>
        </div>
      </Page>
    </SettingsFlowProvider>
  );
}

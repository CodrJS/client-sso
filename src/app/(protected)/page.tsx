"use client";
import Page from "@/components/Page";
import ConnectedAppsCard from "@/components/dashboard/ConnectedAppsCard";
import MyIdCard from "@/components/dashboard/MyIdCard";
import QuickLinksCard from "@/components/dashboard/QuickLinksCard";
import { useSession } from "@/contexts/SessionContext";

// // Returns either the email or the username depending on the user's Identity Schema
// const getUserName = (identity: Identity) => identity.traits.email;

export default function Home() {
  const { isLoading } = useSession();

  return (
    !isLoading && (
      <Page>
        <div className="flex gap-4 flex-wrap">
          <MyIdCard />
        </div>
        <div className="flex gap-4 flex-wrap">
          <ConnectedAppsCard />
          <QuickLinksCard />
        </div>
        <ul>
          <li>Recent activity</li>
          <li>Announcements</li>
          <li>Security alerts</li>
          <li>Help/support</li>
        </ul>
      </Page>
    )
  );
}

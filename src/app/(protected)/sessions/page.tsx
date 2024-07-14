import Page from "@/components/Page";
import SessionsCard from "@/components/dashboard/SessionsCard";

export default function SessionsPage() {
  return (
    <Page>
      <div className="flex flex-col gap-4 flex-wrap">
        <span className="text-lg font-medium">Sessions</span>
        <SessionsCard />
      </div>
    </Page>
  );
}

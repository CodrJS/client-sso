"use client";
import ConnectedAccountsCard from "@/components/settings/ConnectedAccountsCard";
import ChangePasswordCard from "@/components/settings/PasswordCard";
import ProfileCard from "@/components/settings/ProfileCard";
import RecoveryCodeCard from "@/components/settings/RecoveryCodeCard";
import { useSettingsFlow } from "@/contexts/SettingsFlowContext";
import { OryClient } from "@/utils/ory/client";
import { UiNode, UiNodeGroupEnum, UpdateSettingsFlowBody } from "@ory/client";
import { useMemo } from "react";

export default function SettingsPage() {
  const { flow } = useSettingsFlow();

  const groups = useMemo(() => {
    if (flow?.ui) {
      const g = Object.fromEntries(
        Object.values(UiNodeGroupEnum).map(v => [v, [] as UiNode[]]),
      );

      for (const node of flow.ui.nodes) {
        g[node.group].push(node);
      }

      return g;
    }
  }, [flow?.ui]);

  console.log(groups);

  function onSubmit(values: UpdateSettingsFlowBody) {
    return OryClient.updateSettingsFlow({
      flow: String(flow?.id),
      updateSettingsFlowBody: values,
    }).then(({ data }) => {
      if (data?.return_to) {
        window.location.href = data?.return_to;
        return;
      }
    });
  }

  return (
    <>
      <ProfileCard flow={flow} onSubmit={onSubmit} />
      {/* <ConnectedAccountsCard flow={flow} onSubmit={onSubmit} /> */}
    </>
  );
}

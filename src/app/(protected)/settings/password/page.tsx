"use client";
import ChangePasswordCard from "@/components/settings/PasswordCard";
import RecoveryCodeCard from "@/components/settings/RecoveryCodeCard";
import { useSettingsFlow } from "@/contexts/SettingsFlowContext";
import { OryClient } from "@/utils/ory/client";
import { UpdateSettingsFlowBody } from "@ory/client";
import { notFound } from "next/navigation";

export default function PasswordSettingsPage() {
  const { flow } = useSettingsFlow();

  function onSubmit(values: UpdateSettingsFlowBody) {
    return OryClient.updateSettingsFlow({
      flow: String(flow?.id),
      updateSettingsFlowBody: values,
    }).then(() => {
      if (flow?.return_to) {
        window.location.href = flow?.return_to;
        return;
      }
    });
  }

  return notFound();
  return (
    <>
      <ChangePasswordCard flow={flow} onSubmit={onSubmit} />
      <RecoveryCodeCard flow={flow} onSubmit={onSubmit} />
    </>
  );
}

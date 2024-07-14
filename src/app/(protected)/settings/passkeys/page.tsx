"use client";
import WebAuthnCard from "@/components/settings/WebAuthnCard";
import { useSettingsFlow } from "@/contexts/SettingsFlowContext";
import { OryClient } from "@/utils/ory/client";
import { UpdateSettingsFlowBody } from "@ory/client";

export default function PasskeySettingsPage() {
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

  return (
    <>
      <WebAuthnCard flow={flow} onSubmit={onSubmit} />
    </>
  );
}

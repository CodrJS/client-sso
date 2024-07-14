"use client";
import TotpCard from "@/components/settings/TotpCard";
import { useSettingsFlow } from "@/contexts/SettingsFlowContext";
import { OryClient } from "@/utils/ory/client";
import {
  ErrorAuthenticatorAssuranceLevelNotSatisfied,
  UpdateSettingsFlowBody,
} from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function PasskeySettingsPage() {
  const { flow } = useSettingsFlow();
  const router = useRouter();

  function onSubmit(values: UpdateSettingsFlowBody) {
    return OryClient.updateSettingsFlow({
      flow: String(flow?.id),
      updateSettingsFlowBody: values,
    })
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to;
          return;
        }
      })
      .catch(
        ({
          response: res,
        }: AxiosError<ErrorAuthenticatorAssuranceLevelNotSatisfied>) => {
          if (res?.data.redirect_browser_to) {
            router.push(res.data.redirect_browser_to);
          }
        },
      );
  }

  return (
    <>
      <TotpCard flow={flow} onSubmit={onSubmit} />
    </>
  );
}

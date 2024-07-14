"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Page from "@/components/Page";
import { useVerificationFlow } from "@/contexts/VerificationFlowContext";
import classNames from "@/utils/classNames";
import useFormHandler from "@/utils/hooks/useFormHandler";
import type {
  UiNodeInputAttributes,
  UpdateVerificationFlowBody,
} from "@ory/client";
import Image from "next/image";
import { useMemo } from "react";

export default function VerificationPage() {
  const { flow, onSubmit } = useVerificationFlow();
  const { handleSubmit } = useFormHandler<UpdateVerificationFlowBody>();

  const inputNodes = useMemo(() => {
    if (flow?.ui) {
      const csfr = flow.ui.nodes.filter(
        n =>
          n.attributes.node_type === "input" && n.attributes.type != "submit",
      );
      return csfr;
    }
  }, [flow?.ui]);

  return (
    flow && (
      <Page>
        <div className="flex flex-col justify-center content-center items-center grow">
          <Image
            src="/image/Codr-Logo.svg"
            priority
            className="h-16 w-auto my-8"
            width={320}
            height={132}
            alt="Codr SSO"
          />
          <form
            action={flow.ui.action}
            method={flow.ui.method}
            onSubmit={e => handleSubmit(e, onSubmit)}
            className="flex flex-col w-full max-w-96 bg-white border rounded-lg px-6 py-8"
          >
            <span className="text-lg font-semibold text-gray-700 mb-6">
              Verify your account
            </span>
            {flow?.ui.messages?.length && (
              <div
                className={classNames(
                  "rounded-md py-1 px-2 text-sm",
                  flow.ui.messages[0].type === "error" &&
                    "bg-red-200 text-red-950 border border-red-950",
                  flow.ui.messages[0].type === "success" &&
                    "bg-green-200 text-green-950 border border-green-950",
                  flow.ui.messages[0].type === "info" &&
                    "bg-sky-100 text-sky-950 border border-sky-950",
                )}
              >
                {flow.ui.messages[0].text}
              </div>
            )}
            {inputNodes?.map(n => {
              const attributes = n.attributes as UiNodeInputAttributes;
              return (
                // @ts-ignore
                <Input key={`input ${attributes.name}`} {...n.attributes} />
              );
            })}
            <Button
              primary
              className="mt-4"
              type="submit"
              name="method"
              value="code"
            >
              {flow.state === "sent_email" ? "Verify" : "Send email"}
            </Button>
          </form>
        </div>
      </Page>
    )
  );
}

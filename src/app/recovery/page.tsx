"use client";
import Flow from "@/components/Flow";
import Page from "@/components/Page";
import { useRecoveryFlow } from "@/contexts/RecoveryFlowContext";
import classNames from "@/utils/classNames";
import useFormHandler from "@/utils/hooks/useFormHandler";
import { UpdateRecoveryFlowBody } from "@ory/client";
import Image from "next/image";

export default function RecoveryPage() {
  const { flow, onSubmit } = useRecoveryFlow();
  const { handleSubmit, isLoading } = useFormHandler<UpdateRecoveryFlowBody>();

  // const csfrAttributes = useMemo(() => {
  //   if (flow?.ui) {
  //     const csfr = flow.ui.nodes
  //       .filter(n => n.attributes.node_type === "input")
  //       .find(
  //         n => (n.attributes as UiNodeInputAttributes).name === "csrf_token",
  //       )?.attributes;
  //     return csfr as UiNodeInputAttributes;
  //   }
  // }, [flow?.ui]);

  return (
    flow && (
      <Page>
        <div className="flex flex-col justify-center content-center items-center grow">
          <Image
            src="/image/BulmerCloud-Logo.png"
            priority
            className="w-auto h-24"
            width={320}
            height={132}
            alt="Bulmer Cloud"
          />
          <form
            action={flow.ui.action}
            method={flow.ui.method}
            onSubmit={e => handleSubmit(e, onSubmit)}
            className="flex flex-col w-full max-w-96 bg-white border rounded-lg px-6 py-8"
          >
            <span className="text-lg font-semibold text-gray-700 mb-6">
              Recover your account
            </span>
            {flow?.ui.messages?.length && (
              <div
                className={classNames(
                  "rounded-md py-1 px-2 text-sm",
                  flow.ui.messages[0].type === "error" && "bg-red-200 text-red-950 border border-red-950",
                  flow.ui.messages[0].type === "success" && "bg-green-200 text-green-950 border border-green-950",
                  flow.ui.messages[0].type === "info" && "bg-sky-100 text-sky-950 border border-sky-950",
                )}
              >
                {flow.ui.messages[0].text}
              </div>
            )}
            {/* <Input
              type="email"
              name="email"
              label="Email address"
              placeholder="Email address"
              required
            />
            {/* @ts-ignore * /}
            <Input {...csfrAttributes} />
            <Button
              primary
              className="mt-4"
              type="submit"
              name="method"
              value="code"
            >
              Send email
            </Button> */}
            <Flow flow={flow} isLoading={isLoading} />
          </form>
        </div>
      </Page>
    )
  );
}

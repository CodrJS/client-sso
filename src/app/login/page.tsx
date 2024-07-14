"use client";
import Button from "@/components/Button";
import CodeFlow from "@/components/CodeFlow";
import Input from "@/components/Input";
import LoginChoice from "@/components/login/LoginChoice";
import Page from "@/components/Page";
import { useLoginFlow } from "@/contexts/LoginFlowContext";
import { LoginStage } from "@/types/Login";
import classNames from "@/utils/classNames";
import useFormHandler from "@/utils/hooks/useFormHandler";
import type { UpdateLoginFlowBody, UiNodeInputAttributes } from "@ory/client";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const [stage, setStage] = useState<LoginStage>(LoginStage.Init);
  const { flow, onSubmit } = useLoginFlow();
  const { isLoading, handleSubmit } = useFormHandler<UpdateLoginFlowBody>();

  const { csfrAttributes, email } = useMemo(() => {
    if (flow?.ui) {
      const csfr = flow.ui.nodes
        .filter(n => n.attributes.node_type === "input")
        .find(
          n => (n.attributes as UiNodeInputAttributes).name === "csrf_token",
        )?.attributes;
      const email: string | undefined = (
        flow.ui.nodes
          .filter(n => n.attributes.node_type === "input")
          .find(
            n =>
              (n.attributes as UiNodeInputAttributes).name === "identifier",
          )?.attributes as UiNodeInputAttributes
      ).value;
      return { csfrAttributes: csfr as UiNodeInputAttributes, email };
    } else {
      return { csfrAttributes: undefined, email: undefined };
    }
  }, [flow?.ui]);

  return (
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
        <div className="flex flex-col w-full max-w-96 bg-white border rounded-lg px-6 py-8 mb-24">
          <form
            action={flow?.ui?.action}
            method={flow?.ui?.method}
            onSubmit={async e => {
              const data = await handleSubmit(e, onSubmit);
              const method = data ? data.method : undefined;
              switch (method) {
                case "code":
                  setStage(LoginStage.Code);
                  break;
                default:
                  break;
              }
            }}
            className="flex flex-col w-full"
          >
            <span className="text-lg font-semibold text-gray-700 mb-6">
              Login to your account
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
            <Input
              type={stage === LoginStage.Init ? "email" : "hidden"}
              name="identifier"
              label="Email address"
              autoComplete="email"
              placeholder="Email address"
              disabled={isLoading}
              defaultValue={email}
              required
            />
            {/* <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              disabled={isLoading}
              required
            >
              <Link
                href="/recovery"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </Input> */}
            {/* @ts-ignore */}
            <Input {...csfrAttributes} type="hidden" />
            {stage === LoginStage.Init && <LoginChoice isLoading={isLoading} />}
            {stage === LoginStage.Code && <CodeFlow />}
          </form>
        </div>
      </div>
    </Page>
  );
}

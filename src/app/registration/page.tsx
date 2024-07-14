"use client";
import Button from "@/components/Button";
import CodeFlow from "@/components/CodeFlow";
import Input from "@/components/Input";
import Page from "@/components/Page";
import { useRegistrationFlow } from "@/contexts/RegistrationFlowContext";
import { SignupStage } from "@/types/Signup";
import classNames from "@/utils/classNames";
import useFormHandler from "@/utils/hooks/useFormHandler";
import {
  UiNodeInputAttributes,
  UiTextTypeEnum,
  UpdateRegistrationFlowBody,
} from "@ory/client";
import Image from "next/image";
import { useMemo, useState } from "react";

type MethodType =
  | "code"
  | "oidc"
  | "password"
  | "webauthn"
  | "profile"
  | "profile:back";

export default function RegistrationPage() {
  const [stage, setStage] = useState<SignupStage>(SignupStage.Init);
  const { flow, onSubmit } = useRegistrationFlow();
  const { handleSubmit } = useFormHandler<UpdateRegistrationFlowBody>();

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
              (n.attributes as UiNodeInputAttributes).name === "traits.email",
          )?.attributes as UiNodeInputAttributes
      ).value;
      // if (email) setStage(Stage.CHOOSE);
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
            action={flow?.ui.action}
            method={flow?.ui.method}
            onSubmit={async e => {
              const data = await handleSubmit(e, onSubmit);
              const method = data ? (data.method as MethodType) : undefined;
              switch (method) {
                case "profile":
                  setStage(SignupStage.Choose);
                  break;
                case "code":
                  setStage(SignupStage.Code);
                  break;
                case "profile:back":
                  setStage(SignupStage.Init);
                  break;
                default:
                  break;
              }
            }}
            className="flex flex-col w-full"
          >
            <span className="text-lg font-semibold text-gray-700 mb-6">
              Register for an account
            </span>
            {flow?.ui.messages?.length &&
              flow.ui.messages[0].type !== UiTextTypeEnum.Info && (
                <div
                  className={classNames(
                    "rounded-md py-1 px-2 text-sm",
                    flow.ui.messages[0].type === "error" &&
                      "bg-red-200 text-red-950 border border-red-950",
                    flow.ui.messages[0].type === "success" &&
                      "bg-green-200 text-green-950 border border-green-950",
                  )}
                >
                  {flow.ui.messages[0].text}
                </div>
              )}
            {/* @ts-ignore */}
            <Input {...csfrAttributes} type="hidden" />
            <Input
              type={stage === SignupStage.Init ? "email" : "hidden"}
              name="traits.email"
              autoComplete="email"
              label="Email address"
              placeholder="Email address"
              defaultValue={email}
              required
            />
            {stage === SignupStage.Init && (
              <Button
                primary
                className="mt-4"
                type="submit"
                name="method"
                value="profile"
              >
                Continue
              </Button>
            )}
            {stage === SignupStage.Choose && (
              <>
                <span className="text-sm">
                  Codr uses passwordless signin. Please choose an option to sign
                  in with.
                </span>
                <Button
                  primary
                  className="mt-4"
                  type="submit"
                  name="method"
                  value="code"
                >
                  Email code
                </Button>
                <div className="relative my-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">Or</span>
                  </div>
                </div>
                <Button primary onClick={() => setStage(SignupStage.WebAuthN)}>
                  Security key
                </Button>
              </>
            )}
            {stage === SignupStage.Code && <CodeFlow />}
            {stage !== SignupStage.Init && (
              <>
                <hr className="w-full border-t border-gray-200 my-6" />
                <Button
                  className="mt-8"
                  type={stage !== SignupStage.Choose ? undefined : "submit"}
                  name="method"
                  value={
                    stage === SignupStage.Choose
                      ? "profile:back"
                      : "credential-selection"
                  }
                  onClick={
                    stage === SignupStage.WebAuthN || stage === SignupStage.Code
                      ? event => {
                          // Prevent all native handlers
                          event.stopPropagation();
                          event.preventDefault();
                          setStage(SignupStage.Choose);
                        }
                      : undefined
                  }
                >
                  Back
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </Page>
  );
}

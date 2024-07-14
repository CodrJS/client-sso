"use client";
import type {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  UiNodeScriptAttributes,
  VerificationFlow,
} from "@ory/client";
import { FlowScript } from "./FlowScript";
import FlowInput from "./FlowInput";
import FlowImage from "./FlowImage";
import FlowText from "./FlowText";

export default function Flow({
  flow,
  only,
  isLoading = false,
}: {
  flow?:
    | LoginFlow
    | RegistrationFlow
    | SettingsFlow
    | VerificationFlow
    | RecoveryFlow;
  only?:
    | "link"
    | "code"
    | "password"
    | "oidc"
    | "profile"
    | "totp"
    | "lookup_secret"
    | "webauthn";
  isLoading: boolean;
}) {
  // filter out nodes
  const filterNodes = (): Array<UiNode> => {
    if (!flow) return [];
    return flow.ui.nodes.filter(({ group }) => {
      if (!only) return true;
      return group === "default" || group === only;
    });
  };

  return filterNodes().map((node, k) => {
    switch (node.type) {
      case "input":
        return (
          <FlowInput
            key={`${node.meta.label?.id || node.type}`}
            node={node}
            isLoading={isLoading}
          />
        );
      case "script":
        return (
          <FlowScript attributes={node.attributes as UiNodeScriptAttributes} />
        );
      case "img":
        return <FlowImage node={node} />;
      case "text":
        return <FlowText node={node} />;
    }
  });
}

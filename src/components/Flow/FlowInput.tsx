import { UiNode, UiNodeInputAttributes } from "@ory/client";
import Button from "../Button";
import Input from "../Input";
import { useMemo } from "react";

export default function FlowInput({
  node,
  isLoading,
}: {
  node: UiNode;
  isLoading: boolean;
}) {
  const attr = useMemo(() => {
    return node.attributes as UiNodeInputAttributes;
  }, [node]);

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attr.onclick) {
      const run = new Function(attr.onclick);
      run();
    }
  };

  switch (attr.type) {
    case "button":
    case "submit":
      return (
        <Button
          primary
          className="mt-4"
          type={attr.type}
          name={attr.name}
          value={attr.value}
          onClick={onClick}
          disabled={isLoading || attr.disabled}
        >
          {node.meta.label?.text}
        </Button>
      );
    default:
      return (
        <Input
          disabled={isLoading || attr.disabled}
          autoComplete={attr.autocomplete}
          label={node.meta.label?.text}
          placeholder={node.meta.label?.text}
          name={attr.name}
          value={attr.value}
          pattern={attr.pattern}
          type={attr.type}
          onClick={onClick}
          required={attr.required}
        />
      );
  }
}

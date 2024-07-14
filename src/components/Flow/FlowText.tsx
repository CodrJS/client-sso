import { UiNode, UiNodeTextAttributes } from "@ory/client";
import { useMemo } from "react";

export default function FlowText({ node }: { node: UiNode }) {
  const { attr, meta } = useMemo(() => {
    return { attr: node.attributes as UiNodeTextAttributes, meta: node.meta };
  }, [node]);

  return (
    <div>
      <div>{meta.label?.text}</div>
      <div>{attr.text.text}</div>
    </div>
  );
}

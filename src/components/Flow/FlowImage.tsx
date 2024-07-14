import { UiNode, UiNodeImageAttributes } from "@ory/client";
import { useMemo } from "react";
import Image from "next/image";

export default function FlowImage({ node }: { node: UiNode }) {
  const attr = useMemo(() => {
    return node.attributes as UiNodeImageAttributes;
  }, [node]);

  return (
    attr.src && (
      <div className="flex w-full justify-center">
        <Image
          width={attr.width}
          height={attr.height}
          src={attr.src}
          id={attr.id}
          alt="TOTP QR Code"
        />
      </div>
    )
  );
}

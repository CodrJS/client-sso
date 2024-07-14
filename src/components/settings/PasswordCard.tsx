import type {
  SettingsFlow,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
} from "@ory/client";
import useFormHandler from "@/utils/hooks/useFormHandler";
import Input from "../Input";
import Button from "../Button";
import { useMemo } from "react";

export default function ChangePasswordCard({
  flow,
  onSubmit,
}: {
  flow?: SettingsFlow;
  onSubmit: (values: UpdateSettingsFlowBody) => Promise<void>;
}) {
  const { isLoading, handleSubmit } = useFormHandler<UpdateSettingsFlowBody>();

  const csfrAttributes = useMemo(() => {
    if (flow?.ui) {
      const csfr = flow.ui.nodes
        .filter(n => n.attributes.node_type === "input")
        .find(
          n => (n.attributes as UiNodeInputAttributes).name === "csrf_token",
        )?.attributes as UiNodeInputAttributes;
      return csfr;
    }
  }, [flow?.ui]);

  return (
    <form
      action={flow?.ui.action}
      method={flow?.ui.method}
      onSubmit={e => handleSubmit(e, onSubmit)}
      className="flex flex-col w-full bg-white border rounded-lg px-6 pt-4 pb-6 md:flex-row"
    >
      <div className="min-w-48 max-w-64 my-2 font-medium grow">
        Change Password
      </div>
      <div className="flex flex-col grow">
        <div className="min-w-96 self-center">
          {/* @ts-ignore */}
          <Input {...csfrAttributes} type="hidden" />
          <Input
            label="New password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="New password"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
          />
          <Button
            primary
            className="mt-4"
            type="submit"
            name="method"
            value="password"
            disabled={isLoading}
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

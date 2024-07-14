import type { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import useFormHandler from "@/utils/hooks/useFormHandler";
import Flow from "../Flow";

export default function RecoveryCodeCard({
  flow,
  onSubmit,
}: {
  flow?: SettingsFlow;
  onSubmit: (values: UpdateSettingsFlowBody) => Promise<void>;
}) {
  const { isLoading, handleSubmit } = useFormHandler<UpdateSettingsFlowBody>();

  return (
    <form
      action={flow?.ui.action}
      method={flow?.ui.method}
      onSubmit={e => handleSubmit(e, onSubmit)}
      className="flex flex-col w-full bg-white border rounded-lg px-6 pt-4 pb-6 md:flex-row"
    >
      <div className="min-w-48 max-w-64 my-2 font-medium grow">
        Recovery Codes
      </div>
      <div className="flex flex-col grow">
        <div className="min-w-96 self-center">
          <Flow flow={flow} only="lookup_secret" isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
}

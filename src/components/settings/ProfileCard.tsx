import type {
  SettingsFlow,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
} from "@ory/client";
import useFormHandler from "@/utils/hooks/useFormHandler";
import Button from "../Button";
import Input from "../Input";
import { useMemo } from "react";

export default function ProfileCard({
  flow,
  onSubmit,
}: {
  flow?: SettingsFlow;
  onSubmit: (values: UpdateSettingsFlowBody) => Promise<void>;
}) {
  const { isLoading, handleSubmit } = useFormHandler<UpdateSettingsFlowBody>();

  function findAttributes(name: string) {
    if (flow?.ui) {
      const attributes = flow.ui.nodes
        .filter(n => n.attributes.node_type === "input")
        .find(n => (n.attributes as UiNodeInputAttributes).name === name)
        ?.attributes as UiNodeInputAttributes;
      return attributes;
    }
  }

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
      <div className="min-w-48 max-w-64 my-2 font-medium grow">Profile</div>

      <div className="flex flex-col grow">
        <div className="min-w-96 self-center">
          {/* <div className="col-span-full flex items-center gap-x-8">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
              className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            />
            <div>
              <Button className="font-normal">Change picture</Button>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                JPG or PNG. 5MB max.
              </p>
            </div>
          </div> */}
          <Input
            type="email"
            name="traits.email"
            autoComplete="email"
            label="Email address"
            placeholder="Email address"
            disabled={isLoading}
            value={flow?.ui && findAttributes("traits.email")?.value}
            required
          />
          {/* <div className="flex gap-4">
            <Input
              type="text"
              name="traits.name.first"
              autoComplete="given-name"
              label="First name"
              placeholder="First name"
              disabled={isLoading}
              required
              className="grow"
              value={flow?.ui && findAttributes("traits.name.first")?.value}
            />
            <Input
              type="text"
              name="traits.name.last"
              autoComplete="family-name"
              label="Last name"
              placeholder="Last name"
              disabled={isLoading}
              required
              className="grow"
              value={flow?.ui && findAttributes("traits.name.last")?.value}
            />
          </div>
          <Input
            type="text"
            name="traits.name.preferred"
            autoComplete="nickname"
            label="Preferred name"
            placeholder="Preferred name"
            disabled={isLoading}
            value={flow?.ui && findAttributes("traits.name.preferred")?.value}
          /> */}
          {/* @ts-ignore */}
          <Input {...csfrAttributes} type="hidden" />
          <Button
            primary
            className="mt-4"
            type="submit"
            name="method"
            value="profile"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

import classNames from "@/utils/classNames";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";

export default function Button({
  children,
  icon: Icon,
  className,
  primary,
  link,
  center = true,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    icon?: React.ReactNode;
    primary?: boolean;
    center?: boolean;
    link?: boolean;
  }
>) {
  return (
    <button
      className={classNames(
        "flex w-full gap-3 items-center text-sm ring-inset focus-visible:ring-transparent",
        link ? "text-primary-500 ring-0" : "px-3 py-2 rounded-md ring-1",
        !link &&
          (primary
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"),
        center && "justify-center",
        className,
      )}
      {...props}
    >
      {true && Icon}
      <span className="text-sm font-medium leading-6">{children}</span>
    </button>
  );
}

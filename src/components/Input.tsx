import classNames from "@/utils/classNames";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
} from "react";

export default function Input({
  name,
  type,
  label,
  className,
  children,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  PropsWithChildren<{ label?: string }>) {
  return type === "hidden" ? (
    <input className="hidden" type={type} name={name} {...props} />
  ) : (
    <div className={classNames("my-2", className)}>
      <span className="flex gap-4 justify-between items-center">
        {label ? (
          <label
            htmlFor={name}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
        ) : null}
        {children}
      </span>
      <div className="mt-2">
        <input
          type={type}
          name={name}
          {...props}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
          )}
        />
      </div>
    </div>
  );
}

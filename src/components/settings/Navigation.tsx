"use client";
import classNames from "@/utils/classNames";
import {
  FingerPrintIcon,
  KeyIcon,
  QrCodeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const navigation = [
  { name: "General", href: "/settings", icon: UserCircleIcon },
  // {
  //   name: "Password",
  //   href: "/settings/password",
  //   icon: KeyIcon,
  // },
  {
    name: "Passkeys",
    href: "/settings/passkeys",
    icon: FingerPrintIcon,
  },
  {
    name: "Authenticator",
    href: "/settings/authenticator",
    icon: QrCodeIcon,
  },
];

export default function SettingsNavigation() {
  const pathname = usePathname();
  const params = useSearchParams();
  const flowId = params.get("flow");

  function isCurrent(href: string) {
    return pathname === href;
  }

  return (
    <nav
      className="flex flex-1 flex-col gap-4 min-w-48 max-w-48 stick top-16"
      aria-label="Settings navigation"
    >
      <span className="text-lg font-medium">Settings</span>
      <ul role="list" className="-mx-2 space-y-1">
        {navigation.map(item => (
          <li key={item.name}>
            <Link
              // pass along the flowId if the settings page has one.
              href={`${item.href}${!!flowId ? `?flow=${flowId}` : ""}`}
              className={classNames(
                isCurrent(item.href)
                  ? "bg-gray-50 text-primary-600"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
              )}
            >
              <item.icon
                className={classNames(
                  isCurrent(item.href)
                    ? "text-primary-600"
                    : "text-gray-400 group-hover:text-primary-600",
                  "h-6 w-6 shrink-0",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

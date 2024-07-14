"use client";
import { useMemo } from "react";
import { useSession } from "@/contexts/SessionContext";
import classNames from "@/utils/classNames";

export default function MyIdCard() {
  const { session } = useSession();
  const emailVerified = useMemo(() => {
    return session?.identity?.verifiable_addresses?.find(
      e => e.value === session.identity?.traits.email,
    )?.verified
      ? true
      : false;
  }, [session]);
  const mfaEnabled = useMemo(() => {
    return session?.authentication_methods
      ?.map(m => {
        return m.method;
      })
      .filter(Boolean)
      .filter(m => ["totp", "webauthn", "lookup_secret"].includes(String(m)))
      .length || 0 > 1
      ? true
      : false;
  }, [session]);

  return (
    <div className="min-w-96 bg-white border rounded p-4 flex gap-4">
      {/* <div className="size-20 bg-primary-600 rounded">Image</div> */}
      <div className="flex flex-col gap-1">
        {/* <div className="text-paper-950">
          {session?.identity?.traits?.name?.last},{" "}
          {session?.identity?.traits.name.first}
        </div> */}
        <div className="text-paper-600 text-sm flex gap-2">
          <span>{session?.identity?.traits.email}</span>
          <span
            className={classNames(
              "text-sm px-2 rounded",
              emailVerified
                ? "bg-emerald-200 text-emerald-950"
                : "bg-red-200 text-red-950",
            )}
          >
            {emailVerified ? "Verified" : "Unverified"}
          </span>
        </div>
        <div className="text-paper-600 text-sm flex gap-2">
          <span>MFA:</span>
          <span
            className={classNames(
              "text-sm px-2 rounded",
              mfaEnabled
                ? "bg-emerald-200 text-emerald-950"
                : "bg-red-200 text-red-950",
            )}
          >
            {mfaEnabled ? "Enabled" : "Not enabled"}
          </span>
        </div>
      </div>
    </div>
  );
}

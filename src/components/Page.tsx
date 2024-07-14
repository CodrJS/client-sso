import { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {
  return (
    <main className="w-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6 flex flex-col gap-4 grow bg-paper-50">
      {children}
    </main>
  );
}

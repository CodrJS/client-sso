"use client";

import Page from "@/components/Page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Page>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </Page>
      </body>
    </html>
  );
}

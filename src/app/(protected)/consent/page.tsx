"use client";
import Button from "@/components/Button";
import Page from "@/components/Page";
import { useConsentFlow } from "@/contexts/ConsentFlowContext";

export default function LogoutPage() {
  const [consent] = useConsentFlow();

  return (
    consent && (
      <Page>
        <div className="flex flex-col justify-center content-center items-center grow">
          <div className="flex flex-col w-full max-w-96 bg-white border rounded-lg px-6 py-8">
            {/* image={consent?.client?.logo_uri} */}
            {consent.client?.client_name ||
              consent.client?.client_id ||
              "Unknown Client"}
            <form action="consent" method="post">
              {/* <input type="hidden" name="_csrf" value={csrfToken} /> */}
              <input
                type="hidden"
                name="consent_challenge"
                value={consent.challenge}
              />
              <div className="grid gap-4">
                <div className="gap-2 mb-4">
                  The application requests access to the following permissions:
                </div>
                <div className="gap-2">
                  {(consent.requested_scope || []).map(scope => (
                    <div key={scope}>
                      <input type="checkcox" value={scope} name="grant_scope" />
                      {scope}
                    </div>
                  ))}
                </div>
                <div className="gap-2">
                  Only grant permissions if you trust this site or app. You do
                  not need to accept all permissions.
                </div>
                <div className="flex flex-row">
                  {consent.client?.policy_uri && (
                    <a
                      href={consent.client.policy_uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs"
                    >
                      Privacy Policy
                    </a>
                  )}
                  {consent.client?.tos_uri && (
                    <a
                      href={consent.client.tos_uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs"
                    >
                      Terms of Service
                    </a>
                  )}
                </div>
                <hr />
                <div className="gap-3">
                  <div>
                    <input type="checkcox" name="remember" id="remember" />
                    {"remember my decision."}
                  </div>
                  <p className="text-xs">
                    Remember this decision for next time. The application will
                    not be able to ask for additional permissions without your
                    consent.
                  </p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <Button
                    type="submit"
                    id="reject"
                    name="consent_action"
                    value="reject"
                  >
                    Deny
                  </Button>
                  <Button
                    type="submit"
                    id="accept"
                    name="consent_action"
                    value="accept"
                    primary
                  >
                    Allow
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Page>
    )
  );
}

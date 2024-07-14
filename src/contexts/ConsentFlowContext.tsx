"use client";
import createCtx from "@/utils/createCtx";
import { OryOAuth2 } from "@/utils/ory/client";
import { extractSession, shouldSkipConsent } from "@/utils/ory/consent";
import type { OAuth2ConsentRequest } from "@ory/client";
import type { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { useSession } from "./SessionContext";

// create the context and provider with the custom createCtx utility.
type ConsentFlowCtxType = [
  OAuth2ConsentRequest | undefined,
  Dispatch<SetStateAction<OAuth2ConsentRequest | undefined>>,
];

const [useContext, Provider] = createCtx<ConsentFlowCtxType>("constentFlow");

export const ConsentFlowProvider = function ConsentFlowProvider({
  children,
}: PropsWithChildren) {
  const query = useSearchParams();
  const router = useRouter();
  const { session } = useSession();
  const [challenge, setChallenge] = useState<OAuth2ConsentRequest>();

  const challengeQuery = query.get("consent_challenge");

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (challenge) return;

    OryOAuth2.getOAuth2ConsentRequest({
      consentChallenge: String(challengeQuery),
    })
      .then(async ({ data, request: req }) => {
        console.log(req.csrfToken);
        if (shouldSkipConsent(data)) {
          let grantScope = data.requested_scope || [];
          const authSession = extractSession(grantScope, session?.identity);

          await OryOAuth2.acceptOAuth2ConsentRequest({
            consentChallenge: String(challengeQuery),
            acceptOAuth2ConsentRequest: {
              grant_scope: grantScope,
              // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
              grant_access_token_audience: data.requested_access_token_audience,
              // The session allows us to set session data for id and access tokens
              session: authSession,
            },
          }).then(({ data: body }) => {
            console.debug("Consent request successfuly accepted");
            // All we need to do now is to redirect the user back to hydra!
            router.push(String(body.redirect_to));
          });

          return;
        }
        setChallenge(data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          case 410:
            // The error id expired. Let's just redirect home!
            return router.push("/");
        }

        return Promise.reject(err);
      });
  }, [challenge, router, challengeQuery, session?.identity]);

  // return provider with context return type.
  return <Provider value={[challenge, setChallenge]}>{children}</Provider>;
};

// setup file exports.
const ConsentFlowContext = {
  useConsentFlow: useContext,
  ConsentFlowProvider: Provider,
};

export default ConsentFlowContext;
export const useConsentFlow = useContext;

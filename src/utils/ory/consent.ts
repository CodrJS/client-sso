import type {
  AcceptOAuth2ConsentRequestSession,
  Identity,
  OAuth2ConsentRequest,
} from "@ory/client";

export const shouldSkipConsent = (challenge: OAuth2ConsentRequest) => {
  let trustedClients: string[] = [];
  if (process.env.TRUSTED_CLIENT_IDS) {
    trustedClients = String(process.env.TRUSTED_CLIENT_IDS).split(",");
  }
  return challenge.skip ||
    challenge.client?.skip_consent ||
    (challenge.client?.client_id &&
      trustedClients.indexOf(challenge.client?.client_id) > -1)
    ? true
    : false;
};

export const extractSession = (
  grantScope: string[],
  identity?: Identity,
): AcceptOAuth2ConsentRequestSession => {
  const session: AcceptOAuth2ConsentRequestSession = {
    access_token: {},
    id_token: {},
  };

  if (!identity) {
    return session;
  }

  if (grantScope.includes("email")) {
    const addresses = identity.verifiable_addresses || [];
    if (addresses.length > 0) {
      const address = addresses[0];
      if (address.via === "email") {
        session.id_token.email = address.value;
        session.id_token.email_verified = address.verified;
      }
    }
  }

  if (grantScope.includes("profile")) {
    if (identity.traits.username) {
      session.id_token.username = identity.traits.username;
    }

    if (identity.traits.picture) {
      session.id_token.picture = identity.traits.picture;
    }

    if (typeof identity.traits.name === "object") {
      if (identity.traits.name.first) {
        session.id_token.given_name = identity.traits.name.first;
      }
      if (identity.traits.name.last) {
        session.id_token.family_name = identity.traits.name.last;
      }
      if (identity.traits.name.preferred) {
        session.id_token.preferred_name = identity.traits.name.preferred;
      }
    } else if (typeof identity.traits.name === "string") {
      session.id_token.name = identity.traits.name;
    }

    if (identity.updated_at) {
      session.id_token.updated_at = Date.parse(identity.updated_at);
    }
  }
  return session;
};

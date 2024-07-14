import { Configuration, FrontendApi, OAuth2Api } from "@ory/client";

const idpConfig = {
  basePath: process.env.NEXT_PUBLIC_IDP_URL,
  baseOptions: {
    withCredentials: true,
  },
};

const oauth2Config = {
  basePath: process.env.NEXT_PUBLIC_AUTH_URL,
  baseOptions: {
    withCredentials: true,
  },
};

const connectConfig = {
  basePath: process.env.NEXT_PUBLIC_CONNECT_URL,
};

export const OryClient = new FrontendApi(new Configuration(idpConfig));
// const ConnectClient = new PublicApi(new Configuration(connectConfig));
export const OryOAuth2 = new OAuth2Api(new Configuration(oauth2Config));

const Ory = { OryClient, OryOAuth2 };
export default Ory;

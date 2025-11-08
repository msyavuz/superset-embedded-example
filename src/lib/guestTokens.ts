import { createServerFn } from "@tanstack/react-start";
import { auth, fetchGuestToken } from "./utils";

export function buildGuestTokenPayload(embedId: string) {
  return {
    resources: [
      {
        type: "dashboard",
        id: embedId,
      },
    ],
    rls: [],
    user: {
      username: "guest",
      first_name: "Guest",
      last_name: "User",
    },
  };
}

export const guestTokenFn = createServerFn()
  .inputValidator(
    (data: {
      domain: string;
      username: string;
      password: string;
      embedId: string;
    }) => data,
  )
  .handler(async ({ data: { domain, password, username, embedId } }) => {
    const { authHeaders } = await auth(
      `${domain}/api/v1/security/login`,
      username,
      password,
    );
    const guestToken = await fetchGuestToken(
      `${domain}/api/v1/security/guest_token`,
      buildGuestTokenPayload(embedId),
      authHeaders,
    );

    return guestToken;
  });

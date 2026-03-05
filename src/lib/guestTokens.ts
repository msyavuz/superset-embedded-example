import { createServerFn } from "@tanstack/react-start";
import { auth, fetchGuestToken } from "./utils";

export function buildGuestTokenPayload(embedId: string) {
	// Parse embedId - it might be a UUID or a number
	const dashboardId = embedId.includes("-")
		? embedId
		: parseInt(embedId, 10) || embedId;

	return {
		resources: [
			{
				type: "dashboard",
				id: dashboardId,
			},
		],
		rls: [{ clause: "channel_name = 'general'" }],
		user: {
			username: "test_user",
			first_name: "test",
			last_name: "user",
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
		try {
			// Ensure domain is a valid URL
			let apiUrl = domain;
			if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
				apiUrl = `http://${apiUrl}`;
			}

			console.log("Using API URL:", apiUrl);

			const { authHeaders } = await auth(
				`${apiUrl}/api/v1/security/login`,
				username,
				password,
			);
			const guestToken = await fetchGuestToken(
				`${apiUrl}/api/v1/security/guest_token/`,
				buildGuestTokenPayload(embedId),
				authHeaders,
			);

			return guestToken;
		} catch (error: any) {
			console.error("Guest token generation failed:", error);
			throw new Error(
				`Authentication failed: ${error.message || "Unknown error"}`,
			);
		}
	});

import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri =
    process.env.DECAP_OAUTH_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/decap-callback`;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "GitHub OAuth is not configured." },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}

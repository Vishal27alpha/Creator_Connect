/*import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!;
    const appSecret = process.env.INSTAGRAM_APP_SECRET!;
    const redirectUri = "http://localhost:3000/api/auth/callback/instagram";

    // -------------------
    // Step 1: Exchange code for short-lived token
    // -------------------
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    console.log("🔑 Token Response:", tokenData);

    if (!tokenData.access_token) {
      return NextResponse.json({ error: tokenData }, { status: 400 });
    }
    const userAccessToken = tokenData.access_token;

    // -------------------
    // Step 2: Get the user’s Facebook User ID
    // -------------------
    const meRes = await fetch(
      `https://graph.facebook.com/me?fields=id&access_token=${userAccessToken}`
    );
    const meData = await meRes.json();
    console.log("👤 Facebook Me:", meData);

    if (!meData.id) {
      return NextResponse.json({ error: meData }, { status: 400 });
    }

    // -------------------
    // Step 3: Get Instagram account connected to that user
    // -------------------
    const accountsRes = await fetch(
      `https://graph.facebook.com/${meData.id}/accounts?fields=instagram_business_account{name,username,followers_count}&access_token=${userAccessToken}`
    );
    const accountsData = await accountsRes.json();
    console.log("📸 Instagram Accounts:", accountsData);

    return NextResponse.json({
      message: "Instagram connected successfully",
      instagram: accountsData,
    });
  } catch (err: any) {
    console.error("Instagram callback error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}*/
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!;
    const appSecret = process.env.INSTAGRAM_APP_SECRET!;
    const redirectUri = "http://localhost:3000/api/auth/callback/instagram";

    // 1) Exchange code -> short-lived user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        })
    );
    const tokenData = await tokenRes.json();

    console.log("👉 tokenData from Instagram OAuth:", tokenData);

    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.json(
        { step: "token", error: tokenData },
        { status: 400 }
      );
    }

    const userAccessToken = tokenData.access_token;

    // 2) Optional: verify scopes so we can warn the UI
    let warn = "";
    try {
      const appTokenRes = await fetch(
        `https://graph.facebook.com/oauth/access_token?` +
          new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            grant_type: "client_credentials",
          })
      );
      const appTokenData = await appTokenRes.json();
      const appToken = appTokenData.access_token;

      if (appToken) {
        const dbgRes = await fetch(
          `https://graph.facebook.com/debug_token?` +
            new URLSearchParams({
              input_token: userAccessToken,
              access_token: appToken,
            })
        );
        const dbg = await dbgRes.json();
        console.log("👉 debug_token result:", dbg);

        const scopes: string[] = dbg?.data?.scopes ?? [];
        const needed = ["pages_show_list", "instagram_basic"];
        const missing = needed.filter((s) => !scopes.includes(s));
        if (missing.length) warn = "missing_scopes";
      }
    } catch (err) {
      console.warn("⚠️ Debug token check failed:", err);
      // Don’t block redirect if debug fails
    }

    // 3) Redirect back to profile with token (and optional warn)
    const url = new URL("http://localhost:3000/profile");
    url.searchParams.set("token", userAccessToken);
    if (warn) url.searchParams.set("warn", warn);

    return NextResponse.redirect(url);

  } catch (err: any) {
    console.error("Instagram callback error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/*import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ username: data.username });
  } catch (err: any) {
    console.error("Fetch username error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}*/
/*import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("access_token");

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    // Get pages/accounts linked to the user
    const meRes = await fetch(
      `https://graph.facebook.com/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
    );
    const meData = await meRes.json();

    if (!meData.data || meData.data.length === 0) {
      return NextResponse.json({ error: "No Instagram account linked", raw: meData }, { status: 400 });
    }

    const instagramId = meData.data[0].instagram_business_account?.id;

    if (!instagramId) {
      return NextResponse.json({ error: "No Instagram business account found", raw: meData }, { status: 400 });
    }

    // Fetch username
    const igRes = await fetch(
      `https://graph.facebook.com/${instagramId}?fields=username&access_token=${accessToken}`
    );
    const igData = await igRes.json();

    return NextResponse.json({ username: igData.username, raw: igData });
  } catch (err: any) {
    console.error("Instagram username fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}*/
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  try {
    // Step 1: Get FB pages linked to user
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    const igAccount = pagesData?.data?.find(
      (p: any) => p.instagram_business_account
    )?.instagram_business_account?.id;

    if (!igAccount) {
      return NextResponse.json(
        { error: "No Instagram account linked", raw: pagesData },
        { status: 400 }
      );
    }

    // Step 2: Fetch Instagram user details
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${igAccount}?fields=username,followers_count,biography&access_token=${accessToken}`
    );
    const igData = await igRes.json();

    if (!igRes.ok) {
      return NextResponse.json({ error: igData }, { status: 400 });
    }

    return NextResponse.json(igData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


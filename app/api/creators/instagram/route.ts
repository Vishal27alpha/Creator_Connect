import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing Instagram access token" }, { status: 500 });
    }

    // Call Instagram Graph API
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count&access_token=${token}`
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

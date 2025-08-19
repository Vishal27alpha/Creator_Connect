import { NextResponse } from "next/server";

export async function GET() {
  const creators = [
    { id: 1, name: "Vishal", category: "Tech" },
    { id: 2, name: "Alice", category: "Fitness" },
    { id: 3, name: "Bob", category: "Travel" },
  ];

  return NextResponse.json(creators);
}

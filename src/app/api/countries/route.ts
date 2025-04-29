import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("transglobal");
    const countries = await db.collection("countries").find({}).toArray();

    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

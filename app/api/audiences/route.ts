import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const audienceResponse = await resend.audiences.list();

    if (audienceResponse.error) {
      return NextResponse.json({ error: audienceResponse.error.message }, { status: 500 });
    }

    return NextResponse.json(audienceResponse.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching audiences:", error);
    return NextResponse.json({ error: "Unable to fetch audiences" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const audienceId = process.env.RESEND_AUDIENCE_ID || "";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    const response = await resend.contacts.list({ audienceId });

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      let contacts = response.data.data;

      // Filter by subscription status
      if (status === "subscribed") {
        contacts = contacts.filter((contact) => !contact.unsubscribed);
      } else if (status === "unsubscribed") {
        contacts = contacts.filter((contact) => contact.unsubscribed);
      }

      // Filter by search term
      if (search) {
        contacts = contacts.filter(
          (contact) =>
            contact.email.toLowerCase().includes(search) ||
            contact.first_name?.toLowerCase().includes(search) ||
            contact.last_name?.toLowerCase().includes(search)
        );
      }

      return NextResponse.json(contacts);
    } else {
      console.error("Unexpected response structure:", response);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Error fetching contacts" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ids, ...updateData } = body;

    if (ids && Array.isArray(ids)) {
      // Bulk update
      const updatePromises = ids.map((contactId) =>
        resend.contacts.update({
          audienceId,
          id: contactId,
          ...updateData,
        })
      );

      await Promise.all(updatePromises);
      return NextResponse.json({ message: "Contacts updated successfully" });
    } else if (id) {
      // Single contact update
      const response = await resend.contacts.update({
        audienceId,
        id,
        ...updateData,
      });

      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating contact(s):", error);
    return NextResponse.json(
      { message: "Error updating contact(s)" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const response = await resend.contacts.create({
      audienceId,
      email,
      firstName,
      lastName,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: `Error creating contact: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (ids && Array.isArray(ids)) {
      // Bulk delete
      const deletePromises = ids.map((contactId) =>
        resend.contacts.remove({
          audienceId,
          id: contactId,
        })
      );

      await Promise.all(deletePromises);
      return NextResponse.json({ message: "Contacts deleted successfully" });
    } else if (id) {
      // Single contact delete
      await resend.contacts.remove({
        audienceId,
        id,
      });

      return NextResponse.json({ message: "Contact deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Contact ID is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting contact(s):", error);
    return NextResponse.json(
      { message: "Error deleting contact(s)" },
      { status: 500 }
    );
  }
}

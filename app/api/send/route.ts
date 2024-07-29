import { EmailTemplate } from "../../../components/EmailTemplate";
import { Resend } from "resend";
import groq from "groq";
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { emailAddress } = await request.json();

    const query = groq`*[_type == "emailSignUp"] | order(_updatedAt desc)[0]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      "emailSubject": emailDetails.subject,
      "emailPreview": emailDetails.preview,
      "emailBody": emailDetails.body,
    }`;

    const emailSignUp = await client.fetch(query);
    if (!emailSignUp) {
      return new Response(
        JSON.stringify({ error: "No email sign-up data found" }),
        { status: 404 }
      );
    }

    const subject = emailSignUp.emailSubject || "";
    const emailBody = emailSignUp.emailBody || [];
    const title = emailSignUp.title || "";
    const preview = emailSignUp.emailPreview || "";

    // Send confirmation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Matthew <hello@zephyrpixels.dev>",
      to: [emailAddress],
      subject: subject,
      react: EmailTemplate({ title, subject, content: emailBody, preview }),
      text: "This is a text version of the email.",
    });

    if (emailError) {
      return new Response(JSON.stringify({ error: emailError }), {
        status: 500,
      });
    }

    // Add contact to Resend
    try {
      await resend.contacts.create({
        email: emailAddress,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
        unsubscribed: false,
        firstName: "",
        lastName: "",
      });
    } catch (contactError) {
      console.error("Error adding contact to Resend:", contactError);
    }

    return new Response(
      JSON.stringify({
        message: "Subscription successful",
        emailData,
      })
    );
  } catch (error) {
    console.error("Error during subscription process:", error);
    return new Response(
      JSON.stringify({ error: "Oh no! Something went wrong" }),
      { status: 500 }
    );
  }
}

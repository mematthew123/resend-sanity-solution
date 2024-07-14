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

    // Send confirmation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Matthew <hello@zephyrpixels.dev>",
      to: [emailAddress],
      subject: subject,
      react: EmailTemplate({ title, subject, content: emailBody }),
      text: "This is a text version of the email.",
    });

    if (emailError) {
      return new Response(JSON.stringify({ error: emailError }), { status: 500 });
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

    // Create new document in Sanity
    const API_KEY = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
    const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;

    const sanityDoc = {
      _type: 'contacts',
      email: emailAddress,
      subscribedAt: new Date().toISOString()
    };

    const mutations = [{
      create: sanityDoc
    }];

    const sanityOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ mutations })
    };

    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`;

    const sanityResponse = await fetch(sanityUrl, sanityOptions);
    const sanityData = await sanityResponse.json();

    if (!sanityResponse.ok) {
      console.error("Error creating Sanity document:", sanityData);
    }

    return new Response(JSON.stringify({ 
      message: "Subscription successful", 
      emailData,
      sanityData
    }));
  } catch (error) {
    console.error("Error during subscription process:", error);
    return new Response(
      JSON.stringify({ error: "Oh no! Something went wrong" }),
      { status: 500 }
    );
  }
}
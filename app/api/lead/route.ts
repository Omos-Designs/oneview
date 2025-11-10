import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { sendEmail } from "@/libs/resend";
import { waitlistWelcomeEmail } from "@/libs/email-templates";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Here you can add your own logic
    // For instance, sending a welcome email (use the the sendEmail helper function from /libs/resend)
    // For instance, saving the lead in the database (uncomment the code below)

    const supabase = await createClient();
    await supabase.from("leads").insert({ email: body.email });

    // Send welcome email to new waitlist subscriber
    const emailTemplate = waitlistWelcomeEmail(body.email);

    try {
      await sendEmail({
        to: body.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
      console.log(`✅ Welcome email sent to ${body.email}`);
    } catch (emailError) {
      // Log error but don't fail the request - lead is still captured
      console.error(`❌ Failed to send welcome email to ${body.email}:`, emailError);
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

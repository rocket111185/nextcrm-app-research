import { getSession } from "@/lib/auth-server";
import resendHelper from "@/lib/resend";
import { NextResponse } from "next/server";

function buildFeedbackSubject(sourcePath: string) {
  return `New Feedback from: ${process.env.NEXT_PUBLIC_APP_URL}${sourcePath}`;
}

export async function POST(req: Request) {
  /*
  Resend.com function init - this is a helper function that will be used to send emails
  */
  let resend;
  try {
    resend = await resendHelper();
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Resend API key is not configured" },
      { status: 500 }
    );
  }
  
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }
  const body = await req.json();
  if (!body) {
    return new NextResponse("Missing body", { status: 400 });
  }
  const { feedback } = body;
  const normalizedFeedback =
    typeof feedback === "string" ? feedback.trim() : "";
  const sourcePath = body.context.pathname.replace(/\/$/, "") || "/";

  if (!normalizedFeedback) {
    return new NextResponse("Missing feedback", { status: 400 });
  }

  try {
    //Send mail via Resend to info@softbase.cz
    await resend.emails.send({
      from:
        process.env.NEXT_PUBLIC_APP_NAME + " <" + process.env.EMAIL_FROM + ">",
      to: "info@softbase.cz",
      subject: buildFeedbackSubject(sourcePath),
      text: normalizedFeedback,
    });
    return NextResponse.json({ message: "Feedback sent" }, { status: 200 });
  } catch (error) {
    console.log("[FEEDBACK_POST]", error);
    return NextResponse.json({ error: "Initial error" }, { status: 500 });
  }
}

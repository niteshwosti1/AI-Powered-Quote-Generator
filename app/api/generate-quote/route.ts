import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// Initialize clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Get form data from request
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      companyName,
      serviceType,
      projectDescription,
      budgetRange,
      timeline,
    } = body;

    // 2. Validate required fields
    if (!customerName || !customerEmail || !serviceType || !projectDescription) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Generate quote with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a professional quote generator for a web design and development agency.

A potential client has submitted the following project request:
- Name: ${customerName}
- Company: ${companyName || "Not provided"}
- Service Needed: ${serviceType}
- Project Description: ${projectDescription}
- Budget Range: ${budgetRange || "Not specified"}
- Timeline: ${timeline || "Not specified"}

Generate a professional, detailed quote email. Structure it exactly like this:

Subject: Your Custom Quote for ${serviceType} Project

Dear ${customerName},

Thank you for reaching out to us. We have carefully reviewed your project requirements and are pleased to present you with the following quote.

PROJECT SUMMARY
Write 2-3 sentences summarizing their project in professional language.

RECOMMENDED PACKAGE
Package Name: [Create an appropriate package name]
Package Description: [2-3 sentences about what this package includes]

SCOPE OF WORK
- [List 5-7 specific deliverables based on their project description]

INVESTMENT BREAKDOWN
- [Item 1]: $[amount]
- [Item 2]: $[amount]
- [Item 3]: $[amount]
- [Add more as needed]
Total Investment: $[total amount]

Note: Make pricing realistic and appropriate for the budget range they specified.

TIMELINE
Estimated Duration: [X weeks/months]
[Break down into 2-3 phases with timeframes]

WHY CHOOSE US
[Write 2-3 sentences about value proposition]

NEXT STEPS
To proceed with this project, simply reply to this email or schedule a free consultation call at your convenience.

This quote is valid for 30 days from the date of this email.

Best regards,
The Agency Team
support@agency.com

Important instructions:
- Be specific to their actual project description
- Make pricing realistic based on their budget range
- Keep tone professional but friendly
- Do not use markdown formatting like ** or ##
- Use plain text only
`;

    const result = await model.generateContent(prompt);
    const generatedQuote = result.response.text();

    // 4. Save to Supabase database
    const { error: dbError } = await supabase.from("quotes").insert({
      customer_name: customerName,
      customer_email: customerEmail,
      company_name: companyName || null,
      service_type: serviceType,
      project_description: projectDescription,
      budget_range: budgetRange || null,
      timeline: timeline || null,
      generated_quote: generatedQuote,
      status: "sent",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue even if DB fails — email is more important
    }

    // 5. Send email to customer
    await resend.emails.send({
      from: "onboarding@resend.dev", // Use this for testing
      to: customerEmail,
      subject: `Your Custom Quote for ${serviceType} Project`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <div style="background: #2563eb; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Quote is Ready!</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.8; color: #374151;">
${generatedQuote}
            </pre>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 13px;">
                This quote was generated automatically. Reply to this email with any questions.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // 6. Send notification to business owner
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "niteshwosti1@gmail.com", // Replace with your email
      subject: `New Quote Request from ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2>New Quote Request Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Name</td>
              <td style="padding: 12px 0;">${customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Email</td>
              <td style="padding: 12px 0;">${customerEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Company</td>
              <td style="padding: 12px 0;">${companyName || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Service</td>
              <td style="padding: 12px 0;">${serviceType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Budget</td>
              <td style="padding: 12px 0;">${budgetRange || "Not specified"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Timeline</td>
              <td style="padding: 12px 0;">${timeline || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Description</td>
              <td style="padding: 12px 0;">${projectDescription}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("Error generating quote:", error);
    return Response.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
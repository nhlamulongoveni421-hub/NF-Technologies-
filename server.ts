import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser
app.use(express.json());

// Initialize Gemini API client safely with lazy-checks
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY", // fallback to prevent startup crash
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// System instructions containing complete NF Technologies business pricing & details
const SYSTEM_INSTRUCTION = `
You are Mary, the friendly, professional, highly capable, and warm AI Receptionist and Business Consultant for NF Technologies.
Your voice style is human-like, engaging, and pleasant. Your primary role is to assist visitors, answer questions about our digital products and agency services, quote prices accurately, recommend optimal package options, and collect prospective client details for a direct consultation.

Company Name: NF Technologies
Tagline: Innovate • Automate • Elevate
Contact Details:
- WhatsApp or Call: 072 103 0264 (South Africa)
- Email: Nhlamulongoveni421@gmail.com
- LinkedIn: NF Technologies
- Facebook: NF Technologies
- Instagram: NF Technologies

Our 9 Core Pillars and Pricing:
1. Website Development:
   - Setup Fee: R2,500
   - Monthly Maintenance: R300/month
   - Note: Includes standard Google Business Profile registration (R1,000 value) for local SEO.
   - Angle: Every other service is easier to sell once you're the website person for a client.

2. AI Automation Agency:
   - AI Chatbot Setup: R1,500 (Monitoring R300/month)
   - AI Voice Agent Standalone Setup: R3,500 (No monthly)
   - WhatsApp Automation Setup: R1,500 (No monthly)
   - Angle: Never miss a customer lead again. Perfect for local salons, clinics, and restaurants.

3. Software (SaaS):
   - Setup Fee: R5,000
   - Monthly Subscription: R1,000/month per client
   - SaaS Product Ideas: AI Receptionist, WhatsApp Business CRM, Invoice & Quotation Generator, School Management System, Appointment Booking System, Restaurant Ordering System, Property Management Software.
   - Angle: Start by building one for a single client at full price, then re-sell the same core product to others.

4. Mobile App Development:
   - Setup Fee: R7,500
   - Monthly Maintenance: R500/month
   - App Ideas: Restaurant ordering, school, church, gym, delivery, booking apps.
   - Angle: Two revenue paths - bespoke client work or publishing owned apps for ad/subscription revenue.

5. Cybersecurity:
   - Setup Fee: R5,000
   - Monthly Monitoring: R1,000/month
   - Services: Security audits, vulnerability scanning, backup & recovery, email security, staff training, cloud/network review.
   - Angle: Clients rarely think about this until something breaks. Position as a mandatory add-on, not an upsell.

6. Digital Marketing Agency:
   - Setup Fee: R3,000
   - Ongoing management: R5,000/month
   - Services: Google Ads, Meta Ads (Facebook & Instagram), SEO, email marketing.
   - Angle: The highest-ticket recurring service - sell once the client trusts you from website/branding work.

7. Video Production & Content Creation:
   - Setup Fee: R5,000
   - Monthly Fee: R0 (One-off)
   - Services: One-off high-impact video package (8-12 custom edited short videos for Reels, TikToks, Shorts), scriptwriting, cinematic graphics.

8. Branding & Graphic Design:
   - Setup Fee: R5,000
   - Monthly Subscription: R2,500/month
   - Services: Full visual identity package, logo design, plus ongoing monthly graphic retainer assets (social banners, ad creatives, presentation templates) on retainer to keep visual identity polished.
   - Angle: Ultimate branding setup with a retainer to keep client marketing gorgeous month after month.

9. E-commerce:
   - Setup Fee: R10,000
   - Monthly Maintenance: R1,000/month
   - Services: Custom stores, local payment gateways (PayFast, Peach Payments, Stitch), courier shipping API integrations, cart recovery.

Financial Engine Highlights:
- Total possible setup revenue per fully-bundled client: R45,500
- Total possible monthly recurring revenue per fully-bundled client: R8,100

Guidelines for your responses:
- Speak in simple, clear, professional English. Keep answers conversational, succinct, and scannable.
- ALWAYS use South African Rands (R) as currency.
- If a customer is interested in any service or package, politely collect their details: Name, Email, Phone Number, and Business Name.
- Offer to schedule an official consultation or have an agent call them.
- NEVER invent or hallucinate other prices or services not listed here.
- If the customer asks for a service or feature out of scope, or a highly technical question you don't have instructions for, politely and warmly suggest they contact NF Technologies at 072 103 0264 or via email at Nhlamulongoveni421@gmail.com.
- Be extremely encouraging about recurring monthly value models!
- When responding to VOICE input, keep responses concise (1-2 sentences) so they sound like a natural conversation on a phone call.
`;

// Fast and robust local consultant matching engine fallback
function getLocalResponse(message: string, isVoice: boolean): string {
  const query = (message || "").toLowerCase().trim();

  // Greetings
  if (/hi|hello|hey|greetings|morning|afternoon|evening|hola|howzit/.test(query)) {
    if (isVoice) {
      return "Hello! I'm Mary, your AI business consultant at NF Technologies. How can I help you today?";
    }
    return "Hello! I'm Mary, your AI business consultant at NF Technologies. How can I help you innovate, automate, or elevate your business today?";
  }

  // Who are you
  if (/who are you|your name|what is this/.test(query)) {
    if (isVoice) {
      return "I am Mary, the AI Business Consultant for NF Technologies. I'm here to guide you through our digital services and modular packages.";
    }
    return "I am Mary, the AI Business Consultant for NF Technologies. I can help you understand our 9 core business pillars, pricing, and how they build high-margin recurring revenue models.";
  }

  // Website Development (Pillar 1)
  if (/web|site|website|page|online|seo/.test(query)) {
    if (isVoice) {
      return "Our Website Development package is R2,500 setup and R300 per month, including local Google SEO setup.";
    }
    return "Our Website Development starts at R2,500 setup and R300/month. It includes custom React development and complete Google Business Profile setup (R1,000 value) to drive organic local search leads.";
  }

  // AI Automation (Pillar 2)
  if (/automation|bot|chatbot|whatsapp|receptionist|voice agent/.test(query)) {
    if (isVoice) {
      return "We build interactive AI chatbots at R1,500 setup and custom voice agents for your phone lines starting at R3,500.";
    }
    return "We specialize in AI Automations: custom AI Chatbots at R1,500 setup (R300/mo monitoring), standalone AI Voice Agents at R3,500 setup, and custom WhatsApp Business workflows at R1,500 setup. These capture leads 24/7.";
  }

  // Software (SaaS) (Pillar 3)
  if (/saas|software|portal|crm|booking|invoice/.test(query)) {
    if (isVoice) {
      return "Custom Software or SaaS development has a setup fee of R5,000 and a monthly subscription of R1,000 per client.";
    }
    return "We build custom cloud Software and SaaS products: booking engines, quotation systems, CRMs, or school portals. Pricing starts at R5,000 setup and R1,000/month per user/client.";
  }

  // Mobile App (Pillar 4)
  if (/app|mobile|ios|android|phone/.test(query)) {
    if (isVoice) {
      return "Mobile apps on iOS and Android start at R7,500 setup and R500 per month for ongoing maintenance.";
    }
    return "We develop native-feel mobile apps on Android and iOS starting at R7,500 setup and R500/month maintenance. Ideal for ordering systems, delivery dispatch, gym, or church portals.";
  }

  // Cybersecurity (Pillar 5)
  if (/security|cyber|hack|backup|protect/.test(query)) {
    if (isVoice) {
      return "Our Cybersecurity package is R5,000 setup and R1,000 per month for active daily protection and backups.";
    }
    return "We secure your systems with active daily cloud backups, vulnerability scanning, spam defense, and multi-factor authentication starting at R5,000 setup and R1,000/month monitoring.";
  }

  // Digital Marketing (Pillar 6)
  if (/marketing|ads|google ads|meta|facebook/.test(query)) {
    if (isVoice) {
      return "Digital Marketing setup is R3,000, with ongoing ROI-driven campaign management at R5,000 per month.";
    }
    return "Our Digital Marketing covers Google Ads, Meta (Facebook & Instagram) campaigns, advanced keyword SEO, and monthly ROI reports starting at R3,000 setup and R5,000/month management.";
  }

  // Video Production (Pillar 7) -> ONE-OFF
  if (/video|reel|tiktok|shorts|editing|production|clip/.test(query)) {
    if (isVoice) {
      return "Video production is a high-impact one-off service at R5,000, delivering eight to twelve custom edited clips.";
    }
    return "Our Video Production is a high-fidelity ONE-OFF service at R5,000. It delivers 8–12 custom edited short clips (Reels, TikToks, Shorts) complete with copywriting, hooks, and automated scheduling.";
  }

  // Branding (Pillar 8) -> RECURRING
  if (/branding|brand|logo|graphic|design|flyer/.test(query)) {
    if (isVoice) {
      return "Branding setup is R5,000 with a monthly design retainer of R2,500 per month for ongoing graphics and banners.";
    }
    return "Our Branding & Graphic Design package starts at R5,000 setup and R2,500/month retainer. It covers full visual identity, corporate brand guide, and ongoing monthly graphic assets (slide decks, ad designs, banners).";
  }

  // E-Commerce (Pillar 9)
  if (/ecommerce|shop|store|checkout|payfast|peach/.test(query)) {
    if (isVoice) {
      return "Custom E-Commerce storefronts integrated with Peach or PayFast are R10,000 setup and R1,000 per month.";
    }
    return "We launch conversion-optimized E-Commerce storefronts integrated with local gateways (PayFast, Peach Payments, Stitch) and courier shipping APIs starting at R10,000 setup and R1,000/month.";
  }

  // Pricing / Cost / Bundle
  if (/price|cost|quote|fee|package|money|rand|rands|how much/.test(query)) {
    if (isVoice) {
      return "Our digital services start at R1,500 setup. The complete nine pillar ecosystem has a full setup value of R45,500.";
    }
    return "We offer 9 modular pillars starting from R1,500 setup. Our full ecosystem bundle totals R45,500 setup and R8,100/month in subscription. Leave your details here and we'll draft a bespoke package for you!";
  }

  // Consultation / Contact / Booking
  if (/book|call|schedule|consult|meeting|contact|phone|number/.test(query)) {
    if (isVoice) {
      return "You can call us directly on 072 103 0264, or leave your phone number here so we can ring you back.";
    }
    return "We would love to consult on your digital strategy! You can call or WhatsApp us on 072 103 0264, or email Nhlamulongoveni421@gmail.com. Alternatively, share your Name, Email, and Phone number here, and we'll schedule a direct call.";
  }

  // Thank you
  if (/thank|thanks|great|cool|awesome|bye|goodbye/.test(query)) {
    if (isVoice) {
      return "You're welcome! Let us know if you need any other assistance. Have an awesome day ahead.";
    }
    return "You're very welcome! Feel free to reach out to NF Technologies whenever you are ready to elevate your business. Have an amazing day!";
  }

  // Default Fallback
  if (isVoice) {
    return "I'm not fully sure I caught that. Could you ask about our website development, AI voice agents, branding, or marketing?";
  }
  return "That sounds exciting! NF Technologies specializes in Web development, AI Automations, SaaS, Apps, Cybersecurity, Digital Marketing, Video Production, Branding, and E-commerce. To help me serve you best, could you tell me more about your requirements or share your contact number for a quick call?";
}

// API Route for AI Chat / Consultation Helper
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, mode } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const isVoice = mode === "voice";
    const localAnswer = getLocalResponse(message, isVoice);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MOCK_KEY") {
      // Return instant local consultation response if no key is present to keep app fully functional and blazing fast
      return res.json({ text: localAnswer });
    }

    const ai = getGemini();

    // Map history to parts if provided
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + (isVoice ? "\nIMPORTANT: You are speaking in real-time VOICE mode. Keep your answers extremely brief, clear, and direct (maximum 1 to 2 short sentences), as if answering a phone call." : ""),
        temperature: 0.7,
      },
      history: history || []
    });

    // Run Gemini API with a timeout so user never waits forever for slow network responses
    const apiCallPromise = chat.sendMessage({ message });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4500));

    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    if (result && result.text) {
      res.json({ text: result.text });
    } else {
      console.warn("Gemini call timed out, failing over to local business consultation engine.");
      res.json({ text: localAnswer });
    }
  } catch (error: any) {
    console.error("Gemini API Error, falling back to local engine:", error);
    const isVoice = req.body.mode === "voice";
    const fallbackAnswer = getLocalResponse(req.body.message, isVoice);
    res.json({ text: fallbackAnswer });
  }
});

// Configure Vite middleware or static serving
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on port ${PORT}`);
  });
}

configureApp();

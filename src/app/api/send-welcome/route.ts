import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TRANSLATIONS: Record<string, {
  subject: string;
  greeting: string;
  intro: string;
  keypoints_title: string;
  keypoints: string[];
  stats_title: string;
  stats: { value: string; label: string }[];
  roi_title: string;
  roi_desc: string;
  roi_cta: string;
  demo_cta: string;
  footer: string;
}> = {
  en: {
    subject: "Welcome to NEXI — Your Personalized Demo Summary",
    greeting: "Hi {name},",
    intro: "Thank you for exploring NEXI, the next generation of hotel self-service kiosks by TrueOmni. Here's a summary of what you experienced:",
    keypoints_title: "What Makes NEXI Different",
    keypoints: [
      "Self Check-in & Check-out — Guests complete their stay in under 90 seconds",
      "16 Interactive Modules — Room service, wayfinding, events, upsells, AI concierge, and more",
      "Multi-Language Support — English, Spanish, French, Japanese built-in",
      "AI-Powered Avatar — HeyGen integration for natural guest interaction",
      "Fully Customizable — Hotels configure their brand, colors, and active modules via CMS",
      "TruePay Integration — Secure on-kiosk payment processing",
    ],
    stats_title: "NEXI by the Numbers",
    stats: [
      { value: "78", label: "Interactive Screens" },
      { value: "16", label: "Guest Modules" },
      { value: "4", label: "Languages" },
      { value: "<90s", label: "Avg Check-in Time" },
    ],
    roi_title: "Calculate Your ROI",
    roi_desc: "See how much NEXI can save your property in front desk costs, guest wait times, and upsell revenue.",
    roi_cta: "Open ROI Calculator",
    demo_cta: "Book a Live Demo",
    footer: "This email was sent because you explored the NEXI interactive demo. If you have questions, reply to this email or visit trueomni.com.",
  },
  es: {
    subject: "Bienvenido a NEXI — Resumen de Su Demo Personalizado",
    greeting: "Hola {name},",
    intro: "Gracias por explorar NEXI, la nueva generación de kioscos de autoservicio hotelero de TrueOmni. Aquí tiene un resumen de lo que experimentó:",
    keypoints_title: "Lo Que Hace Diferente a NEXI",
    keypoints: [
      "Check-in y Check-out Automático — Los huéspedes completan su estancia en menos de 90 segundos",
      "16 Módulos Interactivos — Servicio a la habitación, mapas, eventos, mejoras, conserje IA y más",
      "Soporte Multi-idioma — Inglés, español, francés y japonés integrados",
      "Avatar con IA — Integración con HeyGen para interacción natural",
      "Totalmente Personalizable — Los hoteles configuran su marca, colores y módulos activos vía CMS",
      "Integración TruePay — Procesamiento de pagos seguro en el kiosco",
    ],
    stats_title: "NEXI en Números",
    stats: [
      { value: "78", label: "Pantallas Interactivas" },
      { value: "16", label: "Módulos" },
      { value: "4", label: "Idiomas" },
      { value: "<90s", label: "Tiempo Promedio de Check-in" },
    ],
    roi_title: "Calcule Su ROI",
    roi_desc: "Vea cuánto puede ahorrar su propiedad en costos de recepción, tiempos de espera y ventas adicionales.",
    roi_cta: "Abrir Calculadora de ROI",
    demo_cta: "Agendar una Demo en Vivo",
    footer: "Este correo fue enviado porque usted exploró el demo interactivo de NEXI. Si tiene preguntas, responda a este correo o visite trueomni.com.",
  },
  fr: {
    subject: "Bienvenue chez NEXI — Résumé de Votre Démo Personnalisée",
    greeting: "Bonjour {name},",
    intro: "Merci d'avoir exploré NEXI, la nouvelle génération de bornes libre-service hôtelières de TrueOmni. Voici un résumé de votre expérience :",
    keypoints_title: "Ce Qui Rend NEXI Différent",
    keypoints: [
      "Check-in et Check-out Automatiques — Les clients finalisent leur séjour en moins de 90 secondes",
      "16 Modules Interactifs — Service en chambre, orientation, événements, surclassements, concierge IA et plus",
      "Support Multilingue — Anglais, espagnol, français et japonais intégrés",
      "Avatar IA — Intégration HeyGen pour une interaction naturelle",
      "Entièrement Personnalisable — Les hôtels configurent leur marque, couleurs et modules via CMS",
      "Intégration TruePay — Traitement des paiements sécurisé sur la borne",
    ],
    stats_title: "NEXI en Chiffres",
    stats: [
      { value: "78", label: "Écrans Interactifs" },
      { value: "16", label: "Modules" },
      { value: "4", label: "Langues" },
      { value: "<90s", label: "Temps Moyen d'Enregistrement" },
    ],
    roi_title: "Calculez Votre ROI",
    roi_desc: "Découvrez combien NEXI peut économiser pour votre établissement en coûts de réception et revenus additionnels.",
    roi_cta: "Ouvrir le Calculateur de ROI",
    demo_cta: "Réserver une Démo en Direct",
    footer: "Ce courriel a été envoyé car vous avez exploré la démo interactive NEXI. Pour toute question, répondez à ce courriel ou visitez trueomni.com.",
  },
  ja: {
    subject: "NEXIへようこそ — パーソナライズされたデモサマリー",
    greeting: "{name}様",
    intro: "TrueOmniの次世代ホテルセルフサービスキオスク、NEXIをご体験いただきありがとうございます。体験の概要をお送りします：",
    keypoints_title: "NEXIの特長",
    keypoints: [
      "セルフチェックイン＆チェックアウト — 90秒以内で完了",
      "16のインタラクティブモジュール — ルームサービス、案内、イベント、アップグレード、AIコンシェルジュなど",
      "多言語サポート — 英語、スペイン語、フランス語、日本語を内蔵",
      "AIアバター — HeyGen統合による自然なゲスト対応",
      "完全カスタマイズ可能 — ブランド、カラー、モジュールをCMSで設定",
      "TruePay統合 — キオスクでの安全な決済処理",
    ],
    stats_title: "NEXIの数字",
    stats: [
      { value: "78", label: "インタラクティブ画面" },
      { value: "16", label: "モジュール" },
      { value: "4", label: "言語" },
      { value: "<90秒", label: "平均チェックイン時間" },
    ],
    roi_title: "ROIを計算する",
    roi_desc: "NEXIがフロントデスクコスト、待ち時間、アップセル収益にどれだけ貢献できるかをご確認ください。",
    roi_cta: "ROI計算ツールを開く",
    demo_cta: "ライブデモを予約",
    footer: "このメールはNEXIインタラクティブデモをご体験いただいたため送信されました。ご質問がございましたら、このメールにご返信いただくか、trueomni.comをご覧ください。",
  },
};

function buildEmailHtml(content: typeof TRANSLATIONS.en, name: string): string {
  const firstName = name.split(" ")[0];
  const greeting = content.greeting.replace("{name}", firstName);
  const BASE = "https://nexi-prototype.vercel.app";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Hero Header — photo with text logos -->
    <div style="position:relative;overflow:hidden;max-height:200px;">
      <img src="${BASE}/images/email-hero.jpg" alt="" width="600" style="display:block;width:100%;height:auto;margin-top:-15%;" />
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.75) 100%);"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="position:absolute;top:0;left:0;right:0;bottom:0;"><tr><td align="center" valign="middle" style="padding:32px 40px;">
        <div style="font-size:32px;font-weight:800;color:#ffffff;letter-spacing:4px;font-family:'Helvetica Neue',Arial,sans-serif;">NEXI</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-top:4px;">Check in &middot; Check out</div>
        <div style="height:1px;width:40px;background:rgba(255,255,255,0.25);margin:12px auto;"></div>
        <div style="font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:1px;">Powered by</div>
        <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:0.5px;margin-top:2px;font-family:'Helvetica Neue',Arial,sans-serif;"><span style="color:#1288FF;">True</span>Omni</div>
      </td></tr></table>
    </div>

    <!-- Body — white background -->
    <div style="padding:40px;">
      <p style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">${greeting}</p>
      <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 32px;">${content.intro}</p>

      <!-- Keypoints -->
      <div style="margin-bottom:32px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1288FF;font-weight:700;margin-bottom:16px;">${content.keypoints_title}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${content.keypoints.map((kp) => `
          <tr>
            <td width="20" valign="top" style="padding:0 0 12px 0;"><div style="width:6px;height:6px;background:#1288FF;border-radius:50%;margin-top:7px;"></div></td>
            <td style="padding:0 0 12px 0;font-size:13px;color:#374151;line-height:1.5;">${kp}</td>
          </tr>`).join("")}
        </table>
      </div>

      <!-- Stats — Bento Cards -->
      <div style="margin-bottom:32px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1288FF;font-weight:700;margin-bottom:16px;text-align:center;">${content.stats_title}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
          ${content.stats.map((s) => `
            <td align="center" style="padding:0 4px;">
              <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:12px;padding:20px 8px;">
                <div style="font-size:28px;font-weight:800;color:#1a1a1a;line-height:1;">${s.value}</div>
                <div style="font-size:10px;color:#6b7280;margin-top:6px;text-transform:uppercase;letter-spacing:0.5px;">${s.label}</div>
              </div>
            </td>`).join("")}
          </tr>
        </table>
      </div>
    </div>

    <!-- ROI Calculator CTA — thin with photo background -->
    <div style="position:relative;overflow:hidden;max-height:160px;">
      <img src="${BASE}/images/email-roi-bg.jpg" alt="" width="600" style="display:block;width:100%;height:auto;margin-top:-20%;" />
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.75) 100%);"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="position:absolute;top:0;left:0;right:0;bottom:0;"><tr><td align="center" valign="middle" style="padding:20px 40px;">
        <div style="font-size:18px;font-weight:700;color:#ffffff;margin-bottom:6px;">${content.roi_title}</div>
        <p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0 0 14px;line-height:1.4;">${content.roi_desc}</p>
        <a href="https://trueomni.com/nexi-calculator" style="display:inline-block;padding:10px 28px;background:#1288FF;color:#ffffff;text-decoration:none;border-radius:9999px;font-size:13px;font-weight:700;">
          ${content.roi_cta} &rarr;
        </a>
      </td></tr></table>
    </div>

    <!-- Product Showcase — two columns -->
    <div style="padding:32px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" valign="top" style="padding-right:16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1288FF;font-weight:700;margin-bottom:12px;">Complete Ecosystem</div>
            <div style="font-size:16px;font-weight:700;color:#1a1a1a;margin-bottom:12px;line-height:1.3;">Everything Your Hotel Needs, In One Platform</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">Self-service kiosks (portrait &amp; landscape)</span></td></tr>
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">Digital signage &amp; wayfinding displays</span></td></tr>
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">Mobile guest experience app</span></td></tr>
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">Centralized CMS for all devices</span></td></tr>
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">AI-powered guest interactions</span></td></tr>
              <tr><td style="padding:0 0 8px 0;"><span style="color:#1288FF;margin-right:8px;">&bull;</span><span style="font-size:12px;color:#374151;">Integrated payment processing</span></td></tr>
            </table>
            <a href="https://trueomni.com/book_a_demo/" style="display:inline-block;padding:10px 24px;background:#1288FF;color:#ffffff;text-decoration:none;border-radius:9999px;font-size:12px;font-weight:700;">
              ${content.demo_cta} &rarr;
            </a>
          </td>
          <td width="50%" valign="middle" style="padding-left:16px;">
            <img src="${BASE}/images/email-products.jpg" alt="TrueOmni Product Ecosystem" width="240" style="display:block;width:100%;height:auto;border-radius:8px;" />
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:11px;color:#9ca3af;line-height:1.5;margin:0 0 6px;">${content.footer}</p>
      <p style="font-size:11px;color:#9ca3af;margin:0;">TrueOmni Inc. &middot; <a href="https://trueomni.com" style="color:#1288FF;text-decoration:none;">trueomni.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, hotel, rooms, title, locale = "en" } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lang = (locale in TRANSLATIONS) ? locale : "en";
    const content = TRANSLATIONS[lang];
    const html = buildEmailHtml(content, name);

    const { data, error } = await resend.emails.send({
      from: "NEXI by TrueOmni <onboarding@resend.dev>",
      to: [email],
      subject: content.subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send welcome error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

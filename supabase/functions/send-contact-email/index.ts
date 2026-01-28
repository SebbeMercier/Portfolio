
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_API_SECRET = Deno.env.get('MAILJET_API_SECRET')
const MAILJET_FROM_EMAIL = Deno.env.get('MAILJET_FROM_EMAIL') || 'info@sebbe-mercier.tech'
const MAILJET_ADMIN_EMAIL = Deno.env.get('MAILJET_ADMIN_EMAIL') || 'sebbemercier@gmail.com'
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOCALES = {
    fr: {
        adminTitle: "Nouveau Message Portfolio",
        adminIntro: "Tu as reçu un nouveau message depuis ton formulaire de contact.",
        labelName: "NOM",
        labelEmail: "EMAIL",
        labelSubject: "SUJET",
        labelMessage: "MESSAGE",
        adminFooter: "Ce message a été envoyé depuis ton portfolio.",

        autoReplySubject: "Merci pour votre message ! ✨",
        autoReplyGreeting: "Bonjour {{NAME}} !",
        autoReplyTitle: "J'ai bien reçu votre message.",
        autoReplyContacted: "Merci de m'avoir contacté concernant \"{{SUBJECT}}\". C'est un plaisir de vous lire !",
        autoReplyStudy: "Je vais prendre le temps de lire votre demande avec attention et je reviendrai vers vous dans les plus brefs délais.",
        autoReplyRole: "Développeur Fullstack & Creative Coder",
        autoReplyButton: "Visiter mon portfolio",
        autoReplyFooter: "© 2026 Sebbe Mercier. Tous droits réservés.<br/>Ceci est une réponse automatique de confirmation."
    },
    en: {
        adminTitle: "New Portfolio Message",
        adminIntro: "You have received a new message from your contact form.",
        labelName: "NAME",
        labelEmail: "EMAIL",
        labelSubject: "SUBJECT",
        labelMessage: "MESSAGE",
        adminFooter: "This message was sent from your portfolio.",

        autoReplySubject: "Thank you for your message! ✨",
        autoReplyGreeting: "Hello {{NAME}}!",
        autoReplyTitle: "I have received your message.",
        autoReplyContacted: "Thank you for contacting me regarding \"{{SUBJECT}}\". It's a pleasure to read from you!",
        autoReplyStudy: "I will take the time to read your request carefully and I will get back to you as soon as possible.",
        autoReplyRole: "Fullstack Developer & Creative Coder",
        autoReplyButton: "Visit my portfolio",
        autoReplyFooter: "© 2026 Sebbe Mercier. All rights reserved.<br/>This is an automatic confirmation response."
    },
    nl: {
        adminTitle: "Nieuw Portfolio Bericht",
        adminIntro: "Je hebt een nieuw bericht ontvangen via je contactformulier.",
        labelName: "NAAM",
        labelEmail: "EMAIL",
        labelSubject: "ONDERWERP",
        labelMessage: "BERICHT",
        adminFooter: "Dit bericht is verzonden vanaf je portfolio.",

        autoReplySubject: "Bedankt voor je bericht! ✨",
        autoReplyGreeting: "Hallo {{NAME}}!",
        autoReplyTitle: "Ik heb je bericht ontvangen.",
        autoReplyContacted: "Bedankt voor het contact opnemen over \"{{SUBJECT}}\". Het is een genoegen om van je te horen!",
        autoReplyStudy: "Ik zal de tijd nemen om je verzoek zorgvuldig door te lezen en zo snel mogelijk bij je terugkomen.",
        autoReplyRole: "Fullstack Developer & Creative Coder",
        autoReplyButton: "Bezoek mijn portfolio",
        autoReplyFooter: "© 2026 Sebbe Mercier. Alle rechten voorbehouden.<br/>Dit is een automatisch bevestigingsbericht."
    }
};

const ADMIN_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head><body style="background-color:#f6f9fc"><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">{{TITLE}} de {{NAME}}</div><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;background-color:#ffffff;margin:40px auto;padding:0;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0, 0, 0, 0.05)"><tbody><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background:linear-gradient(135deg, #6d28d9 0%, #db2777 100%);padding:40px 20px;text-align:center"><tbody><tr><td><h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;letter-spacing:-0.5px">{{TITLE}}</h1></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:40px 30px"><tbody><tr><td><p style="font-size:16px;line-height:26px;color:#484848;margin-top:16px;margin-bottom:16px">{{INTRO}}</p><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:20px 0"><tbody><tr><td><p style="font-size:12px;line-height:24px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;letter-spacing:0.05em;margin-top:16px">{{L_NAME}}</p><p style="font-size:16px;line-height:24px;color:#1e293b;margin-bottom:16px;margin:0">{{NAME}}</p><p style="font-size:12px;line-height:24px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;letter-spacing:0.05em;margin-top:16px">{{L_EMAIL}}</p><p style="font-size:16px;line-height:24px;color:#1e293b;margin-bottom:16px;margin:0">{{EMAIL}}</p><p style="font-size:12px;line-height:24px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;letter-spacing:0.05em;margin-top:16px">{{L_SUBJECT}}</p><p style="font-size:16px;line-height:24px;color:#1e293b;margin-bottom:16px;margin:0">{{SUBJECT}}</p></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#f8fafc;padding:24px;border-radius:8px;border-left:4px solid #6d28d9"><tbody><tr><td><p style="font-size:12px;line-height:24px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;letter-spacing:0.05em;margin-top:16px">{{L_MESSAGE}}</p><p style="font-size:15px;line-height:24px;color:#334155;margin:0;white-space:pre-wrap">{{MESSAGE}}</p></td></tr></tbody></table></td></tr></tbody></table><p style="font-size:12px;line-height:24px;color:#8898aa;text-align:center;padding:20px;margin-top:16px;margin-bottom:16px">{{FOOTER}}</p></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

const USER_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head><body style="background-color:#f4f4f7"><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">{{SUBJECT_TEXT}}</div><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td style="background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;background-color:#ffffff;margin:40px auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0, 0, 0, 0.08)"><tbody><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background:linear-gradient(135deg, #6d28d9 0%, #db2777 100%);padding:60px 20px;text-align:center"><tbody><tr><td><h1 style="color:#ffffff;font-size:32px;font-weight:800;margin:0;letter-spacing:-1px">{{GREETING}}</h1></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:40px 30px;text-align:center"><tbody><tr><td><h1 style="color:#1e293b;font-size:24px;font-weight:700;margin:0 0 16px 0">{{TITLE}}</h1><p style="font-size:17px;line-height:28px;color:#475569;margin:0 0 20px 0">{{CONTACTED}}</p><p style="font-size:17px;line-height:28px;color:#475569;margin:0 0 20px 0">{{STUDY}}</p><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e2e8f0;margin:40px 0"/><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-bottom:30px"><tbody><tr><td><p style="font-size:18px;line-height:24px;font-weight:700;color:#1e293b;margin:0 0 4px 0">Sebbe Mercier</p><p style="font-size:14px;line-height:24px;color:#94a3b8;margin:0">{{ROLE}}</p></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:20px"><tbody><tr><td><a href="https://sebbe-mercier.tech" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;background-color:#6d28d9;border-radius:8px;color:#fff;font-size:15px;font-weight:600;text-align:center;padding:12px 30px" target="_blank"><span>{{BUTTON}}</span></a></td></tr></tbody></table></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#0f172a;padding:30px;text-align:center"><tbody><tr><td><p style="font-size:12px;line-height:20px;color:#94a3b8;margin:0">{{FOOTER}}</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

async function verifyTurnstile(token: string) {
    if (!TURNSTILE_SECRET_KEY) return true;

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${TURNSTILE_SECRET_KEY}&response=${token}`,
    })
    const outcome = await response.json()
    return outcome.success
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, email, subject, message, turnstileToken, lang = 'fr' } = await req.json()

        // 1. Verify Turnstile
        const isHuman = await verifyTurnstile(turnstileToken)
        if (!isHuman) {
            throw new Error('Captcha verification failed')
        }

        if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
            throw new Error('Mailjet configuration missing')
        }

        const auth = btoa(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`)
        const L = LOCALES[lang] || LOCALES.fr

        const adminHtml = ADMIN_TEMPLATE
            .replace(/{{TITLE}}/g, L.adminTitle)
            .replace(/{{INTRO}}/g, L.adminIntro)
            .replace(/{{NAME}}/g, name)
            .replace(/{{EMAIL}}/g, email)
            .replace(/{{SUBJECT}}/g, subject)
            .replace(/{{MESSAGE}}/g, message)
            .replace(/{{L_NAME}}/g, L.labelName)
            .replace(/{{L_EMAIL}}/g, L.labelEmail)
            .replace(/{{L_SUBJECT}}/g, L.labelSubject)
            .replace(/{{L_MESSAGE}}/g, L.labelMessage)
            .replace(/{{FOOTER}}/g, L.adminFooter)

        const userHtml = USER_TEMPLATE
            .replace(/{{SUBJECT_TEXT}}/g, L.autoReplySubject)
            .replace(/{{GREETING}}/g, L.autoReplyGreeting.replace('{{NAME}}', name))
            .replace(/{{TITLE}}/g, L.autoReplyTitle)
            .replace(/{{CONTACTED}}/g, L.autoReplyContacted.replace('{{SUBJECT}}', subject))
            .replace(/{{STUDY}}/g, L.autoReplyStudy)
            .replace(/{{ROLE}}/g, L.autoReplyRole)
            .replace(/{{BUTTON}}/g, L.autoReplyButton)
            .replace(/{{FOOTER}}/g, L.autoReplyFooter)

        const mailjetBody = {
            Messages: [
                {
                    From: { Email: MAILJET_FROM_EMAIL, Name: "Portfolio Contact" },
                    To: [{ Email: MAILJET_ADMIN_EMAIL, Name: "Sebbe Mercier" }],
                    Subject: `🚀 ${L.adminTitle}: ${subject}`,
                    HTMLPart: adminHtml,
                },
                {
                    From: { Email: MAILJET_FROM_EMAIL, Name: "Sebbe Mercier" },
                    To: [{ Email: email, Name: name }],
                    Subject: L.autoReplySubject,
                    HTMLPart: userHtml,
                }
            ]
        }

        const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(mailjetBody),
        })

        if (!mailjetResponse.ok) {
            const errorText = await mailjetResponse.text()
            throw new Error(`Mailjet error: ${errorText}`)
        }

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})

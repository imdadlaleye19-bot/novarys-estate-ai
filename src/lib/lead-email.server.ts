type LeadEmailInput = {
  to: string;
  name: string;
  propertyType: string | null;
  location: string | null;
  budgetLabel: string | null;
  agencyName: string;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function renderHtml(i: LeadEmailInput) {
  const rows = [
    ["Type de bien", i.propertyType],
    ["Localisation", i.location],
    ["Budget", i.budgetLabel],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#8b8b93;font-size:14px">${k}</td><td style="padding:8px 0;color:#f5f4f0;font-size:14px;text-align:right">${esc(v!)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#0a0a0c;font-family:Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0c;padding:32px 16px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141416;border:1px solid #232326;border-radius:16px">
<tr><td style="height:4px;background:linear-gradient(90deg,#3b82f6,#8b5cf6);background-color:#6366f1;border-radius:16px 16px 0 0"></td></tr>
<tr><td style="padding:36px 32px">
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:28px;color:#f5f4f0">Merci ${esc(i.name)}</h1>
<p style="margin:0 0 24px;color:#c9c8c3;font-size:15px;line-height:1.6">Nous avons bien reçu votre demande. Voici le rappel de votre projet :</p>
${rows ? `<table width="100%" style="border-top:1px solid #232326;border-bottom:1px solid #232326;margin-bottom:24px">${rows}</table>` : ""}
<p style="margin:0 0 24px;color:#c9c8c3;font-size:15px;line-height:1.6">Un conseiller va vous recontacter très prochainement pour affiner votre recherche.</p>
<p style="margin:0;color:#f5f4f0;font-size:15px">Bien cordialement,<br/><span style="color:#a78bfa">L'équipe ${esc(i.agencyName)}</span></p>
</td></tr></table>
<p style="margin:24px 0 0;color:#8b8b93;font-size:12px;letter-spacing:2px">NOVARYS IMMO</p>
</td></tr></table></body></html>`;
}

/** Envoie l'email de confirmation. Ne lève jamais : renvoie un statut. */
export async function sendLeadConfirmation(
  input: LeadEmailInput,
  apiKey: string | undefined = process.env["RESEND_API_KEY"],
): Promise<{ sent: boolean; error?: string }> {
  try {
    if (!apiKey) return { sent: false, error: "RESEND_API_KEY manquant" };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${input.agencyName} <onboarding@resend.dev>`,
        to: [input.to],
        subject: "Votre demande a bien été reçue — NOVARYS IMMO",
        html: renderHtml(input),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Resend failed [${res.status}]: ${body}`);
      return { sent: false, error: `${res.status}: ${body}` };
    }
    return { sent: true };
  } catch (e) {
    console.error("Resend error", e);
    return { sent: false, error: String(e) };
  }
}

import puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";
import path from "path";
import fs from "fs";

const CV_PATH = process.env.CV_PATH ?? "/var/www/html/Pdf/curriculumIkerMartinez.pdf";

const PROFILE = {
  firstName: "Iker",
  lastName: "Martínez Velasco",
  email: "moimenta267@gmail.com",
  phone: "+34 000 000 000",
  linkedin: "https://www.linkedin.com/in/ikermartinez",
  website: "https://ikermartinezdev.com",
};

// Detectar si la URL es de Greenhouse
export function isGreenhouse(url: string): boolean {
  return /boards\.greenhouse\.io|job-boards\.greenhouse\.io/i.test(url);
}

async function getBrowser(): Promise<Browser> {
  return puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium-browser",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });
}

// Rellena un input si existe
async function fillField(page: Page, selector: string, value: string) {
  try {
    await page.waitForSelector(selector, { timeout: 3000 });
    await page.click(selector, { clickCount: 3 });
    await page.type(selector, value, { delay: 30 });
  } catch {}
}

// Sube un archivo si el input existe
async function uploadFile(page: Page, selector: string, filePath: string) {
  if (!fs.existsSync(filePath)) return;
  try {
    const input = await page.$(selector);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (input) await (input as any).uploadFile(filePath);
  } catch {}
}

// ─── Greenhouse applier ───────────────────────────────────────────────────────

export async function applyGreenhouse(
  jobUrl: string,
  coverLetter: string
): Promise<{ success: boolean; reason: string }> {
  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    console.log(`[applier] Navegando a ${jobUrl}`);
    await page.goto(jobUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // ── Datos personales ─────────────────────────────────────────────────────
    await fillField(page, "#first_name, input[name='first_name']", PROFILE.firstName);
    await fillField(page, "#last_name, input[name='last_name']", PROFILE.lastName);
    await fillField(page, "#email, input[name='email'], input[type='email']", PROFILE.email);
    await fillField(page, "#phone, input[name='phone'], input[type='tel']", PROFILE.phone);
    await fillField(page, "#website, input[name='website']", PROFILE.website);
    await fillField(page, "input[name='linkedin_profile']", PROFILE.linkedin);

    // ── CV ───────────────────────────────────────────────────────────────────
    await uploadFile(page, "input[type='file'][name='resume'], #resume", CV_PATH);

    // ── Carta de presentación ────────────────────────────────────────────────
    // Greenhouse nuevo (job-boards)
    await fillField(page, "#cover_letter_text, textarea[name='cover_letter']", coverLetter);

    // ── Preguntas custom (texto libre solamente) ──────────────────────────────
    // Intenta rellenar textareas vacíos adicionales con la carta
    const textareas = await page.$$("textarea:not([name='cover_letter'])");
    for (const ta of textareas) {
      const val = await ta.evaluate(el => (el as HTMLTextAreaElement).value);
      if (!val) {
        await ta.click();
        await ta.type(coverLetter.slice(0, 500), { delay: 10 });
      }
    }

    // ── Captcha check ────────────────────────────────────────────────────────
    const hasCaptcha = await page.$("iframe[src*='recaptcha'], .g-recaptcha") !== null;
    if (hasCaptcha) {
      return { success: false, reason: "CAPTCHA detectado — no se puede enviar automáticamente" };
    }

    // ── Submit ───────────────────────────────────────────────────────────────
    const submitBtn = await page.$(
      "#submit_app, button[type='submit'], input[type='submit']"
    );
    if (!submitBtn) return { success: false, reason: "Botón de envío no encontrado" };

    await submitBtn.click();
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});

    // Verificar éxito: Greenhouse muestra "Application received" o similar
    const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const success =
      bodyText.includes("application received") ||
      bodyText.includes("thank you") ||
      bodyText.includes("gracias") ||
      bodyText.includes("submitted") ||
      bodyText.includes("successfully");

    return success
      ? { success: true, reason: "Candidatura enviada correctamente" }
      : { success: false, reason: "Enviado pero no se pudo confirmar el éxito" };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[applier] Error:", msg);
    return { success: false, reason: msg.slice(0, 200) };
  } finally {
    await browser?.close();
  }
}

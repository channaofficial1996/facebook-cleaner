const puppeteer = require("puppeteer");
const speakeasy = require("speakeasy");
require("dotenv").config();

module.exports = async function login() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.facebook.com/login");

  await page.type("#email", process.env.FB_UID);
  await page.type("#pass", process.env.FB_PASS);
  await Promise.all([
    page.click('[name="login"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  if (page.url().includes("checkpoint")) {
    const otp = speakeasy.totp({
      secret: process.env.FB_2FA_SECRET,
      encoding: "base32",
    });
    await page.type("#approvals_code", otp);
    await page.click("#checkpointSubmitButton");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  }

  return { browser, page };
};
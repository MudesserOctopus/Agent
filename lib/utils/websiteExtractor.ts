import axios from "axios";
import * as cheerio from "cheerio";
import { htmlToText } from "html-to-text";

export async function extractWebsiteText(url: string): Promise<string> {
 
  const response = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = response.data;
  const $ = cheerio.load(html);

  // Remove noisy elements
  $("script, style, nav, footer, header, iframe, noscript").remove();

  const text = htmlToText($.html(), {
    wordwrap: false,
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  });
  
  return text.trim();
}

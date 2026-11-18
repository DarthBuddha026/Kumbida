// Turns the invitation covers listed in design/manifest.json into standalone pages at public/covers/<id>.html
// (exact markup, own Google Fonts) plus src/lib/covers.generated.json for the demo guest pages (/demo/<id>),
// which render the cover inline. Run: npm run covers
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const manifest = JSON.parse(readFileSync("design/manifest.json", "utf8"));
const out = "public/covers";
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Covers are fixed 390×844 art, so they scale rather than reflow: phones fit the width edge to edge
// (page background = cover color); wider screens fit the whole cover in the window as a centered card.
// Inside an iframe (the preview modal, which is exactly 390×844) nothing changes.
const FIT_CSS = `<style>
html,body{margin:0}
body{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;min-height:100dvh}
body.card{align-items:center;background:#E9E5DA}
body.card>div:first-child{border-radius:24px;box-shadow:0 24px 60px rgba(30,56,54,.25)}
</style>`;
const FIT_JS = `<script>
(function () {
  if (window.self !== window.top) return;
  var b = document.body, c = b.firstElementChild;
  function fit() {
    var w = innerWidth, h = innerHeight, phone = w < 600;
    b.classList.toggle("card", !phone);
    c.style.zoom = phone ? w / 390 : Math.min((w * 0.94) / 390, (h * 0.94) / 844);
    var bg = getComputedStyle(c).backgroundColor;
    b.style.background = phone && bg !== "rgba(0, 0, 0, 0)" ? bg : "";
  }
  fit();
  addEventListener("resize", fit);
})();
</script>`;

const data = {};
for (const t of manifest.templates) {
  const html = readFileSync(`design/${t.file}`, "utf8");
  const id = basename(t.file, ".html");
  const fonts = [...html.matchAll(/<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"/g)].map((m) => m[1].replaceAll("&amp;", "&"));
  let body = html.match(/<template id="dc-root"><x-dc>([\s\S]*?)<\/x-dc>/)?.[1];
  const props = JSON.parse(html.match(/data-props='([^']*)'/)?.[1] ?? "{}");
  if (!body) throw new Error(`${t.file}: no <x-dc> markup`);
  for (const [k, v] of Object.entries(props)) if (!k.startsWith("$")) body = body.replaceAll(`{{${k}}}`, v.default);
  if (/\{\{|data-sc=|<dc-/.test(body)) throw new Error(`${t.file}: unresolved template syntax`);
  // Buttons don't work in previews: the cover's RSVP "button" becomes plain text, out of the tab order.
  body = body.replace(/<a href="#"/g, '<span aria-disabled="true"').replace(/<\/a>/g, "</span>").trim();
  data[id] = { fonts, html: body };

  const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? t.name;
  const links = fonts.map((f) => `<link href="${f.replaceAll("&", "&amp;")}" rel="stylesheet">`).join("\n");
  writeFileSync(
    `${out}/${id}.html`,
    `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n<title>${title}</title>\n${links}\n${FIT_CSS}\n</head>\n<body>${body}\n${FIT_JS}\n</body>\n</html>\n`,
  );
}
writeFileSync("src/lib/covers.generated.json", JSON.stringify(data, null, 1) + "\n");
console.log(`${Object.keys(data).length} covers → ${out}/ and src/lib/covers.generated.json`);

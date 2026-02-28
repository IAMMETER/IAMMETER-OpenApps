const $ = (id) => document.getElementById(id);

let allApps = [];

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function escapeAttr(s) {
  return String(s ?? "").replace(/"/g, "&quot;");
}

/**
 * ✅ 关键：永远把当前页面当“目录”来解析相对路径
 * - 兼容 /site 和 /site/
 * - 兼容 GitHub Pages: /<repo>/site/...
 * - 清理 search/hash，避免把 ?xxx/#xxx 带入 base
 */
function baseDirUrl() {
  const u = new URL(location.href);
  if (!u.pathname.endsWith("/")) u.pathname += "/";
  u.search = "";
  u.hash = "";
  return u;
}

function absoluteUrlMaybe(relativeOrAbsolute, base) {
  if (!relativeOrAbsolute) return "";
  const s = String(relativeOrAbsolute);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return new URL(s, base).toString();
}

function card(app) {
  const status =
    app.runtime === "hosted"
      ? (app.hostedStatus || "pending")
      : app.runtime;

  const badgeClass =
    app.runtime === "hosted" && status !== "deployed" ? "badge pending"
    : app.runtime === "external" ? "badge external"
    : "badge";

  const base = baseDirUrl();

  // ✅ Open 永远指向 app.html，并带 id
  const openUrl = new URL("app.html", base);
  openUrl.searchParams.set("id", app.id);

  // ✅ Source 支持绝对/相对
  const sourceRaw = app.linksSource || app.source || "";
  const sourceUrl = absoluteUrlMaybe(sourceRaw, base);

  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h3>${escapeHtml(app.name)}</h3>
      <span class="${badgeClass}">${escapeHtml(status)}</span>
    </div>
    <div class="sub">by ${escapeHtml(app.author)} · v${escapeHtml(app.version)}</div>
    <div>${escapeHtml(app.description)}</div>
    <div class="tags">${(app.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
    <div class="row" style="margin-top:6px">
      <a class="btn" href="${escapeAttr(openUrl.toString())}">Open</a>
      ${
        sourceUrl
          ? `<a class="btn" href="${escapeAttr(sourceUrl)}" target="_blank" rel="noreferrer">Source</a>`
          : ``
      }
    </div>
  `;
  return el;
}

function applyFilter() {
  const q = $("q").value.trim().toLowerCase();
  const rt = $("runtime").value;

  const filtered = allApps.filter(a => {
    const hit =
      a.id.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (a.author || "").toLowerCase().includes(q);

    const rtOk = !rt || a.runtime === rt;
    return hit && rtOk;
  });

  $("grid").innerHTML = "";
  for (const a of filtered) $("grid").appendChild(card(a));
  $("meta").textContent = `${filtered.length} / ${allApps.length} apps`;
}

async function main() {
  try {
    const base = baseDirUrl();

    // ✅ 永远正确：从 site 目录推导 ../apps/index.json
    const indexUrl = new URL("./../apps/index.json", base).toString();

    const res = await fetch(indexUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load apps/index.json (${res.status})`);
    const data = await res.json();

    allApps = (data.apps || []).map(a => ({ ...a }));

    $("meta").textContent = `${allApps.length} apps · updated ${data.generatedAt || ""}`;
    applyFilter();

    $("q").addEventListener("input", applyFilter);
    $("runtime").addEventListener("change", applyFilter);
  } catch (e) {
    $("err").style.display = "block";
    $("err").textContent = String(e);
  }
}

main();
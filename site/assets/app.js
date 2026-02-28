const $ = (id) => document.getElementById(id);

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, m => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]
  ));
}

function getId() {
  const u = new URL(location.href);
  return u.searchParams.get("id");
}

// ✅ 永远正确的 URL 构造函数
function urlFromHere(relativePath) {
  return new URL(relativePath, location.href).toString();
}

function buildForm(schema) {
  const wrap = document.createElement("div");
  for (const item of (schema || [])) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.margin = "10px 0";

    const label = document.createElement("div");
    label.style.width = "90px";
    label.textContent = item.label || item.key;

    let input;
    if (item.type === "select") {
      input = document.createElement("select");
      for (const opt of (item.options || [])) {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      }
    } else {
      input = document.createElement("input");
      input.type = item.type === "password" ? "password" : "text";
      input.placeholder = item.placeholder || "";
    }

    input.id = `cfg_${item.key}`;
    input.dataset.key = item.key;
    input.dataset.type = item.type;
    if (item.required) input.required = true;

    row.appendChild(label);
    row.appendChild(input);
    wrap.appendChild(row);

    if (item.help) {
      const help = document.createElement("div");
      help.className = "hint";
      help.textContent = item.help;
      wrap.appendChild(help);
    }
  }
  return wrap;
}

function collectConfig(schema) {
  const cfg = {};
  for (const item of (schema || [])) {
    const el = document.getElementById(`cfg_${item.key}`);
    if (!el) continue;
    let v = el.value;

    if (item.required && !v)
      throw new Error(`Missing required field: ${item.label || item.key}`);

    cfg[item.key] = v;
  }
  return cfg;
}

async function main() {
  const id = getId();
  if (!id) {
    $("msg").textContent = "Missing app id.";
    return;
  }

  // ✅ 加强：用 new URL 构造 index 路径
  const idxUrl = urlFromHere("../apps/index.json");
  const idxRes = await fetch(idxUrl, { cache: "no-store" });
  const idx = await idxRes.json();

  const app = (idx.apps || []).find(a => a.id === id);
  if (!app) {
    $("msg").textContent = `App not found: ${id}`;
    return;
  }

  $("title").textContent = app.name;
  $("subtitle").textContent =
    `${app.author} · v${app.version} · ${app.runtime}`;

  // ✅ 加强：manifest 路径
  const mfUrl = urlFromHere(`../apps/${encodeURIComponent(app.id)}/manifest.json`);
  const mfRes = await fetch(mfUrl, { cache: "no-store" });
  const mf = await mfRes.json();

  const schema = mf.configSchema || [];
  $("cfgForm").appendChild(buildForm(schema));

  let iframeUrl = null;

  if (mf.runtime === "static") {
    iframeUrl = urlFromHere(`../${app.entry}`);
    $("msg").textContent = "";
  }
  else if (mf.runtime === "hosted") {
    if (mf.hosted?.status === "deployed" && mf.hosted?.hostedUrl) {
      iframeUrl = mf.hosted.hostedUrl;
      $("msg").textContent = "";
    } else {
      $("msg").textContent =
        "This hosted app is pending official deployment.";
    }
  }
  else if (mf.runtime === "external") {
    iframeUrl = mf.hosted?.hostedUrl || app.hostedUrl || null;
    $("msg").textContent = "This app is externally hosted.";
  }

  const frame = $("frame");
  if (iframeUrl) frame.src = iframeUrl;

  $("btnOpen").onclick = () => {
    if (!iframeUrl) return;
    window.open(iframeUrl, "_blank", "noopener,noreferrer");
  };

  $("btnApply").onclick = () => {
    const cfg = collectConfig(schema);
    if (!frame || !frame.contentWindow)
      throw new Error("Iframe not ready");
    frame.contentWindow.postMessage(
      { type: "IAMMETER_CONFIG", payload: cfg },
      "*"
    );
  };
}

main().catch(e => {
  $("msg").textContent = String(e);
});
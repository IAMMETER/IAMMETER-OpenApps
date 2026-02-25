const $ = (id) => document.getElementById(id);

let currentConfig = null;
let ws = null;

function setStatus(s) {
  $("status").textContent = s;
}

function log(line) {
  const el = $("log");
  el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
}

function showConfig(cfg) {
  $("cfg").textContent = JSON.stringify(cfg, null, 2);
}

function useMock() {
  currentConfig = { sn: "demo-sn", token: "demo-token", mock: true };
  showConfig(currentConfig);
  log("Using mock config. No backend calls made.");
  setStatus("mock");
}

function connectWS() {
  if (!currentConfig) {
    log("No config yet. Waiting for postMessage or click 'Use Mock Data'.");
    return;
  }
  if (ws && ws.readyState === WebSocket.OPEN) {
    log("WS already connected.");
    return;
  }

  const proto = location.protocol === "https:" ? "wss" : "ws";
  const url = `${proto}://${location.host}/ws`;

  setStatus("connecting");
  log(`Connecting to ${url} ...`);

  ws = new WebSocket(url);

  ws.onopen = () => {
    setStatus("connected");
    log("WS connected. Sending config...");
    // 推荐：把敏感配置放在 WS 消息体，而不是 URL query
    ws.send(JSON.stringify({ type: "IAMMETER_CONFIG", payload: currentConfig }));
  };

  ws.onmessage = (ev) => {
    log(`WS message: ${ev.data}`);
  };

  ws.onerror = (e) => {
    log("WS error");
    setStatus("error");
  };

  ws.onclose = () => {
    log("WS closed");
    setStatus("closed");
  };
}

// 接收应用中心注入的配置
window.addEventListener("message", (event) => {
  const data = event?.data;
  if (!data || data.type !== "IAMMETER_CONFIG") return;
  currentConfig = data.payload || null;
  showConfig(currentConfig);
  log("Config received via postMessage.");
  setStatus("config-received");
});

$("btnMock").addEventListener("click", useMock);
$("btnConnect").addEventListener("click", connectWS);

setStatus("idle");
log("Waiting for config via postMessage...");
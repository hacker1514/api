const BASE = "https://3a00a07f-d4fa-41e2-8d42-0986417b4be2-00-3hn75onbv7xor.sisko.replit.dev";

const username = document.getElementById("username");
const apiKey = document.getElementById("apikey");
const statusInfo = document.getElementById("status");
const statusBadge = document.getElementById("status-badge");
const registryTableBody = document.getElementById("registry-table-body");
const chatBox = document.getElementById("chatBox");
const question = document.getElementById("question");

const chatHistory = [];

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = '<i class="fa-solid fa-circle-info" style="color: var(--cyber-yellow)"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: var(--emerald-green)"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--crimson-red)"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 30);
    setTimeout(() => { toast.classList.remove('active'); setTimeout(() => toast.remove(), 300); }, 4000);
}

document.querySelectorAll(".tab-btn").forEach(t => {
    t.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        document.querySelectorAll(".view-pane").forEach(p => p.classList.remove("active"));
        document.getElementById(t.dataset.tab).classList.add("active");
    };
});

function getStorageSyncKeys() { return JSON.parse(localStorage.getItem("kni_api_registry")) || []; }

function saveKeyToStorage(user, key) {
    const registry = getStorageSyncKeys();
    registry.push({ timestamp: new Date().toLocaleString(), username: user, key });
    localStorage.setItem("kni_api_registry", JSON.stringify(registry));
    renderRegistryTable();
}

async function deleteKeyFromServer(key) {
    try {
        await fetch(BASE + "/api/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: key }) });
    } catch (err) { console.error(err); }
}

function deleteKeyFromStorage(index) {
    const registry = getStorageSyncKeys();
    const deletedKey = registry[index].key;
    registry.splice(index, 1);
    localStorage.setItem("kni_api_registry", JSON.stringify(registry));
    renderRegistryTable();
    deleteKeyFromServer(deletedKey);
    showToast("Key removed locally + server request sent", "info");
}

function renderRegistryTable() {
    registryTableBody.innerHTML = "";
    const registry = getStorageSyncKeys();
    if (registry.length === 0) {
        registryTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem;">No API Keys Found.</td></tr>`;
        return;
    }
    registry.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.timestamp}</td><td style="font-weight:600;">${item.username}</td><td class="font-mono">${item.key}</td><td><button class="delete-btn" onclick="deleteKeyFromStorage(${index})"><i class="fa-regular fa-trash-can"></i></button></td>`;
        registryTableBody.appendChild(row);
    });
}

document.getElementById("createBtn").onclick = async () => {
    const userVal = username.value.trim();
    if (!userVal) { showToast("Developer identification alias is required.", "error"); return; }
    statusInfo.innerText = "Querying local execution socket loops...";
    try {
        const res = await fetch(BASE + "/api/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: userVal }) });
        if (!res.ok) { const e = await res.json(); showToast(`Backend Rejection: ${e.detail || 'Invalid params'}`, "error"); statusInfo.innerText = "Execution Refused"; return; }
        const data = await res.json();
        apiKey.value = data.api_key;
        statusInfo.innerText = "API Key Active";
        statusBadge.className = "system-tag online";
        statusBadge.innerText = "KERNEL ACTIVE";
        saveKeyToStorage(userVal, data.api_key);
        showToast("Authorization tokens provisioned and indexed locally.", "success");
    } catch (err) {
        console.error(err);
        statusInfo.innerText = "Link Failure";
        statusBadge.className = "system-tag offline";
        statusBadge.innerText = "SERVER : INACTIVE";
        showToast("SERVER OFFLINE", "error");
    }
};

function copyValue(id) {
    const field = document.getElementById(id);
    if (!field.value || field.value.includes("Awaiting")) { showToast("No active tracking string available to extract.", "error"); return; }
    field.select();
    navigator.clipboard.writeText(field.value);
    showToast("Token configuration copied to browser clipboard.", "success");
}

function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerHTML = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("askBtn").onclick = async () => {
    const promptInput = question.value.trim();
    if (!promptInput) return;
    addMsg(promptInput, "user");
    question.value = "";
    chatHistory.push({ role: "user", content: promptInput });
    try {
        const res = await fetch(BASE + "/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory, username: username.value.trim() || undefined, siteContext: `Site: ${document.title} — URL: ${location.href}` })
        });
        if (!res.ok) { const e = await res.json(); addMsg(`Error: ${e.detail || "AI service unavailable."}`, "ai"); chatHistory.pop(); return; }
        const data = await res.json();
        addMsg(data.reply, "ai");
        chatHistory.push({ role: "assistant", content: data.reply });
    } catch (error) { console.error(error); addMsg("Connection to AI service failed.", "ai"); chatHistory.pop(); }
};

question.addEventListener("keypress", e => { if (e.key === "Enter") document.getElementById("askBtn").click(); });

renderRegistryTable();

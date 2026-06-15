const BASE = "https://3a00a07f-d4fa-41e2-8d42-0986417b4be2-00-3hn75onbv7xor.sisko.replit.dev";
const GROQ_API_KEY = "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";

const username = document.getElementById("username");
const apiKey = document.getElementById("apikey");
const statusInfo = document.getElementById("status");
const statusBadge = document.getElementById("status-badge");
const registryTableBody = document.getElementById("registry-table-body");
const chatBox = document.getElementById("chatBox");
const question = document.getElementById("question");

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    toast.innerHTML = `${icon} ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("active"), 50);
    setTimeout(() => {
        toast.classList.remove("active");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getStorageSyncKeys() {
    return JSON.parse(localStorage.getItem("kni_api_registry")) || [];
}

function saveKeyToStorage(user, key) {
    const registry = getStorageSyncKeys();
    registry.push({ timestamp: new Date().toLocaleString(), username: user, key });
    localStorage.setItem("kni_api_registry", JSON.stringify(registry));
    renderRegistryTable();
}

function renderRegistryTable() {
    registryTableBody.innerHTML = "";
    const registry = getStorageSyncKeys();
    if (!registry.length) {
        registryTableBody.innerHTML = `<tr><td colspan="4">No API Keys Found</td></tr>`;
        return;
    }
    registry.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.timestamp}</td>
            <td>${item.username}</td>
            <td>${item.key}</td>
            <td><button onclick="deleteKeyFromStorage(${index})">Delete</button></td>
        `;
        registryTableBody.appendChild(row);
    });
}

async function deleteKeyFromServer(apiKey) {
    try {
        await fetch(BASE + "/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: apiKey })
        });
    } catch (e) {}
}

function deleteKeyFromStorage(index) {
    const registry = getStorageSyncKeys();
    const key = registry[index].key;
    registry.splice(index, 1);
    localStorage.setItem("kni_api_registry", JSON.stringify(registry));
    renderRegistryTable();
    deleteKeyFromServer(key);
    showToast("Key deleted", "success");
}

document.getElementById("createBtn").onclick = async () => {
    const userVal = username.value.trim();
    if (!userVal) return showToast("Username required", "error");

    statusInfo.innerText = "Creating key...";

    try {
        const res = await fetch(BASE + "/api/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: userVal })
        });

        const data = await res.json();

        if (!res.ok) return showToast(data.detail || "Error", "error");

        apiKey.value = data.api_key;
        statusInfo.innerText = "ACTIVE";
        statusBadge.innerText = "ONLINE";

        saveKeyToStorage(userVal, data.api_key);
        showToast("API Key Created", "success");
    } catch (err) {
        showToast("Server Offline", "error");
    }
};

function copyValue(id) {
    const field = document.getElementById(id);
    if (!field.value) return showToast("Nothing to copy", "error");
    navigator.clipboard.writeText(field.value);
    showToast("Copied", "success");
}

function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("askBtn").onclick = async () => {
    const promptInput = question.value.trim();
    if (!promptInput) return;

    addMsg(promptInput, "user");
    question.value = "";

    try {
        const response = await fetch("https://api.groq.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: promptInput }
                ]
            })
        });

        const data = await response.json();
        addMsg(data.choices[0].message.content, "ai");
    } catch (e) {
        addMsg("AI error", "ai");
    }
};

question.addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("askBtn").click();
});

renderRegistryTable();
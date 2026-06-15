const BASE = "https://3a00a07f-d4fa-41e2-8d42-0986417b4be2-00-3hn75onbv7xor.sisko.replit.dev";
const GROQ_API_KEY = "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";

const username = document.getElementById("username");
const apiKey = document.getElementById("apikey");
const statusInfo = document.getElementById("status");
const statusBadge = document.getElementById("status-badge");
const registryTableBody = document.getElementById("registry-table-body");
const chatBox = document.getElementById("chatBox");
const question = document.getElementById("question");

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '<i class="fa-solid fa-circle-info" style="color: var(--cyber-yellow)"></i>';
    if(type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: var(--emerald-green)"></i>';
    if(type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--crimson-red)"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 30);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

document.querySelectorAll(".tab-btn").forEach(t => {
    t.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("active"));
        t.classList.add("active");

        document.querySelectorAll(".view-pane").forEach(p => p.classList.remove("active"));
        document.getElementById(t.dataset.tab).classList.add("active");
    }
});

function getStorageSyncKeys() {
    return JSON.parse(localStorage.getItem("kni_api_registry")) || [];
}

function saveKeyToStorage(user, key) {
    const registry = getStorageSyncKeys();
    registry.push({
        timestamp: new Date().toLocaleString(),
        username: user,
        key: key
    });
    localStorage.setItem("kni_api_registry", JSON.stringify(registry));
    renderRegistryTable();
}

async function deleteKeyFromServer(apiKey) {
    try {
        await fetch(BASE + "/api/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ api_key: apiKey })
        });
    } catch (err) {
        console.error(err);
    }
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
        registryTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No API Keys Found .</td></tr>`;
        return;
    }

    registry.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.timestamp}</td>
            <td style="font-weight: 600;">${item.username}</td>
            <td class="font-mono">${item.key}</td>
            <td>
                <button class="delete-btn" onclick="deleteKeyFromStorage(${index})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </td>
        `;
        registryTableBody.appendChild(row);
    });
}

document.getElementById("createBtn").onclick = async () => {
    const userVal = username.value.trim();
    if (!userVal) {
        showToast("Developer identification alias is required.", "error");
        return;
    }

    statusInfo.innerText = "Querying local execution socket loops...";

    try {
        const res = await fetch(BASE + "/api/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: userVal })
        });

        if (!res.ok) {
            const errData = await res.json();
            showToast(`Backend Rejection: ${errData.detail || 'Invalid params'}`, "error");
            statusInfo.innerText = "Execution Refused";
            return;
        }

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
    if (!field.value || field.value.includes("Awaiting")) {
        showToast("No active tracking string available to extract.", "error");
        return;
    }
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

    if (GROQ_API_KEY === "api_key_add") {
        setTimeout(() => {
            addMsg("Groq AI Engine routing is currently suspended. Please update the placeholder variable 'api_key_add' inside your script.js configuration file.", "ai");
        }, 400);
        return;
    }

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
                    {
                        role: "system",
                        content: "You are the KNI Core AI Oracle, an interactive expert system."
                    },
                    {
                        role: "user",
                        content: promptInput
                    }
                ],
                temperature: 0.5,
                max_tokens: 1024
            })
        });

        if (!response.ok) throw new Error("API error");

        const payload = await response.json();
        addMsg(payload.choices[0].message.content, "ai");

    } catch (error) {
        console.error(error);
        addMsg("AI error occurred", "ai");
    }
};

question.addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("askBtn").click();
});

renderRegistryTable();

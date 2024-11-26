// Made by https://t.me/Ashlynn_Repository
const TOKEN = "";
const CHAT_ID = null; 
const WEBHOOK = "/endpoint";
const SECRET = "AAEDaYHghSqCqrmOfyZERyN5_hkGjn8MWH8";
// Made by https://t.me/Ashlynn_Repository
class AIUncensored {
  constructor() {
    this.url = "https://darkness.ashlynn.workers.dev/chat/"; // New API endpoint
    this.headers = {
      "Content-Type": "application/json"
    };
  }

  async fetchResponse(userMessage) {
    try {
      const response = await fetch(`${this.url}?prompt=${encodeURIComponent(userMessage)}`, {
        method: "GET",
        headers: this.headers
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
        return "There was an error. Please try again later.";
      }

      const data = await response.json();

      if (data.successful === "success") {
        return data.response; 
      } else {
        console.error("Error:", data);
        return "There was an error. Please try again later.";
      }
    } catch (error) {
      console.error("Error:", error);
      return "There was an error. Please try again later.";
    }
  }
}

// Made by https://t.me/Ashlynn_Repository
addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === "/registerWebhook") {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET));
  } else if (url.pathname === "/unRegisterWebhook") {
    event.respondWith(unRegisterWebhook(event));
  } else {
    event.respondWith(new Response("Bot is running! ⚙️", { status: 200 }));
  }
});

// Made by https://t.me/Ashlynn_Repository
async function handleWebhook(event) {
  console.log("Incoming webhook request");

  // Check the authorization token
  if (event.request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== SECRET) {
    console.error("Unauthorized access attempt detected");
    return new Response("Unauthorized", { status: 403 });
  }
// Made by https://t.me/Ashlynn_Repository
  try {
    const update = await event.request.json();
    console.log("Update received:", update);
    await onUpdate(update);
    return new Response("Ok");
  } catch (error) {
    console.error("Error processing update:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Made by https://t.me/Ashlynn_Repository
async function onUpdate(update) {
  if (update.message && update.message.text) {
    const message = update.message;
    const text = message.text.trim(); 
    console.log("Handling message:", message);

    if (text === "/start") {
      return sendStartMessage(message.chat.id);
    } else if (text === "/about") {
      return sendHelpMessage(message.chat.id);  
    } else if (text.startsWith("/img ")) {
      const prompt = text.slice(5).trim();  
      return handleFluxCommand(message.chat.id, prompt);
    } else {
      await sendTyping(message.chat.id);  
      try {
        const ai = new AIUncensored();
        const aiResponse = await ai.fetchResponse(text);  
        return sendMarkdown(message.chat.id, aiResponse); 
      } catch (error) {
        console.error("Error fetching AI response:", error);
        return sendMarkdown(message.chat.id, "Error fetching AI response: " + error.message);
      }
    }
  }
}
// Made by https://t.me/Ashlynn_Repository
async function handleFluxCommand(chatId, prompt) {
  await sendPhotoAction(chatId); 

  try {
    const response = await fetch(`https://death-image.ashlynn.workers.dev/?prompt=${encodeURIComponent(prompt)}&image=6&dimensions=square&safety=false`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

// Made by https://t.me/Ashlynn_Repository
    const data = await response.json();
    const imageUrls = data.images || [];
    const joinText = data.join || "";    

// Made by https://t.me/Ashlynn_Repository
    if (imageUrls.length === 0) {
      throw new Error("No images returned from API.");
    }

// Made by https://t.me/Ashlynn_Repository
    for (const imageUrl of imageUrls) {
      await sendPhoto(chatId, imageUrl);
    }

    if (joinText) {
      await sendMarkdown(chatId, joinText);
    }

  } catch (error) {
    console.error("Error generating images:", error);
    await sendMarkdown(chatId, "Error generating images: " + error.message);
  }
}

// Made by https://t.me/Ashlynn_Repository
async function sendStartMessage(chatId) {
    const videoUrl = "https://file-stream.darkhacker7301.workers.dev/?file=MzA2OTMxOTgxMzI2MzkwOTAwLzEwNDczMTM0NA"; // Replace with actual video URL
    const caption = "→ I ᴀᴍ CʜᴀᴛGPT X, I'm Devloped to answer your Question Made by @Itz_Ashlynn In India 🇮🇳\n\n🌎Wʜᴀᴛ ɪs Nᴇᴡ?\n→ Hᴀᴠᴇ ᴀ ғʀᴇᴇ ᴄʜᴀᴛ ɢᴘᴛ ʙᴏᴛ  sᴇʀᴠɪᴄᴇ ᴀᴛ ᴛʜᴇ ᴍᴏᴍᴇɴᴛ sᴏ ʏᴏᴜ ᴄᴀɴ ᴀsᴋ ᴀɴʏ ǫᴜᴇsᴛɪᴏɴs ʏᴏᴜ ᴡᴀɴᴛ.";
  
    await fetch(apiUrl("sendVideo"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        video: videoUrl,
        caption: caption,
        parse_mode: "HTML"
      })  
    });
  }
// Made by https://t.me/Ashlynn_Repository
async function sendHelpMessage(chatId) {
    const helpMessage = `
╔════❰ Cʜᴀᴛɢᴘᴛ X ❱═❍
║╭━━━━━━━━━━━━━━━➣
║┣⪼🤖ᴍʏ ɴᴀᴍᴇ  : Cʜᴀᴛɢᴘᴛ X
║┣⪼👦ᴅᴇᴠᴇʟᴏᴘᴇʀ: [Asʜʟʏɴɴ ⚡](https://telegram.me/Itz_Ashlynn)
║┣⪼❣️ᴜᴘᴅᴀᴛᴇ   : [Asʜʟʏɴɴ Rᴇᴘᴏsɪᴛᴏʀʏ 🔰](https://telegram.me/Ashlynn_Repository/215)
║┣⪼🗣️ʟᴀɴɢᴜᴀɢᴇ : [JS 💻](https://nodejs.org/en)
║┣⪼🧠ʜᴏsᴛᴇᴅ   : [ᴄʟᴏᴜᴅғʟᴀʀᴇ⚡](https://dash.cloudflare.com/)
║┣⪼📚ᴜᴘᴅᴀᴛᴇᴅ  : 13-Nov-2024
║┣⪼🗒️ᴠᴇʀsɪᴏɴ  : v2.01.1
║╰━━━━━━━━━━━━━━━➣ 
╚══════════════════❍
    `;

  await sendMarkdown(chatId, helpMessage);
}

async function sendTyping(chatId) {
    return (
      await fetch(
        apiUrl("sendChatAction", {
          chat_id: chatId,
          action: "typing",
        })
      )
    ).json();
  }

// Made by https://t.me/Ashlynn_Repository
async function sendPhotoAction(chatId) {
  await fetch(apiUrl("sendChatAction", {
    chat_id: chatId,
    action: "upload_photo"
  }));
}

// Made by https://t.me/Ashlynn_Repository
async function sendPhoto(chatId, photoUrl, caption) {
  await fetch(apiUrl("sendPhoto"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
      parse_mode: "Markdown",
      message_effect_id: "5104841245755180586"
    })
  });
}

// Made by https://t.me/Ashlynn_Repository
async function sendMarkdown(chatId, text) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "markdown",
        message_effect_id: "5104841245755180586"
      })
    )
  ).json();
}

// Made by https://t.me/Ashlynn_Repository
async function registerWebhook(event, requestUrl, suffix, secret) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`;
  console.log("Registering webhook at:", webhookUrl);

  const response = await fetch(apiUrl("setWebhook"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, secret_token: secret })
  });

  const result = await response.json();
  if (result.ok) {
    console.log("Webhook registered successfully");
    return new Response("Webhook registered successfully");
  } else {
    console.error("Error registering webhook:", result);
    return new Response("Webhook registration failed", { status: 500 });
  }
}

// Made by https://t.me/Ashlynn_Repository
async function unRegisterWebhook(event) {
  console.log("Unregistering webhook");
  const response = await fetch(apiUrl("setWebhook"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "" })
  });

  const result = await response.json();
  if (result.ok) {
    console.log("Webhook unregistered successfully");
    return new Response("Webhook unregistered successfully");
  } else {
    console.error("Error unregistering webhook:", result);
    return new Response("Failed to unregister webhook", { status: 500 });
  }
}

// Made by https://t.me/Ashlynn_Repository
function apiUrl(methodName, params = null) {
  let query = "";
  if (params) {
    query = "?" + new URLSearchParams(params).toString();
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`;
}

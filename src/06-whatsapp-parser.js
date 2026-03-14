/**
 * 💬 WhatsApp Message Parser
 *
 * Chintu ek WhatsApp chat analyzer bana raha hai. Usse raw WhatsApp
 * exported message line parse karni hai aur usme se date, time, sender,
 * aur message alag alag extract karna hai.
 *
 * WhatsApp export format:
 *   "DD/MM/YYYY, HH:MM - Sender Name: Message text here"
 *
 * Rules:
 *   - Date extract karo: string ke start se pehle ", " (comma-space) tak
 *   - Time extract karo: ", " ke baad se " - " (space-dash-space) tak
 *   - Sender extract karo: " - " ke baad se pehle ": " (colon-space) tak
 *   - Message text extract karo: pehle ": " ke baad (after sender) sab kuch, trimmed
 *   - wordCount: message ke words count karo (split by space, filter empty strings)
 *   - Sentiment detection (case-insensitive check on message text):
 *     - Agar message mein "😂" ya ":)" ya "haha" hai => sentiment = "funny"
 *     - Agar message mein "❤" ya "love" ya "pyaar" hai => sentiment = "love"
 *     - Otherwise => sentiment = "neutral"
 *     - Agar dono match hote hain, "funny" gets priority
 *   - Hint: Use indexOf(), substring()/slice(), includes(), split(),
 *     trim(), toLowerCase()
 *
 * Validation:
 *   - Agar input string nahi hai, return null
 *   - Agar string mein " - " nahi hai ya ": " nahi hai (after sender), return null
 *
 * @param {string} message - Raw WhatsApp exported message line
 * @returns {{ date: string, time: string, sender: string, text: string, wordCount: number, sentiment: string } | null}
 *
 * @example
 *   parseWhatsAppMessage("25/01/2025, 14:30 - Rahul: Bhai party kab hai? 😂")
 *   // => { date: "25/01/2025", time: "14:30", sender: "Rahul",
 *   //      text: "Bhai party kab hai? 😂", wordCount: 5, sentiment: "funny" }
 *
 *   parseWhatsAppMessage("01/12/2024, 09:15 - Priya: I love this song")
 *   // => { date: "01/12/2024", time: "09:15", sender: "Priya",
 *   //      text: "I love this song", wordCount: 4, sentiment: "love" }
 */
export function parseWhatsAppMessage(message) {
  if (typeof message !== 'string') return null;
  
  const commaSpace = message.indexOf(", ");
  const spaceDashSpace = message.indexOf(" - ");
  
  if (commaSpace === -1 || spaceDashSpace === -1) return null;
  
  const dateStr = message.substring(0, commaSpace);
  const timeStr = message.substring(commaSpace + 2, spaceDashSpace);
  
  const colonSpace = message.indexOf(": ", spaceDashSpace);
  if (colonSpace === -1) return null;
  
  const senderStr = message.substring(spaceDashSpace + 3, colonSpace);
  const textStr = message.substring(colonSpace + 2).trim();
  
  const words = textStr.split(' ').filter(word => word !== '');
  const wordCount = words.length;
  
  const textLower = textStr.toLowerCase();
  let sentiment = "neutral";
  
  if (textLower.includes("😂") || textLower.includes(":)") || textLower.includes("haha")) {
    sentiment = "funny";
  } else if (textLower.includes("❤") || textLower.includes("love") || textLower.includes("pyaar")) {
    sentiment = "love";
  }
  
  return {
    date: dateStr,
    time: timeStr,
    sender: senderStr,
    text: textStr,
    wordCount: wordCount,
    sentiment: sentiment
  };
}

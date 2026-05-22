export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 未設定' });
  }

  try {
    const { messages, system } = req.body;

    const geminiMessages = [];
    for (const m of messages) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      const last = geminiMessages[geminiMessages.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += '\n' + m.content;
      } else {
        geminiMessages.push({ role, parts: [{ text: m.content }] });
      }
    }

    if (geminiMessages.length === 0 || geminiMessages[0].role !== 'user') {
      geminiMessages.unshift({ role: 'user', parts: [{ text: '開始對話' }] });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
        })
      }
    );

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ 
        error: data.error?.message || 'Gemini API 錯誤' 
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    if (!text) {
      return res.status(500).json({ error: 'Gemini 回傳空白內容' });
    }

    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: '請求逾時，請再試一次' });
    }
    return res.status(500).json({ error: error.message });
  }
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PROXY_URL = 'https://gemini-vertex-student-proxy.vercel.app/api/gemini';

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

export async function queryGemini(systemInstruction: string, promptText: string): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key (VITE_GEMINI_API_KEY) is missing in environment.');
  }

  const fullPrompt = `${systemInstruction}\n\nContexto del usuario:\n${promptText}`;

  const requestBody = {
    modelKey: 'flash',
    prompt: fullPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 3000
    }
  };

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini proxy failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (import.meta.env.DEV) {
    console.log("Full raw response object from proxy:", JSON.stringify(data, null, 2));
  }

  let text = '';
  if (data.ok === true && typeof data.text === 'string') {
    text = data.text;
  } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    text = data.candidates[0].content.parts[0].text;
  }

  if (!text) {
    throw new Error('No content returned from Gemini proxy (candidates or text was empty).');
  }

  if (import.meta.env.DEV) {
    console.log("Raw Gemini response:", text);
  }

  try {
    const cleanedText = cleanJsonResponse(text);
    const parsed = JSON.parse(cleanedText);
    if (import.meta.env.DEV) {
      console.log("Parsed JSON response:", parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini response:', text, err);
    throw new Error('Failed to parse Gemini response as JSON: ' + err);
  }
}

export async function generateWrappedImage(promptText: string): Promise<any> {
  if (import.meta.env.DEV) {
    console.log("--- LLAMADA A GEMINI IMAGEN WRAPPED ---");
  }

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key (VITE_GEMINI_API_KEY) is missing in environment.');
  }

  const requestBody = {
    modelKey: 'image',
    prompt: promptText
  };

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini proxy failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (import.meta.env.DEV) {
    console.log("Full raw response from Gemini Imagen:", JSON.stringify(data, null, 2));
  }

  const base64 = data.images?.[0]?.base64;
  if (!base64) throw new Error('No image data found in response');
  return { base64, mimeType: data.images[0].mimeType || 'image/png' };
}

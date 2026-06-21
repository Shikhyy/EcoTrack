export async function askEcoGuide(context, history, userMessage) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, history, userMessage }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to connect to EcoGuide API";
    try {
      const data = await res.json();
      if (data.error) errorMessage = data.error;
    } catch {
      // Ignore JSON parse errors if response is not JSON
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data.reply;
}

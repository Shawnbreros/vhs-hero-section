// /netlify/functions/send-to-zapier.js

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const zapierWebhookURL = 'https://hooks.zapier.com/hooks/catch/11853774/2jjg3r4/';

  try {
    const payload = JSON.parse(event.body);

    const response = await fetch(zapierWebhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Zapier response not OK: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (error) {
    console.error('Error sending to Zapier:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending to Zapier', error: error.message }),
    };
  }
}

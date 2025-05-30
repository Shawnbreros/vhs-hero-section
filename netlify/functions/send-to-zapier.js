// /netlify/functions/send-to-zapier.js

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const zapierWebhookURL = process.env.ZAPIER_WEBHOOK_URL;

  let payload;

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (contentType.includes('application/json')) {
      payload = JSON.parse(event.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      payload = Object.fromEntries(new URLSearchParams(event.body));
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

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

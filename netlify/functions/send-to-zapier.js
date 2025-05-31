// send-to-zapier.js (updated with name/address split and ZIP extraction)

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const body = new URLSearchParams(event.body);

  const fullName = body.get("name") || "";
  const address = body.get("address") || "";

  // --- Split Full Name ---
  const [firstName, ...lastParts] = fullName.trim().split(" ");
  const lastName = lastParts.join(" ");

  // --- Split Address ---
  const addressParts = address.split(',').map(part => part.trim());
  const street = addressParts[0] || "";
  const city = addressParts[1] || "";
  const stateZip = addressParts[2] || "";

  const [state, zip] = stateZip.split(" ").filter(Boolean);

  const phone = body.get("phone") || "";
  const email = body.get("email") || "";
  const timestamp = new Date().toISOString();

  const payload = {
    firstName,
    lastName,
    street,
    city,
    state,
    zip,
    phone,
    email,
    timestamp,
    source: "Hero Form"
  };

  try {
    const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Zapier responded with status ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending to Zapier", error: error.message })
    };
  }
};

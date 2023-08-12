// api.js
const baseUrl = 'http://localhost:3001';
export async function sendKeytoBackend(apiKey) {
  console.log(apiKey);
  return fetch(`${baseUrl}/api/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ apiKey: apiKey }), // Send the API key directly
  })
    .then(response => response.json())
    .catch(error => {
      throw new Error('Error sending API key:', error);
    });
}


export async function fetchUser(token) {
  try {
    const response = await fetch(`${baseUrl}/api/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

  
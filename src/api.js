// api.js
const baseUrl = 'http://localhost:3001';
export async function sendKeytoBackend(apiKey) {

  console.log('Sending API key:', apiKey);

  try {
    const response = await fetch(`${baseUrl}/api/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: apiKey }), // Send the API key directly
    });

    if (!response.ok) {
      console.error('API key authentication failed:', response.status, response.statusText);
      throw new Error('API key authentication failed');
    }

    const data = await response.json();
    console.log('API key authentication successful:', data);
    return data;
  } catch (error) {
    console.error('Error sending API key:', error);
    throw new Error('Error sending API key:', error);
  }
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



export async function fetchTables(token) {
  try {
    const response = await fetch(`${baseUrl}/api/tables`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}





  
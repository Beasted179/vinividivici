// api.js
const baseUrl = 'https://vinividivici.onrender.com';
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
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
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
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}
export async function fetchComparisonData(token, selectedTables) {
  try {
    const response = await fetch(`/api/tables/compare?tableNames=${selectedTables.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comparison data');
    }

    const comparisonData = await response.json();
    return comparisonData;
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return null;
  }
}







  
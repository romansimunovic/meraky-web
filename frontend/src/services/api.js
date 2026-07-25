const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Dohvat cjenika i kategorija
export async function fetchServices() {
  try {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) throw new Error('Greška pri dohvaćanju usluga.');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Slanje nove rezervacije
export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Greška pri rezervaciji.');
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

// Admin prijava
export async function adminLogin(username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Neispravna prijava.');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
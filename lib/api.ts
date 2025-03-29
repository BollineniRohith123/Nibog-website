import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchEvents() {
  try {
    const response = await apiClient.get('/events');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
}

export async function createRegistration(registrationData: any) {
  try {
    const response = await apiClient.post('/registrations', registrationData);
    return response.data;
  } catch (error) {
    console.error('Failed to create registration:', error);
    throw error;
  }
}

export async function fetchUserRegistrations(userId: string) {
  try {
    const response = await apiClient.get(`/registrations?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user registrations:', error);
    throw error;
  }
}

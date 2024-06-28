// src/services/authService.js

import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/gateway/users';

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {

      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Error logging in');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error logging in');
    }
  }
};
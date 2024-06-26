import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/gateway/search';

export const getPaginatedEvents = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  };
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/gateway/search';
const EVENT_API_URL = 'http://127.0.0.1:5000/gateway/events';


export const getPaginatedEvents = async (page = 1, limit = 5, search_term, category, event_type, sort_order) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { page, limit, search_term, category, event_type, sort_order},
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  };

export const createEvent = async (formData) => {
    const token = localStorage.getItem('token');
    try{
      const response = await axios.post(`${EVENT_API_URL}/create-event`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    }catch(error){
        console.error('Failed to create event:', error);
        throw error;
    }
    
  };
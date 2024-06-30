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

export const getEvent = async (id) => {
    try {
      const response = await axios.get(`${EVENT_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      throw error;
    }
  }

export const createTicket = async (quantity, event_id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${EVENT_API_URL}/create-ticket`, {event_id, quantity}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  }
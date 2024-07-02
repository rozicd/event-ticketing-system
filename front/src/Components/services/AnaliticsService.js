import axios from 'axios';
const EVENT_API_URL = 'http://127.0.0.1:5000/gateway/analitics/tickets';

export const getEventAnalitics = async (interval, id) => {
    try {
        const response = await axios.get(`${EVENT_API_URL}/${interval}`, {
            params: { event_id: id },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch event analitics:', error);
        throw error;
    }
}
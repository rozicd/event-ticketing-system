import axios from 'axios';
const EVENT_API_URL = 'http://127.0.0.1:5000/gateway/reviews';

export const createReview = async (reviewData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${EVENT_API_URL}/create-review`, reviewData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to create review:', error);
        throw error;
    }
}
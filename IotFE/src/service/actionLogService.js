import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:8080/api/v1/action';

// Get all actions with pagination, sorting, and search functionality
const formatDateForLocalDateTime = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
};

// Get all actions with pagination, sorting, search, and date filtering
const getAllActionsWithCondition = async (page = 0, size = 10, search = '', startDate = '', endDate = '') => {
    try {
        // Format startDate and endDate to LocalDateTime format if provided
        const params = { page, size, search };
        if (startDate) params.startDate = formatDateForLocalDateTime(startDate);
        if (endDate) params.endDate = formatDateForLocalDateTime(endDate);

        const response = await axios.get(API_URL, { params });
        
        console.log('API response:', response); // Log the response
        return response.data.result; // Return the expected data structure
    } catch (error) {
        console.error('Error fetching actions:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error for the component to catch
    }
};
const sendAction = async (actionData) => {
    try {
        const response = await axios.post(API_URL, actionData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Action sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending action:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const actionLogService = {
    getAllActionsWithCondition,
    sendAction
};

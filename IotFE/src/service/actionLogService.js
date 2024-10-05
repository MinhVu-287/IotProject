import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/action';

// Get all actions with pagination, sorting, and search functionality
const getAllActionsWithCondition = async (page = 0, size = 10, search = '') => {
    try {
        const response = await axios.get(API_URL, {
            params: { page, size, search }
        });

        console.log('API response:', response); // Log the whole response
        return response.data.result; // Make sure this matches your API's structure
    } catch (error) {
        console.error('Error fetching actions:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to be caught in the component
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

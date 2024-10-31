// src/services/dataSensorService.js
import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:8080/api/v1/data-sensors'; // Base URL for the Data Sensor API
const formatDateForLocalDateTime = (date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
};
// Get all data sensors with pagination, sorting, and search functionality
const getAllDataSensorsWithCondition = async (page = 0, size = 10, search = '', startDate = '', endDate = '') => {
    try {
        const params = { page, size, search };
        if (startDate) params.startDate = formatDateForLocalDateTime(startDate);
        if (endDate) params.endDate = formatDateForLocalDateTime(endDate);

        const response = await axios.get(API_URL, { params });
        
        console.log('API response:', response);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching actions:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Get the latest data sensor
const getLatestDataSensor = async () => {
    try {
        const response = await axios.get(`${API_URL}/latest`);
        return response.data.result; // Adjust based on your actual response structure
    } catch (error) {
        console.error('Error fetching the latest data sensor:', error);
        throw error;
    }
};

// Get all data sensors (non-paginated)
const getAllDataSensors = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data.result; // Adjust based on your actual response structure
    } catch (error) {
        console.error('Error fetching all data sensors:', error);
        throw error;
    }
};

export const dataSensorService = {
    getAllDataSensorsWithCondition,
    getLatestDataSensor,
    getAllDataSensors,
};

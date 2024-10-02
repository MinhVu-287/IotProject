// src/services/dataSensorService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/data-sensors'; // Base URL for the Data Sensor API

// Get all data sensors with pagination, sorting, and search functionality
const getAllDataSensorsWithCondition = async (page = 0, size = 10, search = '') => {
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

const axios = require('axios');

const API_KEY = 'pdA86Ga5zszveNHoxm8MmQ==vR9cs6KhPfs9CalH'; // Replace with your actual API key
const BASE_URL = 'https://api.api-ninjas.com/v1/facts';

async function getFunFact() {
    try {
        const response = await axios.get(BASE_URL, {
            headers: { 'X-Api-Key': API_KEY },
        });
        return response.data[0].fact; // Return the first fact
    } catch (error) {
        console.error('Error fetching fun fact:', error.response?.data || error.message);
        return 'Sorry, we could not fetch a fun fact at the moment.';
    }
}

module.exports = { getFunFact };

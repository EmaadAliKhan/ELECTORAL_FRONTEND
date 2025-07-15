import axios from 'axios';

// ⚙️ Centralized axios instance for API communication
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // 👈 Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
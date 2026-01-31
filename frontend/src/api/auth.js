import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async userData => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.log('CORS Error:', error);
    throw error;
  }
};

export const login = async credentials => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    localStorage.setItem('access_token', response.data.access_token);

    setAuthToken(response.data.access_token);

    const userResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    return {
      ...response.data,
      user: userResponse.data,
    };
  } catch (error) {
    console.log(error);

    localStorage.removeItem('access_token');
    setAuthToken(null);
    throw error;
  }
};

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const logout = () => {
  localStorage.removeItem('authData');
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
    }
    throw error;
  }
};

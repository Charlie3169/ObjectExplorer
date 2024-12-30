import axios, { AxiosError } from 'axios';

// Replace 'textrepository' with the service name defined in your docker-compose.yml
const API_BASE_URL = 'https://api.orbscape.io'; //'http://10.0.0.15:3001'; //'http://api.orbscape.net';



//todo refactor below functions
export async function fetchEntries() {
    try {
      const response = await axios.get(`${API_BASE_URL}/functions`)//, {
 
      console.log('Full response:', response);  // Log the entire response object
      console.log('Response data:', response.data);  // Log response data separately
      return response.data;
      // Handle the response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
      } else {
        console.error('Unexpected error:', error);
      }
    }
}


export async function getGithubRepos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/systemrepositories`)//, {
 
      console.log('Full response:', response);  // Log the entire response object
      console.log('Response data:', response.data);  // Log response data separately
      return response.data;
      // Handle the response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
      } else {
        console.error('Unexpected error:', error);
      }
    }
}

export async function getDockerContainers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/dockercontainers`)//, {
   
      console.log('Full response:', response);  // Log the entire response object
      console.log('Response data:', response.data);  // Log response data separately
      return response.data;
      // Handle the response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
      } else {
        console.error('Unexpected error:', error);
      }
    }
}

export async function getKubernetesInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/kubernetesinfo`)//, {

      console.log('Full response:', response);  // Log the entire response object
      console.log('Response data:', response.data);  // Log response data separately
      return response.data;
      // Handle the response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
      } else {
        console.error('Unexpected error:', error);
      }
    }
}












//Old

// Example function to get all text entries
export async function getAllTextEntries() {
    try {
        const response = await axios.get(`${API_BASE_URL}/GetTextStore`);
        return response.data;
    } catch (error) {
        console.error('Error fetching text entries:', error);
        throw error;
    }
}

// Example function to add text
export async function addText(text: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}/AddTextStore`, { text });
        return response.data;
    } catch (error) {
        console.error('Error adding text:', error);
        throw error;
    }
}

// Example function to update text
export async function updateText(id: number, text: string) {
    try {
        const response = await axios.put(`${API_BASE_URL}/UpdateTextStore/${id}`, { text });
        return response.data;
    } catch (error) {
        console.error('Error updating text:', error);
        throw error;
    }
}

// Example function to delete text
export async function deleteText(id: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/DeleteTextStore/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting text:', error);
        throw error;
    }
}

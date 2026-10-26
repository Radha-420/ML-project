import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getHealth = async () => {
    try {
        const res = await axios.get(`${API_URL}/health`);
        return res.data;
    } catch (e) { throw e; }
};

export const getStatistics = async () => {
    try {
        const res = await axios.get(`${API_URL}/statistics`);
        return res.data.data;
    } catch (e) { throw e; }
};

export const predictEmployee = async (employeeData) => {
    try {
        const res = await axios.post(`${API_URL}/predict`, employeeData);
        return res.data;
    } catch (e) { throw e; }
};

export const getHistory = async (limit = 100) => {
    try {
        const res = await axios.get(`${API_URL}/history?limit=${limit}`);
        return res.data.data;
    } catch (e) { throw e; }
};

export const deleteHistoryRecord = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/history/${id}`);
        return res.data;
    } catch (e) { throw e; }
};

export const getModelInfo = async () => {
    try {
        const res = await axios.get(`${API_URL}/model-info`);
        return res.data.data;
    } catch (e) { throw e; }
};

export const getEmployees = async () => {
    const res = await axios.get(`${API_URL}/employees`);
    return res.data.data;
};

export const getEmployeeById = async (id) => {
    const res = await axios.get(`${API_URL}/employees/${id}`);
    return res.data.data;
};

export const getAnalytics = async () => {
    const res = await axios.get(`${API_URL}/analytics`);
    return res.data.data;
};

export const getCompany = async () => {
    const res = await axios.get(`${API_URL}/company`);
    return res.data.data;
};

export const uploadDataset = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/dataset/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const retrainModel = async () => {
    const res = await axios.post(`${API_URL}/dataset/retrain`);
    return res.data;
};

export const predictNewEmployee = async (data) => {
    const res = await axios.post(`${API_URL}/predict-new`, data);
    return res.data;
};

export const getDatasetSchema = async () => {
    const res = await axios.get(`${API_URL}/dataset/schema`);
    return res.data.data;
};
export const predictExistingEmployee = async (id) => {
    const res = await axios.post(`${API_URL}/predict/${id}`);
    return res.data;
};

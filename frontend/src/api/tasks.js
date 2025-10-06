import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location.reload();
      alert("Сессия истекла, пожалуйста перезайдите в аккаунт");
    }
    return Promise.reject(error);
  }
);

export const createTask = async (taskData) => {
  try {
    const formattedTask = {
      title: taskData.title,
      description: taskData.description || null,
      deadline: taskData.deadline || null,
      priority: taskData.priority || 2,
      is_completed: taskData.is_completed || false,
    };
    const token = localStorage.getItem("access_token");

    const response = await axios.post(`${API_URL}/tasks/`, formattedTask, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Task creation error:", JSON.stringify(error));
    throw error;
  }
};

export const editTask = async (taskData) => {
  try {
    const formattedTask = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description || null,
      deadline: taskData.deadline || null,
      priority: taskData.priority || 2,
      is_completed: taskData.is_completed || false,
    };
    console.log(formattedTask);
    const token = localStorage.getItem("access_token");

    const response = await axios.post(`${API_URL}/tasks/edit/`, formattedTask, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Task edit error:", JSON.stringify(error));
    throw error;
  }
}

export const getTasks = async () => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const response = await axios.get(`${API_URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
};

export const deleteTask = async (task) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.delete(`${API_URL}/tasks/${task.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Tasks delete error:", JSON.stringify(error));
    throw error;
  }
};

export const completeTask = async (taskId, newState) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `${API_URL}/tasks/complete/${taskId}/${newState}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Tasks complete error:", JSON.stringify(error));
    throw error;
  }
};

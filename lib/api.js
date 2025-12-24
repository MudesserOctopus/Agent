// API utility functions for making requests to backend endpoints

export const loginUser = async (email, password) => {
 
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Add more API functions here as needed
// export const getUsers = async () => { ... }
// export const createUser = async (userData) => { ... }
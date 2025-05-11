// Simple utility to debug environment variables

export const logEnvironment = () => {
  console.log('===== Environment Variables =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
  console.log('================================');
};

// Call this function in your app's entry point

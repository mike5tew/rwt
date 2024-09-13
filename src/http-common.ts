import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-type": "application/json",
  },
  
});

// the above code is causing an error
//Uncaught (in promise) AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
// the error is caused by the /files route not being defined in the server.js file
// the server.js file should be in the root directory of the project
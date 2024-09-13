import http from "../http-common";

//this function is used to upload a file to the server and returns the imageID of the uploaded file

interface tempResponse {
  fData: FormData;
  uploadType: string;
}

function upload(file: File, filename:string, eventID: number, width: number, height: number, caption: string, uploadType:string, onUploadProgress: any):Promise<any> {
  return new Promise<tempResponse>((resolve, reject) => {
  let formData = new FormData();
  let imageID: number;
  let tResp: tempResponse;
  formData.append("file", file);
  formData.append("eventID", eventID.toString());
  formData.append("caption", caption);  
  formData.append("width", width.toString());
  formData.append("height", height.toString());
  formData.append("filename", filename);
  tResp = {fData: formData, uploadType: uploadType};
  resolve(tResp);
  }
  )
}

function sendFile(tResp: tempResponse): Promise<any> {
return new Promise((resolve, reject) => {
  fetch(tResp.uploadType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tResp.fData)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    }
    )
  }
  )
}








const uploadMobile = async (file: File, eventID: number, onUploadProgress: any): Promise<any> => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("eventID", eventID.toString());
  try {
    const response = await http.post('http://localhost:3001/uploadMobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    });
    const result = response.data;
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}


const uploadLogo = (file: File, filename: string, width: number, height: number, onUploadProgress: any): Promise<any> => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("filename", filename);
  formData.append("eventID", "-1");
  formData.append("width", width.toString());
  formData.append("height", height.toString());
  formData.append("caption", "");
//the post function on the server will return the imageID of the uploaded logo
  return http.post("http://localhost:3001/uploadLogo/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

const upLoadBackground = (file: File, filename: string, width: number, height: number, onUploadProgress: any): Promise<any> => {

  let formData = new FormData();
  formData.append("file", file);
  formData.append("filename", filename);
  formData.append("eventID", "0");
  formData.append("width", width.toString());
  formData.append("height", height.toString());
  formData.append("caption", "");

  return http.post("/uploadBackground/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

const getFiles = () : Promise<any> => {
  return http.get("/files");
};



const FileUploadService = {
  upload,
  sendFile,
  uploadMobile,
  getFiles,
  uploadLogo,
  upLoadBackground
};

export default FileUploadService;

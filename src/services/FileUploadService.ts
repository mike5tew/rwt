// import http from "../http-common";

//this function is used to upload a file to the server and returns the imageID of the uploaded file
// import firebase from 'firebase/app';
// import 'firebase/storage';


// // Upload an image
// const storageRef = firebase.storage().ref();
// const fileRef = storageRef.child('images/myimage.jpg');

// fileRef.put(file).then((snapshot) => {
//   // Image uploaded successfully
//   const downloadURL = snapshot.ref.getDownloadURL();
//   console.log('Download URL:', downloadURL);
// });



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
  // save the file to the public/images/mobile folder
  return fetch("http://localhost:3001/uploadMobile/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    return error;
  });
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
  return fetch("http://localhost:3001/uploadLogo/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    return error;
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
  return fetch("http://localhost:3001/uploadBackground/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    return error;
  });

}


// const getFiles = () : Promise<any> => {
//   return http.get("/files");
// };



const FileUploadService = {
  upload,
  sendFile,
  uploadMobile,
//  getFiles,
  uploadLogo,
  upLoadBackground
};


//  1 | 'use strict'; How is this done?
//  2 | 

export default FileUploadService;

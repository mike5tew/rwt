

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
  formData.append("uploadType", uploadType.toString());
  tResp = {fData: formData, uploadType: uploadType};
  resolve(tResp);
  }
  )
}

function sendFile(tResp: tempResponse): Promise<any> {
return new Promise((resolve, reject) => {
  fetch('http://localhost:'+tResp.uploadType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tResp.fData)
    }).then((respon) => {
      return respon.json();
    }).then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    }
    )
  }
  )
}

    

const FileUploadService = {
  upload,
  sendFile,
};


export default FileUploadService;

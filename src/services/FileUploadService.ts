

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT;

function upload(file: File, filename: string, eventID: number, width: number, height: number, caption: string, onUploadProgress: any): Promise<any> {
  return new Promise<FormData>((resolve, reject) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("eventID", eventID.toString());
    formData.append("caption", caption);
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    formData.append("filename", filename);
    resolve(formData);
  }
  )
}


export function SendFile(tResp: FormData): Promise<any> {
  return new Promise((resolve, reject) => {
    // The server is returning an error stating that the Error retrieving the file: http: no such file
    // 
    fetch(`http://${url}:${port}/ImageFilePOST`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: tResp,
    }).then((respon) => {
      // Check if the response is OK and the content type is JSON
      const respCopy = respon.clone();
      if (!respCopy.ok) {
        throw new Error(`HTTP error! status: ${respCopy.status}`);
      }
      const contentType = respCopy.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return respCopy.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    }
    ).then((data) => {
      resolve(data);
    }).catch((error) => {
      console.error('Error:', error);
      reject(error);
    });
  }
  )
}

const FileUploadService = {
  upload,
  SendFile,
};


export default FileUploadService;

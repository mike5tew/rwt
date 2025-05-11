import { ImageDetail } from '../types/types.d';

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_PORT;

function upload(
    file: File,
    filename: string,
    eventID: number,
    width: number,
    height: number,
    caption: string,
    uploadType: string
): Promise<FormData> {
    return new Promise<FormData>((resolve) => {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("eventID", eventID.toString());
        formData.append("caption", caption);
        formData.append("uploadType", uploadType);
        formData.append("width", width.toString());
        formData.append("height", height.toString());
        formData.append("filename", filename);
        resolve(formData);
    });
}

export function SendFile(formData: FormData): Promise<ImageDetail> {
    return fetch(`${url}/ImageFilePOST`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            console.log("returned resp", response);
            return response.json() as Promise<ImageDetail>;
        } else {
            return response.text().then((text) => {
                throw new Error(`HTTP error! status: ${response.status} - ${text}`);
            });
        }
    });
}

const FileUploadService = {
    upload,
    SendFile,
};

export default FileUploadService;

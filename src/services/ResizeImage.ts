// cretae an interface for the file object
import { EmptyImageDetail, ImageDetail } from '../types/types.d';

export interface DatURLResponse {
    ReturnedFile: File;
    FileDetails: ImageDetail;
}
export function EmptyDatURLResponse(): DatURLResponse {
    return {
        ReturnedFile: new File([], ""),
        FileDetails: EmptyImageDetail()
    };
}

export function ResizeImage(originalImage: File, newWidth: number, eventID: number) {
    return new Promise<DatURLResponse>((resolve, reject) => {
        const reader = new FileReader();
        // set the prefix for the filename based on the newWidth
        reader.readAsDataURL(originalImage);
        var prefix = ""; 
        switch (newWidth) {
            case 100:
                prefix = "thumb_";
                break;
            case 250:
                prefix = "mb";
                break;
            case 450:
                prefix = "dt";
                break;
            default:
                prefix = "bg";
        }

        // Add error handling for FileReader
        reader.onerror = function (errorEvent) {
            console.error('Error reading file:', errorEvent);
            reject(errorEvent);
        };

        // the reader onload event is triggered when the file is loaded 
        reader.onload = function (readerEvent) {
            // load the image from the file
            //console.log('readerEvent.target?.result: ' + readerEvent.target?.result);
            var img = new Image();

            img.src = readerEvent.target?.result as string;
            img.onload = () => {
//                console.log('img.naturalWidth: ' + img.naturalWidth);
                var canvas = document.createElement('canvas');
                if (img.width < 250) {
                    reject(originalImage);
                }
                canvas.width = newWidth;
                let newHeight = newWidth * img.naturalHeight / img.naturalWidth;
                // round the height to the nearest whole number
                newHeight = Math.round(newHeight);
                canvas.height = newHeight;
                var filename = originalImage.name;
                var filetype = originalImage.type;
                //                console.log('filename: ' + filename + ' filetype: ' + filetype);
                // draw the image to the canvas
                var ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                } else {
                    reject(new Error('Failed to get canvas context'));
                }
                // convert the canvas to a data URL
                const dataURL = canvas.toDataURL(filetype);
                if (!dataURL) {
                    reject(new Error('Failed to convert canvas to data URL'));
                }
                // is this an async function?
                const parts = dataURL.split(';base64,');
                    // get the content type
                    const contentType = parts[0].split(':')[1];
                    // window.atob decodes a base-64 encoded string
                    const raw = window.atob(parts[1]);
                
                    const rawLength = raw.length;
                    const uInt8Array = new Uint8Array(rawLength);
                
                    for (let i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i);
                    }
                    
                const datURL = EmptyDatURLResponse();
                const nFile = new File([uInt8Array], prefix+eventID+filename, { type: filetype });
                // validate the file
                if (!nFile) {
                    reject(new Error('Failed to create new file'));
                }
                datURL.ReturnedFile = nFile;
                
                datURL.FileDetails = EmptyImageDetail();
                datURL.FileDetails.ImageURL = dataURL;
                datURL.FileDetails.Filename = prefix+filename;
                datURL.FileDetails.Height = newHeight;
                datURL.FileDetails.Width = newWidth;
                datURL.FileDetails.Caption = '';
                datURL.FileDetails.Imagetype = 1;
                datURL.FileDetails.Rows = 1;
                if (newWidth > newHeight) {
                    datURL.FileDetails.Cols = 2;
                }
                else {
                    datURL.FileDetails.Cols = 1;
                }
                resolve(datURL);                
            };
        };
        // read the file as a data URL
//        reader.readAsDataURL(originalImage);  
              
    });
}


// function dataURLtoFile(datURL:DatURLResponse)  {
// return new Promise<DatURLResponse>((resolve, reject) => {
//      // we need to extract the file data from the file object
//     const data = (datURL.ReturnedFile as any).data;
//     //datURL.FileDetails.Caption = '';
//     if (data.indexOf(';base64,') === -1) {
//         // if the data is not base64 encoded, then it is a file object with raw data in the form of a string
//         // Is this string a BLOBs?
//         // 
//         // split the data into parts
//         const parts = data.split(',');
//         // get the content type
//         const contentType = parts[0].split(':')[1];
//         // get the raw data
//         const raw = parts[1];
//         // define a new object of type DatURLResponse
        
//         datURL.ReturnedFile = new File([raw], datURL.FileDetails.Filename, { type: contentType });
//         resolve(datURL);

//     }
//     // if the data is base64 encoded, then it is a string
//     const parts = data.split(';base64,');
//     // get the content type
//     const contentType = parts[0].split(':')[1];
//     // window.atob decodes a base-64 encoded string
//     const raw = window.atob(parts[1]);

//     const rawLength = raw.length;
//     const uInt8Array = new Uint8Array(rawLength);

//     for (let i = 0; i < rawLength; ++i) {
//         uInt8Array[i] = raw.charCodeAt(i);
//     }
//     datURL.ReturnedFile = new File([uInt8Array], datURL.FileDetails.Filename, { type: contentType });
//     resolve(datURL);
// }
// );
// }

function getSize(file: File) {
    return new Promise<ImageDetail>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (readerEvent) {
            var img = new Image();
            img.src = readerEvent.target?.result as string;
            img.onload = () => {
                var ImDet = EmptyImageDetail();
                ImDet.Filename = file.name;
                ImDet.Height = img.naturalHeight;
                ImDet.Width = img.naturalWidth;
                ImDet.Caption = '';
                ImDet.Imagetype = 1;
                ImDet.Rows = 1;
                ImDet.Cols = 1;
                resolve(ImDet);
            }
        }
        reader.readAsDataURL(file);
    }
    );
}


const FileResizeService = {
    ResizeImage,
//    dataURLtoFile,
    getSize
};
  
  export default FileResizeService;
  



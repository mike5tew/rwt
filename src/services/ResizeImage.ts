// create an interface for the file object
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

export function ResizeImage(originalImage: File, newWidth: number, eventID: number, imagetype: string): Promise<DatURLResponse> {
    return new Promise<DatURLResponse>((resolve, reject) => {
        const reader = new FileReader();
        // set the prefix for the filename based on the newWidth
        //console.log('originalImage.name: ' + originalImage.name, ' originalImage.width: ' + newWidth);
        reader.readAsDataURL(originalImage);
        // var prefix = ""; 
        // switch (newWidth) {
        //     case 100:
        //         prefix = "th";
        //         break;
        //     case 250:
        //         prefix = "mb";
        //         break;
        //     case 800:
        //         prefix = "dt";
        //         break;
        //     case 200:
        //         prefix = "lg";
        //         break;
        //     default:
        //         prefix = "bg";
        // }

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
                console.log('BEFORE initial width ' + img.naturalWidth, 'newwidth: ' + newWidth);
                var canvas = document.createElement('canvas');
                
                // these images can be very large, so we need to calculate the height based on the width
                // calculate the height based on the width
                // however they are also being display two accross on the screen so we should not resize if the width is less than 800
                let newHeight = 0;
                if (newWidth<img.naturalWidth && imagetype === "dt") {
                    newHeight = newWidth * img.naturalHeight / img.naturalWidth;
                    console.log('newWidth: ' + newWidth + ' img.naturalHeight: ' + img.naturalHeight + ' img.naturalWidth: ' + img.naturalWidth);
                    // round the height to the nearest whole number
                    newHeight = Math.round(newHeight);
                } else {
                    // if the image is smaller than the new width, then use the natural height
                    newHeight = img.naturalHeight;
                    newWidth = img.naturalWidth;
                    //console.log('newWidth2: ' + newWidth + ' img.naturalHeight2: ' + img.naturalHeight + ' img.naturalWidth2: ' + img.naturalWidth);

                }
                
                canvas.width = newWidth;
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
                const nFile = new File([uInt8Array], eventID+filename, { type: filetype });
                const objectURL = URL.createObjectURL(nFile); // Create an object URL for the resized image
                datURL.ReturnedFile = nFile;
                datURL.FileDetails.imageURL = objectURL; // Use the object URL for the resized image
                datURL.FileDetails.filename = filename;
                datURL.FileDetails.eventID = eventID;
                datURL.FileDetails.height = newHeight;
                datURL.FileDetails.width = newWidth;
                datURL.FileDetails.caption = '';
                datURL.FileDetails.imagetype = imagetype
                datURL.FileDetails.rows = 1;
                if (newWidth > newHeight) {
                    datURL.FileDetails.cols = 2;
                }
                else {
                    datURL.FileDetails.cols = 1;
                }
                resolve(datURL);                
            };
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        // read the file as a data URL
//        reader.readAsDataURL(originalImage);  
              
    });
}


function getSize(file: File) {
    return new Promise<ImageDetail>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (readerEvent) {
            var img = new Image();
            img.src = readerEvent.target?.result as string;
            img.onload = () => {
                var ImDet = EmptyImageDetail();
                ImDet.filename = file.name;
                ImDet.height = img.naturalHeight;
                ImDet.width = img.naturalWidth;
                ImDet.caption = '';
                ImDet.rows = 1;
                ImDet.cols = 1;
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




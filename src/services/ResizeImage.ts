// cretae an interface for the file object
import { DatURLResponse, EmptyDatURLResponse, EmptyImageDetail, ImageDetail } from '../types/types.d';

function resizeImage(originalImage: File, newWidth: number) {
    return new Promise<DatURLResponse>((resolve, reject) => {
    const reader = new FileReader();
// the reader onload event is triggered when the file is loaded        
    reader.onload = function (readerEvent) {
        // load the image from the file
        var img = new Image();
        img.src = readerEvent.target?.result as string;
        img.onload = () => {
            var canvas = document.createElement('canvas');
            if (img.width < 250) {
                reject(originalImage);
            }
            canvas.width = newWidth;
            const newHeight = newWidth * img.naturalHeight / img.naturalWidth;
            canvas.height = newHeight;
            var filename = originalImage.name;
            var filetype = originalImage.type;

            // draw the image to the canvas
            var ctx = canvas.getContext("2d");
            if (!ctx) {
                alert('no context');
                reject(originalImage);
            } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, newWidth, newHeight);
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            // console.log('resized image width:' + newWidth + ' height:' + newHeight + ' filename:' + filename + ' filetype:' + filetype);

            let dURL = EmptyDatURLResponse();
            dURL.returnedFile = new File([], filename, { type: filetype });
            let ImDet = EmptyImageDetail();
            ImDet.filename = filename;
            ImDet.height = newHeight;
            ImDet.width = newWidth;
            ImDet.caption = canvas.toDataURL(filetype)
            ImDet.imagetype = 1;
            ImDet.rows = 1;
            ImDet.cols = 1;
            dURL.fileDetails = ImDet;
            
            resolve(dURL);
        }
    }
    reader.readAsDataURL(originalImage);
}
}
);
}

// this function converts a dataURL from the imageresize function to a file object

function dataURLtoFile(datURL:DatURLResponse)  {
return new Promise<DatURLResponse>((resolve, reject) => {
     
    const data = datURL.fileDetails.caption;
    datURL.fileDetails.caption = '';
    if (data.indexOf(';base64,') === -1) {
        // if the data is not base64 encoded, then it is a file object
        // split the data into parts
        const parts = data.split(',');
        // get the content type
        const contentType = parts[0].split(':')[1];
        // get the raw data
        const raw = parts[1];
        // define a new object of type DatURLResponse
        
        datURL.returnedFile = new File([raw], datURL.fileDetails.filename, { type: contentType });
        resolve(datURL);

    }
    // if the data is base64 encoded, then it is a string
    const parts = data.split(';base64,');
    // get the content type
    const contentType = parts[0].split(':')[1];
    // window.atob decodes a base-64 encoded string
    const raw = window.atob(parts[1]);

    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    datURL.returnedFile = new File([uInt8Array], datURL.fileDetails.filename, { type: contentType });
    resolve(datURL);
}
);
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
                ImDet.imagetype = 1;
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
    resizeImage,
    dataURLtoFile,
    getSize
};
  
  export default FileResizeService;
  



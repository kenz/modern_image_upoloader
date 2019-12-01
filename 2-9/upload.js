const imageFileField = document.getElementById("image_file");
const uploadList = document.getElementById("upload_list");
const imageFileLabel = document.getElementById("image_file_label");
imageFileField.addEventListener("change", event => {
    const files = imageFileField.files;
    Array.from(files).forEach(file => {
        fileUpload(file);
    });
});

function fileUpload(file) {
    Promise.resolve(file)
        .then(loadImage)
        .then(resize)
        .then(blob => {
            return Promise.all([showPreview(blob), fetch("/api/upload.py", { method: "POST", body: blob })]);
        })
        .then(showResult)
        .catch(showResult);
}

function loadImage(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = element => {
            const img = new Image();
            img.onload = () => {
                resolve({ img: img, filetype: file.type });
            };
            img.src = element.target.result;
        };
        reader.readAsDataURL(file);
    });
}
const MAX_SIZE = 1200;
const JPEG_QUALITY = 0.6;

function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gim, "");
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
const TO_RADIANS = Math.PI / 180;

function resize(loadedImage) {
    const img = loadedImage["img"];
    return new Promise(resolve => {
        var arrayBuffer = base64ToArrayBuffer(img.src);
        const exif = EXIF.readFromBinaryFile(arrayBuffer);
        if (exif && exif.Orientation) {
            switch (exif.Orientation) {
                case 3:
                case 4:
                    rotate = 180;
                    break;
                case 6:
                case 5:
                    rotate = 90;
                    break;
                case 8:
                case 7:
                    rotate = -90;
                    break;
                default:
                    rotate = 0;
            }
        } else {
            rotate = 0;
        }
        var resizedWidth;
        var resizedHeight;
        if (MAX_SIZE > img.width && MAX_SIZE > img.height) {
            resizedWidth = img.width;
            resizedHeight = img.height;
        } else if (img.width > img.height) {
            // 横長の画像は横のサイズを指定値にあわせる
            const ratio = img.height / img.width;
            resizedWidth = MAX_SIZE;
            resizedHeight = MAX_SIZE * ratio;
        } else {
            // 縦長の画像は縦のサイズを指定値にあわせる
            const ratio = img.width / img.height;
            resizedWidth = MAX_SIZE * ratio;
            resizedHeight = MAX_SIZE;
        }
        const canvas = document.createElement("canvas");
        if (rotate == 90 || rotate == -90) {
            canvas.height = resizedWidth;
            canvas.width = resizedHeight;
        } else {
            canvas.width = resizedWidth;
            canvas.height = resizedHeight;
        }
        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotate * TO_RADIANS);
        ctx.translate(-resizedWidth / 2, -resizedHeight / 2);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizedWidth, resizedHeight);
        var quality;
        const filetype = loadedImage["filetype"];
        if (filetype == "image/jpeg") {
            quality = JPEG_QUALITY;
        } else {
            quality = 1;
        }
        canvas.toBlob(
            blob => {
                resolve(blob);
            },
            filetype,
            quality
        );
    });
}

function showPreview(blob) {
    return new Promise(resolve => {
        const dataUrl = URL.createObjectURL(blob);
        const frame = document.createElement("div");
        const image = new Image();
        image.src = dataUrl;
        frame.classList.add("working");
        frame.append(image);
        uploadList.insertBefore(frame, imageFileLabel.nextSibling);
        resolve(frame);
    });
}

function showResult(result) {
    return new Promise(resolve => {
        console.log(result[1]);
        result[0].classList.remove("working");
    });
}
uploadList.addEventListener("dragover", event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    uploadList.classList.add("dragover");
});
uploadList.addEventListener("dragleave", event => {
    event.preventDefault();
    uploadList.classList.remove("dragover");
});
uploadList.addEventListener("drop", event => {
    event.preventDefault();
    uploadList.classList.remove("dragover");
    Array.from(event.dataTransfer.files).forEach(file => {
        fileUpload(file);
    });
});
const imageFileField = document.getElementById("image_file");
const uploadList = document.getElementById("upload_list");
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

function resize(loadedImage) {
  return new Promise(resolve => {
    const img = loadedImage["img"];
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
    canvas.width = resizedWidth;
    canvas.height = resizedHeight;
    const ctx = canvas.getContext("2d");
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
    uploadList.append(frame);
    resolve(frame);
  });
}

function showResult(result) {
  return new Promise(resolve => {
    console.log(result[1]);
    result[0].classList.remove("working");
  });
}

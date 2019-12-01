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
    .then(dataUrl => {
      return Promise.all([showPreview(dataUrl), fetch("/api/upload.py", { method: "POST", body: file })]);
    })
    .then(showResult)
    .catch(showResult);
}

function loadImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = element => {
      resolve(element.target.result);
    };
    reader.readAsDataURL(file);
  });
}

function showPreview(dataUrl) {
  return new Promise(resolve => {
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

const imageFileField = document.getElementById("image_file");
imageFileField.addEventListener("change", event => {
  const files = imageFileField.files;
  Array.from(files).forEach(file => {
    fileUpload(file);
  });
});

function fileUpload(file) {
  Promise.resolve(file)
    .then(fetch("/api/upload.py", { method: "POST", body: file }))
    .then(showResult)
    .catch(showResult);
}

function showResult(result) {
  return new Promise(resolve => {
    console.log(result);
  });
}

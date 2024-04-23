import React, { useState } from "react";
import CustomButton from "./Button";

function FileUpload2({ onFileChange }) {
  const [file, setFile] = useState("");

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      // console.log('Error: ', error)
    };
  };
  const handleFileSelection = (event) => {
    if (event.target.files[0]) {
      getBase64(event.target.files[0], (result) => {
        setFile(event.target.files[0]);
        onFileChange(event.target.files[0]);
      });
    }
  };
  return (
    <div className="position-relative">
      <input type="file" onChange={(event) => handleFileSelection(event)} className="form-control" />
      <CustomButton isLink extraClass="position-absolute start-0 top-0 h-100 text-uppercase rounded-0" noIcon btnName="Browse" />
    </div>
  );
}

export default FileUpload2;

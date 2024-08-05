import React, { useState, useEffect, useRef } from "react";
import "./profile.css";
import profile1 from "../assets/profile1.png";
import webflow from "../assets/Logo.png";
import uploadIcon from "../assets/Thumbnail Icons.png";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { centerCrop, convertToPercentCrop, makeAspectCrop } from "react-image-crop";
import setCanvasPreview from "../../canvasPreview";
import './profile.css';


export function Profile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [profile, setProfile] = useState(profile1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [error, setError] = useState(false);
  const [crop, setCrop] = useState();
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const MIN_DIMENSION = 160;

  const onDrop = (acceptedFiles) => {
    if (selectedFiles.length + acceptedFiles.length > 5) {
      setError(true);
      return;
    }
    setError(false);
    setSelectedFiles([
      ...selectedFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  const handleCropImage = (index) => {
    setSelectedImageForCrop(selectedFiles[index].preview);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleDelete = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    setError(false);
  };

  const handleRadioChange = (index) => {
    setSelectedImageIndex(index);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
    maxFiles: 5,
  });

  const updateProfilePicture = () => {
    if (selectedImageIndex !== null) {
      setProfile(selectedFiles[selectedImageIndex].preview);
    }
  };

  useEffect(() => {
    return () => {
      // Revoke Object URLs to free up memory
      selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  return (
    <div className="profile-card">
      <div className="profile-details">
        <div className="profile-image" id="myprofile">
          <img src={profile} alt="Profile" />
          <div className="button-container">
            <button
              className="update-button"
              data-toggle="modal"
              data-target="#uploadModal"
            >
              Update picture
            </button>
          </div>
        </div>
        <div className="profile-info">
          <h2>Jack Smith</h2>
          <p className="profile-text">
            @kingjack &nbsp;<span className="dot">•</span>&nbsp; Senior Product
            Designer at &nbsp;
            <img src={webflow} alt="Webflow" />{" "}
            <span className="company">Webflow</span>
            &nbsp;<span className="dot">•</span>&nbsp; He/Him
          </p>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="uploadModal"
        tabIndex="-1"
        aria-labelledby="uploadModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content custom-modal-content">
            <div className="d-flex flex-column text-start">
              <div className="d-flex justify-content-between">
                <h3 className="modal-title" id="uploadModalLabel">
                  Upload image(s)
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" className="fs-1">
                    &times;
                  </span>
                </button>
              </div>
              <div>
                <p className="title-sub">You may upload up to 5 images</p>
              </div>
            </div>
            <div
              {...getRootProps({
                className: `upload-container ${isDragActive ? "drag-over" : ""}`,
              })}
            >
              <input {...getInputProps()} className="image-container" />
              {!isDragActive && !error && (
                <>
                  <img src={uploadIcon} alt="Upload" width={48} height={48} />
                  <p className="upload-main">
                    Click or drag and drop to upload
                  </p>
                  <p className="upload-sub">PNG, or JPG (Max 5MB)</p>
                </>
              )}
              {isDragActive && !error && (
                <>
                  <img src={uploadIcon} alt="Upload" width={48} height={48} />
                  <p className="upload-main">Drop your files here</p>
                  <p className="upload-sub">PNG, or JPG (Max 5MB)</p>
                </>
              )}
              {error && (
                <div className="error-message">
                  <h2 className="text-danger fs-2">
                    You've reached the image limit
                  </h2>{" "}
                  <br />
                  <p className="fs-5" style={{ color: "#171717" }}>
                    Remove one or more to upload more images.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4">
              {selectedFiles.map((file, index) => {
                const isFileTooLarge = file.size > 5 * 1024 * 1024;
                const isSupportedFormat = ["image/jpeg", "image/png"].includes(file.type);

                return (
                  <div key={index} className="d-flex justify-content-between w-100 mb-4">
                    <div className="uploaded-image-wrapper">
                      <img src={file.preview} alt={file.name} className="uploaded-image-preview" />
                      <div className="d-flex flex-column justify-content-between ms-4">
                        <div className="d-flex flex-column">
                          <span className="uploaded-image-name mb-2">{file.name}</span>
                          <span className="uploaded-image-size">
                            {file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(2)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                          </span>
                        </div>
                        {isFileTooLarge ? (
                          <div className="text-start d-flex" id="error-container">
                            <p className="text-danger">
                              This image is larger than 5MB. Please select a smaller image.
                            </p>
                            <button className="btn btn-close fs-6 mt-3 ms-3" onClick={() => handleDelete(index)}></button>
                          </div>
                        ) : !isSupportedFormat ? (
                          <div className="text-start d-flex" id="error-container">
                            <p className="text-danger">
                              The file format of {file.name} is not supported. Please upload an
                              image in one of the following formats: JPG or PNG.
                            </p>
                            <button className="btn btn-close fs-6 mt-3 ms-3" onClick={() => handleDelete(index)}></button>
                          </div>
                        ) : (
                          <div className="text-start" id="cropdelete-container">
                            <button
                              className="light-button"
                              id="crop-image"
                              data-toggle="modal"
                              data-target="#cropModal"
                              data-dismiss="modal"
                              onClick={() => handleCropImage(index)}
                            >
                              <span className="bi bi-crop me-2"></span>Crop
                            </button>
                            <button
                              className="light-button"
                              id="delete-image"
                              onClick={() => handleDelete(index)}
                            >
                              <span className="bi bi-trash me-2"></span>Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      className="form-check-input align-self-center"
                      name="profile"
                      value={index}
                      onChange={() => handleRadioChange(index)}
                      checked={selectedImageIndex === index}
                      disabled={isFileTooLarge || !isSupportedFormat}
                    />
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="update-button mt-4"
                data-dismiss="modal"
                aria-label="Close"
                onClick={updateProfilePicture}
              >
                Update picture
              </button>
              <button
                className="cancel-button mt-4"
                data-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      <div
        className="modal fade"
        id="cropModal"
        tabIndex="-1"
        aria-labelledby="cropModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content custom-modal-content">
            <div className="d-flex flex-column text-start">
              <div className="d-flex justify-content-between">
                <h3 className="modal-title" id="cropModalLabel">
                  Crop image
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" className="fs-1">
                    &times;
                  </span>
                </button>
              </div>
            </div>
            <div className="crop-container">
              {selectedImageForCrop && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCrop(c)}
                  aspect={1}
                >
                  <img
                    ref={imgRef}
                    alt="Crop"
                    src={selectedImageForCrop}
                    style={{ transform: 'scale(1)' }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="update-button mt-4"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  if (crop?.width && crop?.height && imgRef.current) {
                    setCanvasPreview(imgRef.current, previewCanvasRef.current, crop);
                  }
                }}
              >
                Apply crop
              </button>
              <button
                className="cancel-button mt-4"
                data-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

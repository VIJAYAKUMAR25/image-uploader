import React, { useState ,useEffect} from "react";
import "./profile.css";
import profile1 from "../assets/profile1.png";
import webflow from "../assets/Logo.png";
import uploadIcon from "../assets/Thumbnail Icons.png";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";

export function Profile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [profile, setProfile] = useState(profile1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [error, setError] = useState(false);

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
          <img src={profile} alt="Profile"  />
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
                className: `upload-container ${
                  isDragActive ? "drag-over" : ""
                }`,
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
                                            >
                                                <span className="bi bi-crop me-2"></span> Crop image
                                            </button>{" "}
                                            &nbsp;&nbsp;
                                            <button className="light-button" onClick={() => handleDelete(index)}>
                                                <span className="bi bi-trash"></span> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!isFileTooLarge && isSupportedFormat && (
                                <input
                                    type="radio"
                                    className="radio-button mb-5"
                                    name="selectedImage"
                                    id={`selectedImage${index}`}
                                    checked={selectedImageIndex === index}
                                    onChange={() => handleRadioChange(index)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>


            {selectedFiles.length > 0 && (
              <div className="upload-btncontainer d-flex justify-content-between mt-2">
                <button
                  className="upload-cancel"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="upload-select"
                  disabled={selectedImageIndex === null}
                  onClick={updateProfilePicture}
                  data-dismiss="modal"
                >
                  <span>Select image</span>
                </button>
              </div>
            )}
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
        <div className="modal-dialog modal-sm custom-modal-width modal-dialog-centered">
          <div className="modal-content custom-modal-content">
            <div className="d-flex flex-column text-start">
              <div className="d-flex justify-content-between">
                <h3 className="modal-title mb-2" id="cropModalLabel">
                  Crop your picture
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
                <img src={webflow} width={260} height={200} alt="" />
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="crop-button"
                    data-toggle="modal"
                    data-target="#uploadModal"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    className="crop-button"
                    style={{ background: "#4338CA", color: "#FFFFFF" }}
                    data-dismiss="modal"
                  >
                    <span>Confirm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

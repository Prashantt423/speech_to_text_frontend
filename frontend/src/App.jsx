import "./App.css";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { FileUploader } from "react-drag-drop-files";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { setRef } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import storage from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import LinearProgress from "@mui/material/LinearProgress";
function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFile([null]);
    setResult("");
  };
  const handleCloseForTranscription = () => {
    setIsModalOpen(false);
    setFocusedTranscription("");
  };
  const [file, setFile] = React.useState(null);
  const [isButtonDiabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [outputs, setOutputs] = useState(null);
  const [focusedTranscription, setFocusedTranscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isUploading, setIsUplaoding] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Prashant",
      duration: 34,
      dateCreated: "26/11/2002",
      lastUpdated: "26/11/2005",
      type: "audio/mp3",
      Action: "action",
    },
  ]);
  const handleDrop = (e) => {
    console.log(e);
    setFile(e[0]);
  };

  const fetchAll = async () => {
    try {
      const res = await axios.get(
        "https://speech-text-api-u3m1.onrender.com/api"
      );
      if (res.status === 200) {
        setOutputs(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let t = outputs?.map((d) => ({
      id: d._id,
      name: d.name,
      Type: d.type,
      Duration: 35,
      dateCreated: d.dateCreated.split("T")[0],
      lastUpdated: d.lastUpdated.split("T")[0],
      Action: "Action",
      transcription: d.transcription,
    }));
    if (t) setRows(t);
  }, [outputs]);

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    if (file) {
      setIsButtonDisabled(false);
    }
  }, [file]);

  const handleSubmitOrUpload = async () => {
    console.log(url);
    try {
      setIsLoading(true);
      if (Boolean(file) && !Boolean(url)) {
        upload(file);
      }
      if (Boolean(url)) {
        const res = await axios.post(
          "https://speech-text-api-u3m1.onrender.com/api/transcribe",
          {
            firebaseStorageURL: url,
          }
        );
        if (res.status == 200) {
          setResult(res.data);
          fetchAll();
        }
        console.log(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };
  const columns = [
    { field: "name", headerName: "Name", width: 90 },
    {
      field: "Type",
      headerName: "Type",
      width: 150,
      editable: true,
    },
    {
      field: "Duration",
      headerName: "Duration",
      width: 150,
      editable: true,
    },
    {
      field: "dateCreated",
      headerName: "Date Created",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "Action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <button
              style={{
                background: "#0048AD",
                borderRadius: "0.125rem",
                padding: "0.525rem",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsModalOpen(true);
                console.log(params.row);
                setFocusedTranscription(params.row.transcription);
              }}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  function DataGridDemo() {
    return (
      <Box
        sx={{
          height: 400,
          width: "100%",
          background: "white",
          padding: "1rem",
        }}
      >
        <h3>Recent Files</h3>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    );
  }

  const fileTypes = [
    "MP3",
    "M4A",
    "WAV",
    "CAF",
    "AVI",
    "RMVB",
    "FLV",
    "WMV",
    "MOV",
    "WMA",
  ];

  const upload = (file) => {
    if (!file) {
      alert("Please choose a file first!");
    }
    setIsUplaoding(true);
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(percent);
        setProgressPercentage(percent);
      },
      (err) => {
        console.log(err);
        setIsUplaoding(false);
      },
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setUrl(url);
          setIsUplaoding(false);
        });
      }
    );
  };

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };
  return (
    <>
      <div className="app">
        <Sidebar />

        <div className="body">
          <Topbar />
          <div
            style={{
              marginTop: "55px",
              background: "#F9FAFB",
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  Welcome Sairat
                </span>
                <span
                  style={{
                    color: "#475367",
                    fontWeight: "400",
                  }}
                >
                  upload your audio and Video to convert to text
                </span>
              </div>
              <button
                onClick={handleOpen}
                style={{
                  background: "#0048AD",
                  borderRadius: "0.125rem",
                  padding: "0.525rem",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Transcribe File
              </button>
            </div>
            <br />
            <div className="cards">
              <div className="card">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid #E4E7EC",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="icon / folder">
                      <path
                        id="icon"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.63909 2.5C2.99746 2.5 1.66666 3.8308 1.66666 5.47243V14.1667C1.66666 16.0076 3.15904 17.5 4.99999 17.5H15C16.8409 17.5 18.3333 16.0076 18.3333 14.1667V8.5C18.3333 6.65955 16.8426 5.16667 15.0011 5.16667H10.3329C10.3187 5.1603 10.3014 5.15222 10.282 5.1423C10.2417 5.12178 10.2025 5.09927 10.1714 5.07964C10.1572 5.07067 10.1471 5.06377 10.1409 5.05943C10.0248 4.95563 9.85538 4.7775 9.62055 4.52691L9.57476 4.47802C9.35705 4.24558 9.10291 3.97424 8.84147 3.71696C8.56416 3.44405 8.25358 3.16171 7.94039 2.94299C7.65777 2.7456 7.23628 2.5 6.76196 2.5H4.63909ZM8.4044 5.66654C8.62519 5.90215 8.85866 6.15095 9.04822 6.31802C9.18294 6.43675 9.37492 6.5507 9.52544 6.62738C9.60921 6.67005 9.70662 6.71477 9.80728 6.75086C9.88794 6.77978 10.0505 6.83333 10.2372 6.83333H15.0011C15.9211 6.83333 16.6667 7.57903 16.6667 8.5V14.1667C16.6667 15.0871 15.9205 15.8333 15 15.8333H4.99999C4.07952 15.8333 3.33332 15.0871 3.33332 14.1667V5.47243C3.33332 4.75128 3.91793 4.16667 4.63909 4.16667H6.73673C6.73747 4.16723 6.73999 4.16825 6.74435 4.17003C6.76793 4.17961 6.84527 4.21105 6.98609 4.3094C7.18575 4.44884 7.41882 4.65529 7.67244 4.90487C7.90868 5.13736 8.14106 5.38542 8.3631 5.62245L8.4044 5.66654Z"
                        fill="black"
                      />
                    </g>
                  </svg>
                </div>
                <br />
                <span style={{ fontWeight: "700" }}>50</span>
                <span style={{ fontSize: "smaller", marginTop: "0.5rem" }}>
                  Transcribed
                </span>
              </div>
              <div className="card">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid #E4E7EC",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="icon / text">
                      <path
                        id="Vector 737"
                        d="M2.50003 5V4.5C2.50003 3.39543 3.39546 2.5 4.50003 2.5H10M17.5 5V4.5C17.5 3.39543 16.6046 2.5 15.5 2.5H10M10 2.5V17.5M11.6667 17.5H8.33336"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </div>
                <br />
                <span style={{ fontWeight: "700" }}>20</span>
                <span style={{ fontSize: "smaller", marginTop: "0.5rem" }}>
                  Saved
                </span>
              </div>
              <div className="card">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid #E4E7EC",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="icon / bookmark">
                      <path
                        id="icon"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.19048 0.833344C4.18228 0.833344 2.5 2.40869 2.5 4.41773V16.4957C2.5 19.0964 5.82609 20.0813 7.38988 18.1453L9.52061 15.5076C9.75901 15.2124 10.241 15.2124 10.4794 15.5076L12.6101 18.1453C14.1739 20.0813 17.5 19.0964 17.5 16.4957V4.41773C17.5 2.40869 15.8177 0.833344 13.8095 0.833344H6.19048ZM4.16667 4.41773C4.16667 3.38804 5.04276 2.50001 6.19048 2.50001H13.8095C14.9572 2.50001 15.8333 3.38804 15.8333 4.41773V16.4957C15.8333 17.3876 14.5698 17.919 13.9066 17.0981L11.7759 14.4603C10.8704 13.3393 9.12958 13.3393 8.22409 14.4603L6.09336 17.0981C5.43023 17.919 4.16667 17.3876 4.16667 16.4957V4.41773Z"
                        fill="#4D4D4D"
                      />
                    </g>
                  </svg>
                </div>
                <br />
                <span style={{ fontWeight: "700" }}>100</span>
                <span style={{ fontSize: "smaller", marginTop: "0.5rem" }}>
                  Uploaded files
                </span>
              </div>
            </div>
            <br />
            <DataGridDemo />
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {isLoading ? (
              <CircularProgress disableShrink />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Transcribe File
                  </Typography>
                  <CloseOutlinedIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleClose}
                  />
                </div>
                <br />

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Transcription Language
                </Typography>
                <select
                  style={{
                    width: "100%",
                    border: "1px solid #D0D5DD",
                    padding: "0.5rem",
                  }}
                  name="languages"
                  id="languages"
                >
                  <option value="Default">Default</option>
                </select>
                <br />
                <br />
                <br />
                <br />
                <Dropzone onDrop={handleDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      style={{
                        border: "1px dashed #D0D5DD",
                        height: "250px",
                      }}
                    >
                      <input {...getInputProps()} />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <br />
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "#E0EDFF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img src="/upload-cloud-02.svg" alt="" />
                        </div>
                        <br />
                        <div>
                          <span style={{ color: "blue" }}>Click to upload</span>{" "}
                          a or drag and drop
                        </div>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                              color: "#98A2B3",
                              textAlign: "center",
                            }}
                          >
                            The maximum file size is 1GB for audio and 10GB for
                            videos. Supported formats: mp3, mp4, wav, caf, aiff,
                            avi, rmvb, flv, m4a, mov, wmv, wma
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>

                <br />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Import from Link
                </Typography>
                <input
                  style={{
                    width: "95%",
                    borderRadius: "0.225rem",
                    border: "1px solid #D0D5DD",
                    padding: "0.7rem",
                  }}
                  type="text"
                  placeholder="Paste a Drobpox, Google Drive or Youtube URL here"
                />
                <br />
                <br />
                {Boolean(result) && (
                  <>
                    <h3>Transcription Result:</h3>
                    <span>{result}</span>
                    <br />
                    <br />
                  </>
                )}
                {Boolean(file) && <>{file.name}</>}

                <button
                  disabled={!Boolean(url) && !Boolean(file)}
                  onClick={handleSubmitOrUpload}
                  style={{
                    background:
                      Boolean(url) || Boolean(file) ? "#0048AD" : "#D0D5DD",
                    borderRadius: "0.125rem",
                    padding: "0.525rem",
                    color: "white",
                    border: "none",
                    width: "100%",
                  }}
                >
                  {Boolean(url) ? "Transcribe file" : "Update file"}
                </button>
                {Boolean(isUploading) && (
                  <CircularProgressWithLabel value={progressPercentage} />
                )}
                {Boolean(url) && (
                  <>
                    {" "}
                    <p>File uploaded successfully...click on Transcribe</p>{" "}
                  </>
                )}
              </>
            )}
          </Box>
        </Modal>
        <Modal
          open={isModalOpen}
          onClose={handleCloseForTranscription}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h3>Transcription:</h3>
            <p>{focusedTranscription}</p>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default App;

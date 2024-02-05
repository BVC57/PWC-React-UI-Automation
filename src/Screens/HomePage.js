import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [reload, setReload] = useState(false);
  return (
    <div className="Homepage">
      <div style={{ height: "2%", width: "100%" }}></div>
      <Upload setReload={setReload} reload={reload} />
      <Tablecontainer setReload={setReload} reload={reload} />
    </div>
  );
}

function Upload({ setReload, reload }) {
  const fileinputref = useRef(null);
  const posturl =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/upload_pdf";
  const [file, setFile] = useState(null);
  const [selectedoption, setSelectedOption] = useState("");
  const [block, setBlock] = useState("block");
  const pref = useRef(null);
  const uploadicon = "Icons/uploadicon.png";

  const handleDragEnter = (e) => {
    e.preventDefault();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    uploadhandler(e.dataTransfer.files[0]);
  };
  const openinputhandler = () => {
    fileinputref.current.click();
  };
  const hiddenuploadhandler = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    uploadhandler(selectedFile);
  };
  const uploadhandler = (file) => {
    console.log(file);
    pref.current.innerText = file.name;
    setBlock("none");
    setFile(file);
    setSelectedOption(filetypehanlder(file.name)[1]);
  };

  const filetypehanlder = (name) => {
    const regex = /@([^@]+)@/;
    return name.match(regex);
  };

  const uploadbtnhandle = async () => {
    if (file === null) {
      alert("Upload a File");
      return;
    }
    if (file.type !== "application/pdf") {
      alert("Only PDF Files are allowed");
      return;
    }

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: posturl,
      headers: {
        "Content-Type": file.type,
        "x-api-key": "doVk3aPq1i8Y5UPpnw3OO4a610LK2yFrahOpYEo0",
        filetype: selectedoption,
        customerid: "1",
      },
      data: file,
    };
    axios
      .request(config)
      .then((response) => {
        pref.current.innerText = "";
        setBlock("block");
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="Upload-Maindiv">
      <p>Upload File</p>
      <div className="Upload-Subdiv">
        <div
          className="DragDrop"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p ref={pref}></p>
          <p style={{ width: "100%", display: block }}>
            <img
              src={uploadicon}
              style={{ position: "relative", top: "4px" }}
            />{" "}
            Drag & Drop files in this or{" "}
            <span
              onClick={openinputhandler}
              style={{
                color: "rgba(217, 57, 84, 1)",
                cursor: "pointer",
              }}
            >
              Browse File
            </span>
          </p>
        </div>
        {/* Hidden file input from here */}
        <input
          type="file"
          ref={fileinputref}
          style={{ display: "none" }}
          onChange={hiddenuploadhandler}
        />
        {/* Hidden file input to here  */}
        <div className="Upload-btn" onClick={uploadbtnhandle}>
          <p style={{ margin: "0px" }}>Upload</p>
        </div>
        {/* <div
            className="Upload-btn"
            onClick={() => {
              setReload(!reload);
            }}
          >
            Refresh
          </div> */}
        <img
          src="Icons/refreshicon.png"
          alt="Refresh"
          style={{ cursor: "pointer", position: "absolute", right: "50px" }}
          onClick={() => {
            setReload(!reload);
          }}
        />
      </div>
    </div>
  );
}

function Tablecontainer({ setReload, reload }) {
  const nav = useNavigate();
  const deleteicon = "Icons/deleteicon.png";
  const pdficon = "Icons/pdficon.png";
  const jsonicon = "Icons/jsonicon.png";
  const editicon = "Icons/editicon.png";
  const tableapi =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/list_data";
  const filedownloadapi =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/download_data?";
  const deletefileapi =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/delete_data?uniqueid=";
  const [tableinfo, setTableInfo] = useState(null);
  const [rowperpage] = useState(20);
  const [rowlen, setRowLen] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const deletehandler = async (id) => {
    const deletelink = deletefileapi + id;
    try {
      const response = await axios.delete(deletelink, {
        headers: {
          "x-api-key": "doVk3aPq1i8Y5UPpnw3OO4a610LK2yFrahOpYEo0",
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
    setReload(!reload);
  };

  const downloadhandler = async (data) => {
    const downloadlink =
      filedownloadapi + "uniqueid=" + data.id + "&type=" + data.type;
    try {
      const response = await axios.get(downloadlink, {
        headers: {
          "x-api-key": "doVk3aPq1i8Y5UPpnw3OO4a610LK2yFrahOpYEo0",
          "Content-Type": "application/" + data.type,
        },
      });

      let resultfile;
      if (data.type === "pdf") {
        const decodestring = atob(response.data.body);
        const utf8decoder = new TextDecoder("utf-8");
        resultfile = utf8decoder.decode(
          new Uint8Array(
            decodestring.split("").map((char) => char.charCodeAt(0))
          )
        );
      } else if (data.type === "json") {
        resultfile = JSON.stringify(response, null, 2);
      }
      const blob = new Blob([resultfile], { type: "application/" + data.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.id + "." + data.type;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const fetchdata = async () => {
    try {
      const response = await axios.get(tableapi, {
        headers: {
          "x-api-key": "doVk3aPq1i8Y5UPpnw3OO4a610LK2yFrahOpYEo0",
          "Content-Type": "application/json",
        },
      });
      setRowLen(response.data.data.length);
      const sortedData = response.data.data
        .map((item) => ({
          ...item,
          Curr_date_time: new Date(item.Curr_date_time),
        }))
        .sort((a, b) => b.Curr_date_time - a.Curr_date_time);
      setTableInfo(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const indexoflastrow = currentpage * rowperpage;
  const indexoffirstrow = indexoflastrow - rowperpage;
  const paginate = (pageNumber) => {
    console.log(indexoffirstrow, indexoflastrow);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      fetchdata();
      setLoading(true);
    }, 2000);
  }, [reload]);
  return (
    <div className="Table-Maindiv">
      <div className="Table-div">
        <table>
          <thead>
            <th style={{ flex: 2 }}>Upload ID</th>
            <th style={{ flex: 4 }}>File Name</th>
            <th style={{ flex: 1 }}>File Type</th>
            <th style={{ flex: 1, minWidth: "8ch" }}>Status</th>
            <th style={{ flex: 2 }}>Loaded At</th>
            <th style={{ flex: 2 }}>Action</th>
          </thead>
          <tbody>
            {loading && tableinfo ? (
              tableinfo.slice(indexoffirstrow, indexoflastrow).map((d) => (
                <tr>
                  <td>{d.UniqueId || "ID"}</td>
                  <td>{d.File_name || "NULL"}</td>
                  <td>{d.File_type || "--"}</td>
                  <td>{d.Status || "Status"}</td>
                  <td>
                    {(
                      <div>
                        <p>{d.Curr_date_time.toString().slice(0, 15)}</p>
                        <p>
                          {d.Curr_date_time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    ) || "NULL"}
                  </td>
                  <td>
                    <div>
                      <button
                        title="Edit"
                        style={{
                          backgroundImage: `url(${editicon})`,
                        }}
                        onClick={() => {
                          nav(`/edit/${d.UniqueId}`);
                        }}
                      ></button>
                      <button
                        title="Delete"
                        style={{
                          backgroundImage: `url(${deleteicon})`,
                        }}
                        onClick={() => {
                          deletehandler(d.UniqueId);
                        }}
                      ></button>
                      <button
                        title="Download PDF"
                        style={{
                          backgroundImage: `url(${pdficon})`,
                        }}
                        onClick={() => {
                          downloadhandler({
                            id: d.UniqueId,
                            type: "pdf",
                          });
                        }}
                      ></button>
                      <button
                        title="Download JSON"
                        style={{
                          backgroundImage: `url(${jsonicon})`,
                        }}
                        onClick={() => {
                          downloadhandler({
                            id: d.UniqueId,
                            type: "json",
                          });
                        }}
                      ></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        postsPerPage={rowperpage}
        totalPosts={rowlen}
        currentpage={currentpage}
        indexoffirstrow={indexoffirstrow}
        indexoflastrow={indexoflastrow}
        paginate={paginate}
      />
    </div>
  );
}

export default HomePage;

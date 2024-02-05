import { click } from "@testing-library/user-event/dist/click";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";

function EditPage() {
  const { id } = useParams();
  const [clicked, setClicked] = useState(false);
  const reuploadapi =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/reupload_json";
  const uploadjsonhandle = async (jsoncontent) => {
    setClicked(!clicked);
    // jsoncontent = JSON.parse(jsoncontent);
    try {
      jsoncontent = JSON.parse(jsoncontent);
      const d = { uniqueid: id, data: jsoncontent.data };
      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: reuploadapi,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(d),
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response);
          alert("success");
        })
        .catch((error) => {
          console.log(error);
          alert("error");
        });
    } catch (error) {
      alert("Wrong JSON Format");
    }
  };
  return (
    <div className="Chatpage">
      <Section2 id={id} clicked={clicked} uploadjsonhandle={uploadjsonhandle} />
      <button
        className="Upload-btn"
        style={{ borderStyle: "none", marginTop: "1%" }}
        onClick={() => {
          setClicked(!clicked);
        }}
      >
        Save JSON
      </button>
    </div>
  );
}

function Section2({ id, clicked, uploadjsonhandle }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [newjsonFile, setNewJsonFile] = useState(null);
  const [numPages, setNumPages] = useState();
  const preref = useRef(null);
  const containerRef = useRef(null);
  const filedownloadapi =
    "https://pyrtqap426.execute-api.ap-south-1.amazonaws.com/navigate-pdf-parser/download_data?";
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(numPages);
    setNumPages(numPages);
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
        const blob = new Blob([resultfile], {
          type: "application/" + data.type,
        });
        const pdfurl = URL.createObjectURL(blob);
        setPdfFile(pdfurl);
      } else if (data.type === "json") {
        resultfile = JSON.stringify(response.data, null, 2);
        setJsonFile(resultfile);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // const jsonchangehandle = (e) => {
  //   // console.log(e.target.innerText);
  //   console.log("Change");
  // };

  useEffect(() => {
    if (id && !clicked) {
      downloadhandler({ id: id, type: "pdf" });
      downloadhandler({ id: id, type: "json" });
    }
    if (clicked) {
      uploadjsonhandle(preref.current.innerText);
      // console.log(preref.current.innerText);
    }
  }, [id, clicked]);

  const [pdfwidth, setPdfWidth] = useState(620);
  return (
    <div
      style={{
        width: "min(1290px, 90%)",
        height: "min(737px, 85%)",
        border: "1px solid lightgrey",
        display: "flex",
        flexDirection: "row",
        marginTop: "2%",
      }}
    >
      <div
        style={{
          flex: 1,
          border: "1px solid lightgrey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <p
            style={{
              alignSelf: "flex-start",
              fontFamily: "arial",
              fontWeight: "600",
              height: "20px",
            }}
          >
            PDF File
          </p>
          <div
            style={{
              width: "10%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{ width: "20px" }}
              onClick={() => {
                setPdfWidth(pdfwidth + 20);
              }}
            >
              +{/* <img src="Icons/zoominicon.png" /> */}
            </button>
            <button
              style={{ width: "20px" }}
              onClick={() => {
                setPdfWidth(pdfwidth - 20);
              }}
            >
              -{/* <img src="Icons/zoomouticon.png" /> */}
            </button>
          </div>
        </div>
        <div
          ref={containerRef}
          style={{
            overflowY: "scroll",
            overflowX: "auto",
            height: "95%",
            width: "100%",
          }}
        >
          {pdfFile && (
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from({ length: numPages }, (_, index) => (
                <Page key={index + 1} pageNumber={index + 1} width={pdfwidth} />
              ))}
            </Document>
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          border: "1px solid lightgrey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            alignSelf: "flex-start",
            fontFamily: "arial",
            fontWeight: "600",
            height: "20px",
          }}
        >
          JSON
        </p>
        <div
          contentEditable={true}
          // onInput={jsonchangehandle}
          // onBlur={jsonchangehandle}
          style={{
            height: "95%",
            width: "100%",
            overflowY: "scroll",
          }}
        >
          {jsonFile && (
            <pre style={{ maxWidth: "100%", overflowX: "scroll" }} ref={preref}>
              {jsonFile}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
export default EditPage;

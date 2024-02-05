import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const nav = useNavigate();
  return (
    <div className="Sidebar">
      <p>V1.0</p>
      <div className="ComponentBtn">
        <img
          src="Icons/sidebtn.png"
          alt="Side Button"
          width="24px"
          height="24px"
        />
        <div>
          <button
            style={{ backgroundColor: "white", cursor: "pointer" }}
            onClick={() => {
              nav("/chat");
            }}
          >
            <img src="Icons/commenticon.png" />
          </button>
          <button
            style={{
              backgroundColor: "rgba(217, 57, 84, 1)",
              cursor: "pointer",
            }}
            onClick={() => {
              nav("/");
            }}
          >
            <img src="Icons/sideuploadicon.png" />
          </button>
          <button style={{ backgroundColor: "white", cursor: "pointer" }}>
            <img src="Icons/logouticon.png" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

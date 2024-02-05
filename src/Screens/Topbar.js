import React from "react";

function Topbar() {
  return (
    <div className="Topbar">
      <div>
        <img
          src="Icons/pwcicon.png"
          alt="Mobifly Icon"
          height="25px"
          width="33px"
        />
        <p>Navigate PDF Reader</p>
      </div>

      <div>
        <img
          src="Icons/adminicon.png"
          alt="admin"
          height="18px"
          width="18px"
        ></img>
        <p>Super Admin</p>
      </div>
    </div>
  );
}

export default Topbar;

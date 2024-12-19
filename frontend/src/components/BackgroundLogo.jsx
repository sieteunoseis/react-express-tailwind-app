import React from "react";

const BackgroundLogo = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
        <defs>
          <style>@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&amp;display=swap');</style>
        </defs>
        <text x="50%" y="65%" textAnchor="middle" fontFamily='"Permanent Marker", serif' fontSize="72px" fill="black">
          AB
        </text>
      </svg>
    </div>
  );
};

export default BackgroundLogo;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const goInbox = () => {
      setTimeout(() => {
        navigate("/inbox");
      }, 2000);
    };
    goInbox();
  }, []);
  return (
    <div className="h-screen grid  place-content-center w-screen">
      <div className="text-center">
        <img src="/logo.svg" alt="" className="w-24 mb-4" />
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
}

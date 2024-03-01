import { useEffect } from "react";
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
        <div className="w-24 h-28 mb-4 logoOnBack" />
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
}

// import { Card } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function RouteErrorPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div
      id="error-page"
      className="h-full w-full flex justify-center items-center"
    >
      {/* <Card className="!rounded-2xl p-8 text-center gap-6 m-3">
        <h1 className="text-rose-800 text-4xl font-semibold">
          404 - 找不到頁面
        </h1>
        <p>抱歉，您訪問的頁面不存在。</p>
        <Link to="/inbox">
          <div className="btn bg-rose-800 text-white font-normal">返回首頁</div>
        </Link>
      </Card> */}
    </div>
  );
}

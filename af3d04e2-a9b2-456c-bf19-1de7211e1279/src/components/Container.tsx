import { Outlet } from "react-router-dom";
export default function Container() {
  return (
    <div className="flex justify-start md:justify-center overflow-hidden h-screen">
      <Outlet></Outlet>
    </div>
  );
}

import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Container from "./components/Container";
import Home from "./pages/Home";
import Inbox from "./pages/Inbox";
import Trash from "./pages/Trash";
import RouteErrorPage from "./pages/route-error-page";
import theme from "./theme";
import "./App.css";
function App() {
  return (
    <ChakraProvider theme={theme}>
      <>
        <Routes>
          <Route path="/" element={<Container />}>
            <Route index element={<Home />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="inbox/:noticeID" element={<Inbox />} />
            <Route path="trash" element={<Trash />} />
            <Route path="trash/:noticeID" element={<Trash />} />
            {/* 404 頁面 */}
            <Route path="*" element={<RouteErrorPage />} />
          </Route>
        </Routes>
      </>
    </ChakraProvider>
  );
}

export default App;

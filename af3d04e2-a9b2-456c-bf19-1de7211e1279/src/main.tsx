import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </BrowserRouter>
);

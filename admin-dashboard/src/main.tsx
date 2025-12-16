import "./index.css";
import App from "./App.tsx";
import { store } from "./store";
import "swiper/swiper-bundle.css";
import { StrictMode } from "react";
import "flatpickr/dist/flatpickr.css";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Provider store={store}>
          <App />
        </Provider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
          style={{
            fontSize: "12px",
            zIndex: 2147483647,
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

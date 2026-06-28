import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { publicRoutes } from "./routes/Routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { TrelloProvider } from "./context/TrelloContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BackgroundPickerProvider } from "./context/BackgroundPickerContext";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <TrelloProvider>
          <ThemeProvider>
            <BackgroundPickerProvider>
              <Routes>
                {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  const Layout = route.layout || DefaultLayout;

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    />
                  );
                })}
              </Routes>
            </BackgroundPickerProvider>
          </ThemeProvider>
        </TrelloProvider>
      </Router>
    </>
  );
}

export default App;

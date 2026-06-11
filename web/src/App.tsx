import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/Routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { TrelloProvider } from "./context/TrelloContext";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  return (
    <Router>
      <TrelloProvider>
        <ThemeProvider>
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
        </ThemeProvider>
      </TrelloProvider>
    </Router>
  );
}

export default App;

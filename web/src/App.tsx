import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/Routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { TrelloProvider } from "./context/TrelloContext";

function App() {
  return (
    <Router>
      <TrelloProvider>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = DefaultLayout;

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
      </TrelloProvider>
    </Router>
  );
}

export default App;

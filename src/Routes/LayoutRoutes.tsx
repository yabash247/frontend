import { Route, Routes } from "react-router-dom";
import Layouts from "../Components/Layouts/Layout"; // Correctly import Layout
import routes from "./Route"; // Import your route config


export default function LayoutRoutes() {
    return (
      <Routes>
      {routes.map(({ path, Component }, i) => (
        <Route
          key={i}
          path={path} // Make sure the path is correct
          element={
            <Layouts>
              <Component /> {/* Wrap the component inside the Layout */}
            </Layouts>
          }
        />
      ))}
    </Routes>
    );
 }
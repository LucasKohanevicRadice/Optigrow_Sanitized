import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Rootlayout from "./pages/layouts/Rootlayout.jsx";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import CreateGrowEnviroments from "./pages/createGrowEnviroments/CreateGrowEnviroments.jsx";
import GrowEnviromentDetails from "./pages/GrowEnviromentDetails/GrowEnviromentDetails.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Rootlayout />}>
      <Route index element={<OverviewPage />} />
      <Route path="createGrowEnviroments" element={<CreateGrowEnviroments />} />
      <Route path="growEnviroment/:id" element={<GrowEnviromentDetails />} />
    </Route>
  )
);

import React from "react";
import DefaultLayout from "./containers/DefaultLayout";

//#region Plot
const AddPlot = React.lazy(() => import("./components/plot/add_plot"));
const EditPlot = React.lazy(() => import("./components/plot/edit_plot"));
const Plot = React.lazy(() => import("./components/plot/plot"));
//#endregion

const Images = React.lazy(() => import("./components/images"));
const Appointment = React.lazy(() =>
  import("./components/appointment/appointment")
);

//#region templete

const Dashboard = React.lazy(() => import("./views/Dashboard"));

//#endregion

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home", component: DefaultLayout },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  //#region plot
  {
    path: "/plot",
    name: "Plot",
    exact: true,
    component: Plot
  },
  {
    path: "/plot/addPlot",
    name: "Add",
    component: AddPlot
  },
  {
    path: "/plot/editPlot/:id",
    name: "Edit",
    exact: true,
    component: EditPlot
  },

  //#endregion

  {
    path: "/images",
    name: "Images",
    component: Images
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: Appointment
  }
];

export default routes;

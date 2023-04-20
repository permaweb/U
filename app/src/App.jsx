import { connect } from "react-redux";

import { mapStateToProps } from "./pages";

import loadable from "@loadable/component";

const pages = {
  Home: loadable(() => import("./pages/Home"), {
    resolveComponent: (c) => c.default,
  }),
  // Player: loadable(() => import("./pages/Player"), {
  //   resolveComponent: (c) => c.default,
  // }),
};

function App({ page }) {
  const Component = pages[page || "Home"];
  return <Component />;
}

export default connect(mapStateToProps)(App);

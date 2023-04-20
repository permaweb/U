import { NOT_FOUND } from "redux-first-router";

const components = {
  HOME: "Home",
  // PLAYER: "Player",
  [NOT_FOUND]: "Home",
};

export const routesMap = {
  HOME: {
    path: "/",
    thunk: async (dispatch, getState) => {
      // You can do stuff here before the component loads.
      console.log("Home thunk.");
    },
  },
  // PLAYER: {
  //   path: "/player/:tx",
  //   thunk: async (dispatch, getState) => {
  //     console.log("Player thunk.");
  //   },
  // },
  NOT_FOUND: {
    path: "/",
  },
};

export const mapStateToProps = (state, props) => {
  return {
    ...props,
    page: state.page,
    tx: state?.location?.payload?.tx,
    ticker: state?.location?.payload?.ticker,
    transaction: state?.location?.payload?.transaction,
  };
};

export const router = (dispatch) => ({
  goToHome: () => dispatch({ type: "HOME" }),
  goToPlayer: (tx) => dispatch({ type: "PLAYER", payload: { tx } }),
});

// imported into store.js
export default (state = "HOME", action = {}) =>
  components[action.type] || state;

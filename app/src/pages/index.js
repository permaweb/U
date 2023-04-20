import { NOT_FOUND } from "redux-first-router";

const components = {
  HOME: "Home",
  // PLAYER: "Player",
  [NOT_FOUND]: "Feed",
};

export const routesMap = {
  HOME: {
    path: "/",
    thunk: async (dispatch, getState) => {
      console.log("Feed thunk.");
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

export default (state = "HOME", action = {}) =>
  components[action.type] || state;

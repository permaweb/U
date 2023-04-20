import { connect } from "react-redux";
import { mapStateToProps } from "../pages";

function Player({ tx, goToFeed }) {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello {tx}</h1>
      <p onClick={() => goToFeed()}>Go to feed</p>
    </>
  );
}

export default connect(mapStateToProps, (dispatch) => ({
  goToFeed: () => dispatch({ type: "FEED" }),
}))(Player);

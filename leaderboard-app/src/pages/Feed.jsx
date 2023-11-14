import { connect } from "react-redux";
import { mapStateToProps, router } from "../store/router";
import LeaderboardApp from "u-leaderboard";
function Feed({ goToPlayer }) {
  return <LeaderboardApp />;
}

export default connect(mapStateToProps, router)(Feed);

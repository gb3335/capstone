import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import { getResearchById } from "../../actions/researchActions";

import ResearchHeader from "./ResearchHeader";
import ResearchAbstract from "./ResearchAbstract";
import ResearchAuthors from "./ResearchAuthors";
import ResearchImages from "./ResearchImages";
import ResearchActions from "./ResearchActions";
import ResearchAuthorActions from "./ResearchAuthorActions";
import ResearchImageActions from "./ResearchImageActions";
import ResearchDocument from "./ResearchDocument";
import ResearchDocumentActions from "./ResearchDocumentActions";

class Research extends Component {
  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getResearchById(this.props.match.params.id);
    }
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getResearchById(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.research.research === null && this.props.research.loading) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { research, loading } = this.props.research;
    let researchContent;

    if (research === null || loading) {
      researchContent = <Spinner />;
    } else {
      researchContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/researches" className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Researches
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <ResearchHeader research={research} />
          <br />
          <ResearchActions />
          <ResearchAbstract research={research} />
          <br />
          <ResearchAuthorActions />
          <ResearchAuthors research={research} />
          <br />
          <ResearchImageActions />
          <ResearchImages research={research} />
          <br />
          <ResearchDocumentActions />
          <ResearchDocument research={research} />
        </div>
      );
    }

    return (
      <div className="research">
        <div className="container" style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-12">{researchContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Research.propTypes = {
  research: PropTypes.object.isRequired,
  getResearchById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  research: state.research
});

export default connect(
  mapStateToProps,
  { getResearchById }
)(Research);

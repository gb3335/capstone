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
    let researchAction;
    let authorAction;
    let imageAction;
    let docAction;
    let doc;

    if (this.props.auth.isAuthenticated) {
      if (research.status === 0) {
        authorAction = <ResearchAuthorActions />;
        imageAction = <ResearchImageActions />;
        docAction = <ResearchDocumentActions research={research} />;
      }
      researchAction = <ResearchActions />;
      doc = <ResearchDocument research={research} />;
    }

    if (research === null || loading) {
      researchContent = <Spinner />;
    } else {
      try {
        researchContent = (
          <div>
            {/* <div hidden>
              <p>{research.title}</p>
            </div> */}
            <div className="row">
              <div className="col-md-6">
                <Link
                  to="/researches"
                  className="btn btn-light mb-3 float-left"
                >
                  <i className="fas fa-angle-left" /> Back to Researches
                </Link>
              </div>
              <div className="col-md-6" />
            </div>

            <ResearchHeader research={research} />
            <br />
            {researchAction}
            <ResearchAbstract research={research} />
            <br />
            {authorAction}
            <ResearchAuthors research={research} />
            <br />
            {imageAction}
            <ResearchImages research={research} />
            <br />
            {docAction}
            {doc}
          </div>
        );
      } catch (error) {}
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
  getResearchById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getResearchById }
)(Research);

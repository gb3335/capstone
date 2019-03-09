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
      if (research.deleted === 0) {
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
            <div className="row" style={{ margin: "5px" }}>
              <div className="col-md-3">
                <br />
                <div className="list-group" id="list-tab" role="tablist">
                  <a
                    className="list-group-item list-group-item-action active"
                    id="list-details-list"
                    data-toggle="list"
                    href="#list-details"
                    role="tab"
                    aria-controls="details"
                  >
                    <i className="fas fa-info-circle mr-2" />
                    Research Details
                  </a>
                  <a
                    className="list-group-item list-group-item-action"
                    id="list-abstract-list"
                    data-toggle="list"
                    href="#list-abstract"
                    role="tab"
                    aria-controls="abstract"
                  >
                    <i class="fas fa-file-alt mr-2" />
                    Abstract
                  </a>

                  <a
                    className="list-group-item list-group-item-action"
                    id="list-authors-list"
                    data-toggle="list"
                    href="#list-authors"
                    role="tab"
                    aria-controls="authors"
                  >
                    <i class="fas fa-users mr-2" />
                    Authors
                  </a>

                  <a
                    className="list-group-item list-group-item-action"
                    id="list-pictures-list"
                    data-toggle="list"
                    href="#list-pictures"
                    role="tab"
                    aria-controls="pictures"
                  >
                    <i class="fas fa-images mr-2" />
                    Pictures
                  </a>

                  <a
                    className="list-group-item list-group-item-action"
                    id="list-document-list"
                    data-toggle="list"
                    href="#list-document"
                    role="tab"
                    aria-controls="document"
                  >
                    <i class="fas fa-file mr-2" />
                    Document
                  </a>
                </div>
              </div>

              <div className="col-md-9">
                <br />
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="list-details"
                    role="tabpanel"
                    aria-labelledby="list-details-list"
                  >
                    <ResearchHeader research={research} />
                    <br />
                    <ResearchActions />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="list-abstract"
                    role="tabpanel"
                    aria-labelledby="list-abstract-list"
                  >
                    <ResearchAbstract research={research} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="list-authors"
                    role="tabpanel"
                    aria-labelledby="list-authors-list"
                  >
                    {authorAction}
                    <ResearchAuthors research={research} />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="list-pictures"
                    role="tabpanel"
                    aria-labelledby="list-pictures-list"
                  >
                    {imageAction}
                    <ResearchImages research={research} />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="list-document"
                    role="tabpanel"
                    aria-labelledby="list-document-list"
                  >
                    {docAction}
                    {doc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } catch (error) {}
    }

    return (
      <div className="research">
        <div style={{ padding: "1em" }}>
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

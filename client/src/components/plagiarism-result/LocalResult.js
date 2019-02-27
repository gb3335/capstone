import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class LocalResult extends Component {
  render() {
    const {
      SimilarityScore
    } = this.props.localPlagiarism.output.localPlagiarism.data;
    const Name1 = this.props.localPlagiarism.output.localPlagiarism.data
      .DocumentScore.Document_1.Name;
    const Score1 = this.props.localPlagiarism.output.localPlagiarism.data
      .DocumentScore.Document_1.Score;
    const Name2 = this.props.localPlagiarism.output.localPlagiarism.data
      .DocumentScore.Document_2.Name;
    const Score2 = this.props.localPlagiarism.output.localPlagiarism.data
      .DocumentScore.Document_2.Score;
    const {
      NumOfHits
    } = this.props.localPlagiarism.output.localPlagiarism.data;
    const {
      NumOfPattern
    } = this.props.localPlagiarism.output.localPlagiarism.data;
    const {
      NumOfText
    } = this.props.localPlagiarism.output.localPlagiarism.data;
    const { Index } = this.props.localPlagiarism.output.localPlagiarism.data;

    return (
      <div className="research">
        <div className="container" style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-12">Local Result</div>
            <p>
              Similarity Score: <span>{SimilarityScore}</span>
              <br />
              Document 1: <span>{Name1}</span>
              <br />
              Document 1 Similarity Score: <span>{Score1}</span>
              <br />
              Document 2: <span>{Name2}</span>
              <br />
              Document 2 Similarity Score: <span>{Score2}</span>
              <br />
              Hits: <span>{NumOfHits}</span>
              <br />
              Pattern: <span>{NumOfPattern}</span>
              <br />
              Text: <span>{NumOfText}</span>
              <br />
              {JSON.stringify(Index)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

LocalResult.propTypes = {
  localPlagiarism: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism
});

export default connect(mapStateToProps)(LocalResult);

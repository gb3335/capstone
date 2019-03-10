import React, { Component } from 'react'
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Output extends Component {
  render() {
      let output;
      output = this.props.output.map(out => (
          <div key= {out.DocumentScore.Document_2.Name}>

            <p>Similarity Score: {out.SimilarityScore}</p>
          </div>
          )
      )
    return (
      <div>
        {output}
      </div>
    )
  }
}

Output.propTypes = {
    localPlagiarism: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    localPlagiarism: state.localPlagiarism
});

export default connect(mapStateToProps)(Output);

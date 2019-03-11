import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import { getTextPattern} from "../../actions/localPlagiarismActions";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
 class LocalResult_id extends Component {

  componentWillMount(){
    if (this.props.match.params.id) {
      const input = {
        docuId : this.props.localPlagiarism.docuId,
        textId: this.props.match.params.id
      }
      this.props.getTextPattern(input);
    }
  }

  render() {
    const { pattern, patternLoading } = this.props.localPlagiarism;

    let items;

    if (pattern === null || patternLoading) {
      items = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else{
      items = (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9">
                <TextAreaFieldGroup value={pattern.data}/>
                </div>
                <div className="col-md-3">

                </div>
            </div>
        </div>
        
      )
    }

    return (
      <div>
        {items}
      </div>
    )
  }
}

LocalResult_id.propTypes = {
  localPlagiarism: PropTypes.object.isRequired,
  getTextPattern : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
});

export default connect(mapStateToProps, {getTextPattern})(LocalResult_id)
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { toggleResearchBin } from "../../actions/researchActions";

class ResearchesAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  onToggleBin = e => {
    if (this.props.research.bin === false) {
      this.props.toggleResearchBin(1);
    } else {
      this.props.toggleResearchBin(0);
    }
  };

  render() {
    let binAction;
    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Researches
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <Link to="/add-research" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add Research
        </Link>
        {binAction}
      </div>
    );
  }
}

ResearchesAction.propTypes = {
  toggleResearchBin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  bin: state.research.bin
});

export default connect(
  mapStateToProps,
  { toggleResearchBin }
)(ResearchesAction);

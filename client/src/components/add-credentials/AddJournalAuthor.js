import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addAuthor } from "../../actions/journalActions";

class AddAuthor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      // role: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const name =
      this.props.auth.user.firstName +
      " " +
      this.props.auth.user.middleName +
      " " +
      this.props.auth.user.lastName;
    const authorData = {
      name: this.state.name,
      // role: this.state.role,
      researchId: this.props.journal.journal._id,
      username: name
    };

    this.refs.authorBtn.setAttribute("disabled", "disabled");
    this.props.addAuthor(authorData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.authorBtn.removeAttribute("disabled");
  };

  render() {
    const { errors } = this.state;
    const path = "/journals/" + this.props.journal.journal._id;
    return (
      <div className="add-author">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={path} className="btn btn-light">
                <i className="fas fa-angle-left" /> Go Back
              </Link>
              <h1 className="display-4 text-center">
                Add Author to {this.props.journal.journal.title}
              </h1>
              <p className="lead text-center">Add author for this journal</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                {/* <TextFieldGroup
                  placeholder="* Role"
                  name="role"
                  value={this.state.role}
                  onChange={this.onChange}
                  error={errors.role}
                /> */}

                <input
                  ref="authorBtn"
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddAuthor.propTypes = {
  errors: PropTypes.object.isRequired,
  addAuthor: PropTypes.func.isRequired,
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  journal: state.journal,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addAuthor }
)(withRouter(AddAuthor));

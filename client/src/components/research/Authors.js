import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteAuthor } from "../../actions/researchActions";

class Authors extends Component {
  onDeleteClick = (research, id, name) => {
    this.props.deleteAuthor(research, id, name);
  };

  render() {
    const { research } = this.props.research;
    let author;
    let name;
    try {
      name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;
    } catch (error) {}
    if (this.props.auth.isAuthenticated === true) {
      if (research.deleted === 0) {
        author = this.props.author.map(author => (
          <tr key={author._id}>
            <td>
              {author.name} ({author.role})
            </td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(
                  this,
                  research._id,
                  author._id,
                  name
                )}
                className="btn btn-danger"
              >
                Remove
              </button>
            </td>
          </tr>
        ));
      } else {
        author = this.props.author.map(author => (
          <tr key={author._id}>
            <td>
              {author.name} ({author.role})
            </td>
          </tr>
        ));
      }
    } else {
      author = this.props.author.map(author => (
        <tr key={author._id}>
          <td>
            {author.name} ({author.role})
          </td>
        </tr>
      ));
    }

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th />
            </tr>
          </thead>
          <tbody>{author}</tbody>
        </table>
      </div>
    );
  }
}

Authors.propTypes = {
  deleteAuthor: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteAuthor }
)(Authors);

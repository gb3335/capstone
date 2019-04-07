import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sort from "fast-sort";
import SweetAlert from "react-bootstrap-sweetalert";

import { deleteAuthor } from "../../actions/researchActions";

class Authors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      research: "",
      id: "",
      name: "",
      // Delete Alert
      deleteAlert: false,
      deleteAlertCancel: false,
      deleteAlertOkay: false
    };
  }

  // Delete alerts
  onDeleteAlert = (research, id, name) => {
    this.setState({
      deleteAlert: true,
      research: research,
      id: id,
      name: name
    });
  };
  onCancelDelete = () => {
    this.setState({ deleteAlert: false, deleteAlertCancel: true });
  };
  onRemoveDeleteCancel = () => {
    this.setState({ deleteAlertCancel: false });
  };

  onRemoveDeleteOkay = () => {
    this.setState({ deleteAlertOkay: false });
    this.props.deleteAuthor(
      this.state.research,
      this.state.id,
      this.state.name
    );
  };

  onDeleteAuthor = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  render() {
    const { research } = this.props.research;
    let author;
    let name;
    let columnButton;

    try {
      name = this.props.auth.user.id;
    } catch (error) {}
    if (this.props.auth.isAuthenticated === true) {
      // Sorted Authors
      let sortedAuthor = sort(this.props.author).asc(u => u.name);

      if (research.deleted === 0) {
        if (
          (this.props.auth.user.userType === "LIBRARIAN" &&
            this.props.auth.user.college === research.college) ||
          this.props.auth.user.userType === "ADMINISTRATOR"
        ) {
          columnButton = <th />;

          author = sortedAuthor.map(author => (
            <tr key={author._id}>
              <td>
                {author.name} ({author.role})
              </td>
              {author.role === "Author One" ? (
                <td>
                  <button className="btn btn-danger" disabled={true}>
                    Remove
                  </button>
                </td>
              ) : (
                <td>
                  <button
                    onClick={this.onDeleteAlert.bind(
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
              )}
            </tr>
          ));
        } else {
          author = sortedAuthor.map(author => (
            <tr key={author._id}>
              <td>
                {author.name} ({author.role})
              </td>
            </tr>
          ));
        }
      } else {
        author = sortedAuthor.map(author => (
          <tr key={author._id}>
            <td>
              {author.name} ({author.role})
            </td>
          </tr>
        ));
      }
    } else {
      // Sorted Authors
      let sortedAuthor = sort(this.props.author).asc(u => u.name);

      author = sortedAuthor.map(author => (
        <tr key={author._id}>
          <td>
            {author.name} ({author.role})
          </td>
        </tr>
      ));
    }

    return (
      <div>
        {/* ALERTS */}
        {/* DELETE ALERT */}
        <SweetAlert
          show={this.state.deleteAlert}
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onDeleteAuthor}
          onCancel={this.onCancelDelete}
        >
          Delete Author?
        </SweetAlert>

        {/* CANCEL DELETE */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          Author is not deleted
        </SweetAlert>

        {/* COURSE DELETE */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Deleted"
          onConfirm={this.onRemoveDeleteOkay}
        >
          Author deleted
        </SweetAlert>

        {/* CONTENTS */}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              {columnButton}
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

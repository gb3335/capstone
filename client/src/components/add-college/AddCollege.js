import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

import { createCollege } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import ImageFieldGroup from "../common/ImageFieldGroup";

// Search Author
import classNames from "classnames";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { emphasize } from "@material-ui/core/styles/colorManipulator";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: "flex",
    padding: 0,
    cursor: "pointer"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    overflow: "hidden",
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class CreateCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      initials: "",
      logo: "",
      librarian: "",
      selectedFile: "",
      background: "#000000",
      errors: {},
      single: null
    };
  }

  handleChange = name => value => {
    this.setState({
      single: value
    });
    this.refs.colBtn.removeAttribute("disabled");
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const logo = this.state.logo;
    const logoname = logo.replace(/^.*\\/, "");
    let libName = "";
    let libId = "";

    if (this.state.single !== null) {
      libName = this.state.single.label;
      libId = this.state.single.id;
    }

    const name = this.props.auth.user.id;

    const collegeData = {
      fullName: this.state.fullName,
      initials: this.state.initials,
      logo:
        logoname
          .split(".")
          .slice(0, -1)
          .join(".") + Date.now(),
      librarian: libName,
      librarianId: libId,
      file: this.state.selectedFile,
      color: this.state.background,
      username: name
    };

    this.refs.colBtn.setAttribute("disabled", "disabled");
    this.props.createCollege(collegeData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.colBtn.removeAttribute("disabled");
  };

  onFileSelected = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.colBtn.removeAttribute("disabled");

    try {
      let files = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = e => {
        this.setState({
          selectedFile: e.target.result
        });
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  handleChangeComplete = color => {
    this.setState({ background: color.hex });
  };

  render() {
    const { errors } = this.props;
    const { classes, theme } = this.props;
    let suggestions = [];

    try {
      if (this.props.users !== null) {
        this.props.users.map(user => {
          if (
            user.userType === "LIBRARIAN" &&
            user.alreadyHaveCollege !== "true"
          ) {
            suggestions.push({
              label:
                user.name.firstName +
                " " +
                user.name.middleName +
                " " +
                user.name.lastName,
              id: user._id
            });
          }
        });
      }

      suggestions.map(suggestion => ({
        value: suggestion.label,
        label: suggestion.label,
        id: suggestion.id
      }));
    } catch (error) {}

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };

    return (
      <div className="create-college">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/colleges" className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Colleges
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Add College</h1>
              <p className="lead text-center">
                Let's get some information for your college
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* College Name"
                  name="fullName"
                  value={this.state.fullName}
                  onChange={this.onChange}
                  error={errors.fullName}
                  info="College Name must be unique"
                />
                <TextFieldGroup
                  placeholder="* College Initials"
                  name="initials"
                  value={this.state.initials}
                  onChange={this.onChange}
                  error={errors.initials}
                  info="College Initials must also be unique"
                />
                <div>
                  <Link
                    to="/register"
                    target="_blank"
                    className="btn btn-light"
                    style={{ fontSize: "12px" }}
                    title="Add Librarian"
                  >
                    <i className="fas fa-user-plus mr-1" />
                    Add Librarian
                  </Link>
                  <NoSsr>
                    <Select
                      classes={classes}
                      styles={selectStyles}
                      options={suggestions}
                      components={components}
                      value={this.state.single}
                      onChange={this.handleChange("single")}
                      placeholder="* Librarian"
                      isClearable
                      isDisabled={suggestions === null ? true : false}
                    />
                    <p style={{ fontSize: "13px", color: "gray" }}>
                      Who's the librarian for this college
                    </p>

                    <p style={{ fontSize: "13px", color: "#d9534f" }}>
                      {errors.librarian}
                    </p>
                  </NoSsr>
                </div>

                <br />
                {/* <TextFieldGroup
                  placeholder="* Librarian"
                  name="librarian"
                  value={this.state.librarian}
                  onChange={this.onChange}
                  error={errors.librarian}
                  info="Who's the librarian for this college"
                /> */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <SketchPicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}
                      />
                      <small className="form-text text-muted">Color</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      to="#"
                      htmlFor="collegeLogo"
                      className="btn btn-light"
                    >
                      <i className="fas fa-plus text-info mr-1" />
                      Add Image
                    </label>
                    <ImageFieldGroup
                      placeholder="* Logo"
                      name="logo"
                      value={this.state.logo}
                      onChange={this.onFileSelected}
                      error={errors.logo}
                      info={this.state.logo.replace(/^.*\\/, "")}
                      id="collegeLogo"
                    />
                  </div>
                </div>
                <input
                  ref="colBtn"
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
CreateCollege.propTypes = {
  createCollege: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth,
  users: state.users.users
});
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { createCollege }
  )(withRouter(CreateCollege))
);

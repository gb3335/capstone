import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
    height: 250,
    fontSize: 12
  },
  input: {
    display: "flex",
    padding: 0,
    cursor: "pointer",
    fontSize: 14
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    fontSize: 12
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
    fontSize: 12
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    fontSize: 12
  },
  singleValue: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    overflow: "hidden",
    fontSize: 14
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 14
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    fontSize: 12
  },
  divider: {
    height: theme.spacing.unit * 2,
    fontSize: 12
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

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typed: "",
      single: null
    };
  }

  handleChange = name => value => {
    let port = "";

    if (window.location.port !== null) {
      port = ":" + window.location.port;
    }

    this.setState(
      {
        [name]: value
      },
      () => {
        if (this.state.single !== null) {
          window.open(
            window.location.protocol +
              "//" +
              window.location.hostname +
              port +
              "/" +
              this.state.single.link,
            "_blank"
          );
        }
      }
    );
  };

  render() {
    const { classes, theme } = this.props;
    const { isAuthenticated } = this.props.auth;
    let suggestions = [];
    let realSuggestions = [];

    try {
      if (
        this.props.colleges !== null &&
        this.props.researches !== null &&
        this.props.journals !== null
      ) {
        // Add Colleges
        this.props.colleges.map(college => {
          suggestions.push({
            label: college.name.fullName,
            link: `colleges/${college.name.initials}`
          });
        });

        // Add Researches
        this.props.researches.map(research => {
          suggestions.push({
            label: research.title,
            link: `researches/${research._id}`
          });
        });

        // Add Journals
        this.props.journals.map(journal => {
          suggestions.push({
            label: journal.title,
            link: `journals/${journal._id}`
          });
        });

        // Add Users
        if (isAuthenticated) {
          this.props.users.map(user => {
            suggestions.push({
              label:
                user.name.firstName +
                " " +
                user.name.middleName +
                " " +
                user.name.lastName,
              link: `viewusers/${user._id}`
            });
          });
        }

        suggestions.map(suggestion => ({
          value: suggestion.label,
          label: suggestion.label,
          link: suggestion.link
        }));
      }
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

    if (this.state.typed !== "") {
      realSuggestions = suggestions;
    }

    return (
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          options={realSuggestions}
          getOptionValue={option => option.value}
          components={components}
          value={this.state.single}
          onChange={this.handleChange("single")}
          onInputChange={e => this.setState({ typed: e })}
          placeholder="Search"
          isClearable
        />
      </NoSsr>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colleges: state.college.colleges,
  researches: state.research.researches,
  journals: state.journal.journals,
  users: state.users.users,
  auth: state.auth
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    {}
  )(SearchBar)
);

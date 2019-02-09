import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const FileFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  style,
  multiple,
  id
}) => {
  return (
    <div className="form-group">
      <input
        id={id}
        style={{
          border: 0,
          opacity: 0,
          position: "absolute",
          pointerEvents: "none",
          width: "1px",
          height: "1px"
        }}
        type={type}
        className={classnames("form-control", { "is-invalid": error })}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        accept=".docx"
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

FileFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

FileFieldGroup.defaultProps = {
  type: "file"
};

export default FileFieldGroup;

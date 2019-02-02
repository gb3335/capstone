import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const ImageFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      <input
        style={{ border: 0 }}
        type={type}
        className={classnames("form-control", { "is-invalid": error })}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        id="selectImage"
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

ImageFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

ImageFieldGroup.defaultProps = {
  type: "file"
};

export default ImageFieldGroup;

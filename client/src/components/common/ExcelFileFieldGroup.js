import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const ExcelFieldGroup = ({
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
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

ExcelFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

ExcelFieldGroup.defaultProps = {
  type: "file"
};

export default ExcelFieldGroup;

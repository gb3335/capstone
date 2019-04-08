import React, { Component } from "react";
import Courses from "./Courses";

class CollegeCourses extends Component {
  render() {
    const { college } = this.props;
    let courseItems;

    if (Object.keys(college.course).length > 0) {
      courseItems = <Courses course={college.course} />;
    } else {
      courseItems = <span>No courses is added in this college</span>;
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3 shadow">
            {courseItems}
          </div>
        </div>
      </div>
    );
  }
}

export default CollegeCourses;

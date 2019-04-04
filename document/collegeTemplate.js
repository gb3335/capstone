const moment_timezone = require("moment-timezone");
const moment = require("moment");

module.exports = ({
  // Basic info
  status,
  researchTotal,
  journalTotal,
  courseTotal,
  lastUpdate,

  //  Courses
  courses,
  courseStatus,
  courseResearch,
  courseJournal,
  deletedCourses,

  // researches
  listOfResearches,
  researchStatus,
  researchResId,
  researchCollege,
  researchCourse,
  researchType,
  researchPages,
  researchAcademicYear,
  researchLastUpdate,
  deletedResearches,

  // others
  typeOfReport,
  college,
  researches
}) => {
  let librarian = college.librarian;
  let stat;
  let totaljour;
  let totalres;
  let updatedon;
  let collegeName = college.name.fullName;
  let numberOfColForEndRow = 0;
  let numberOfColForEndRowRes = 0;

  // for courses table
  let totalcourse;
  let coursesList;
  let courseTitle;
  let coursesListNoComma = "";
  let coursesListHeader;

  // for researches table
  let totalresearch;
  let researchesList;
  let researchTitle;
  let researchesListNoComma = "";
  let researchesListHeader;

  const currentDate = moment_timezone()
    .tz("Asia/Manila")
    .format("MMMM Do YYYY, h:mm A");

  // course table
  if (courseStatus === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (courseJournal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (courseResearch === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  numberOfColForEndRow = 3 + numberOfColForEndRow;

  // research table
  if (researchCollege === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchCourse === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchStatus === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchType === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchResId === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchPages === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchAcademicYear === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  if (researchLastUpdate === true) {
    numberOfColForEndRowRes = ++numberOfColForEndRowRes;
  }
  numberOfColForEndRowRes = 2 + numberOfColForEndRowRes;

  if (status === true) {
    if (college.deleted === 0) {
      stat = "<li>Status: Active</li>";
    } else {
      stat = "<li>Status: Deleted</li>";
    }
  } else {
    stat = "";
  }

  if (journalTotal === true) {
    totaljour = `<li>Total Journals: ${college.journalTotal}</li>`;
  } else {
    totaljour = "";
  }

  if (lastUpdate === true) {
    updatedon = `<li>Updated on: ${moment(college.lastUpdate.date).format(
      "MMMM Do YYYY, h:mm A"
    )}</li>`;
  } else {
    updatedon = "";
  }

  if (researchTotal === true) {
    let resCtr = 0;
    researches.map(research => {
      if (research.college === college.name.fullName) {
        if (research.deleted === 0) {
          ++resCtr;
        }
      }
    });
    totalres = `<li>Total Researches: ${resCtr}</li>`;
  } else {
    totalres = "";
  }

  if (courseTotal === true) {
    let ctrNoDeleted = 0;
    college.course.map(cou => {
      if (cou.deleted === 0) {
        ++ctrNoDeleted;
      }
    });

    totalcourse = `<li>Total Courses: ${ctrNoDeleted}</li>`;
  } else {
    totalcourse = "";
  }

  // College course list and count
  if (courses === true) {
    if (deletedCourses) {
      // INCLUDE DELETED COURSES
      let ctrNoDeleted = 0;
      college.course.map(cou => {
        if (cou.deleted === 0) {
          ++ctrNoDeleted;
        }
      });

      if (ctrNoDeleted == 0) {
        coursesListNoComma = "No Courses in this College";
        coursesListHeader = "";
      } else {
        coursesList = college.course.map(
          (indCourse, index) =>
            "<tr>" +
            `<td>${++index}</td>` +
            `<td>${indCourse.name}</td>` +
            `<td>${indCourse.initials}</td>` +
            `${
              courseStatus
                ? indCourse.deleted === 1
                  ? "<td>Deleted</td>"
                  : indCourse.status === 0
                  ? "<td>Active</td>"
                  : "<td>Inactive</td>"
                : ""
            }` +
            `${
              courseResearch === true
                ? `<td>${indCourse.researchTotal}</td>`
                : ""
            }` +
            `${
              courseJournal === true ? `<td>${indCourse.journalTotal}</td>` : ""
            }` +
            "</tr>"
        );

        coursesList.map(item => {
          coursesListNoComma = coursesListNoComma + item;
        });

        coursesListNoComma =
          coursesListNoComma +
          `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

        coursesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>COURSE NAME</th>" +
          "<th>INITIALS</th>" +
          `${courseStatus === true ? `<th>STATUS</th>` : ""}` +
          `${courseResearch === true ? `<th>RESEARCH TOTAL</th>` : ""}` +
          `${courseJournal === true ? `<th>JOURNAL TOTAL</th>` : ""}` +
          "</tr>";
      }
    } else {
      // DOENST INCLUDE DELETED COURSES
      let ctrNoDeleted = 0;
      college.course.map(cou => {
        if (cou.deleted === 0) {
          ++ctrNoDeleted;
        }
      });

      //totalcourse = `<li>Total Courses: ${ctrNoDeleted}</li>`;

      if (ctrNoDeleted == 0) {
        coursesListNoComma = "No Courses in this College";
        coursesListHeader = "";
      } else {
        let ind = 0;
        coursesList = college.course.map((indCourse, index) =>
          indCourse.deleted === 0
            ? "<tr>" +
              `<td>${++ind}</td>` +
              `<td>${indCourse.name}</td>` +
              `<td>${indCourse.initials}</td>` +
              `${
                courseStatus
                  ? indCourse.deleted === 1
                    ? "<td>Deleted</td>"
                    : indCourse.status === 0
                    ? "<td>Active</td>"
                    : "<td>Inactive</td>"
                  : ""
              }` +
              `${
                courseResearch === true
                  ? `<td>${indCourse.researchTotal}</td>`
                  : ""
              }` +
              `${
                courseJournal === true
                  ? `<td>${indCourse.journalTotal}</td>`
                  : ""
              }` +
              "</tr>"
            : ""
        );

        coursesList.map(item => {
          coursesListNoComma = coursesListNoComma + item;
        });

        coursesListNoComma =
          coursesListNoComma +
          `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

        coursesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>COURSE NAME</th>" +
          "<th>INITIALS</th>" +
          `${courseStatus === true ? `<th>STATUS</th>` : ""}` +
          `${courseResearch === true ? `<th>RESEARCH TOTAL</th>` : ""}` +
          `${courseJournal === true ? `<th>JOURNAL TOTAL</th>` : ""}` +
          "</tr>";
      }
    }

    courseTitle = `<h4 style="font-size: 7px">Courses:</h4>`;
  } else {
    totalcourse = "";
    courseTitle = "";
    coursesListNoComma = "";
    coursesListHeader = "";
  }

  // College researches list and count
  if (listOfResearches === true) {
    if (deletedResearches === true) {
      let resCtr = 0;
      researches.map(research => {
        if (research.college === college.name.fullName) {
          if (research.deleted === 0) {
            ++resCtr;
          }
        }
      });

      // INCLUDE DELETED RESEARCHES
      if (resCtr == 0) {
        researchesListNoComma = "No Researches in this College";
        researchesListHeader = "";
      } else {
        let ind = 0;
        researchesList = researches.map((research, index) =>
          research.college === college.name.fullName
            ? "<tr>" +
              `<td>${++ind}</td>` +
              `<td>${research.title}</td>` +
              `${
                researchCollege === true ? `<td>${research.college}</td>` : ""
              }` +
              `${
                researchCourse === true ? `<td>${research.course}</td>` : ""
              }` +
              `${
                researchStatus === true
                  ? research.deleted === 1
                    ? "<td>Deleted</td>"
                    : research.hidden === 0
                    ? "<td>Active</td>"
                    : "<td>Hidden</td>"
                  : ""
              }` +
              `${researchType === true ? `<td>${research.type}</td>` : ""}` +
              `${
                researchResId === true ? `<td>${research.researchID}</td>` : ""
              }` +
              `${researchPages === true ? `<td>${research.pages}</td>` : ""}` +
              `${
                researchAcademicYear === true
                  ? `<td>${research.schoolYear}</td>`
                  : ""
              }` +
              `${
                researchLastUpdate === true
                  ? `<td>${moment(research.lastUpdate).format(
                      "MMMM Do YYYY, h:mm A"
                    )}</td>`
                  : ""
              }` +
              "</tr>"
            : ""
        );
        researchesList.map(item => {
          researchesListNoComma = researchesListNoComma + item;
        });

        researchesListNoComma =
          researchesListNoComma +
          `<tr class="blank_row"><td colspan="${numberOfColForEndRowRes}" style="text-align:center;">- Nothing Follows -</td></tr>`;

        researchesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>TITLE</th>" +
          `${researchCollege === true ? "<th>COLLEGE</th>" : ""}` +
          `${researchCourse === true ? "<th>COURSE</th>" : ""}` +
          `${researchStatus === true ? "<th>STATUS</th>" : ""}` +
          `${researchType === true ? "<th>TYPE</th>" : ""}` +
          `${researchResId === true ? "<th>RESEARCH ID</th>" : ""}` +
          `${researchPages === true ? "<th>PAGES</th>" : ""}` +
          `${researchAcademicYear === true ? "<th>ACADEMIC YEAR</th>" : ""}` +
          `${researchLastUpdate === true ? "<th>LAST UPDATE</th>" : ""}` +
          "</tr>";
      }
    } else {
      let resCtr = 0;
      researches.map(research => {
        if (research.college === college.name.fullName) {
          if (research.deleted === 0) {
            ++resCtr;
          }
        }
      });
      // DOENST INCLUDE DELETED RESEARCHES
      if (resCtr == 0) {
        researchesListNoComma = "No Researches in this College";
        researchesListHeader = "";
      } else {
        let ind = 0;
        researchesList = researches.map((research, index) =>
          research.college === college.name.fullName
            ? research.deleted === 0
              ? "<tr>" +
                `<td>${++ind}</td>` +
                `<td>${research.title}</td>` +
                `${
                  researchCollege === true ? `<td>${research.college}</td>` : ""
                }` +
                `${
                  researchCourse === true ? `<td>${research.course}</td>` : ""
                }` +
                `${
                  researchStatus === true
                    ? research.deleted === 1
                      ? "<td>Deleted</td>"
                      : research.hidden === 0
                      ? "<td>Active</td>"
                      : "<td>Hidden</td>"
                    : ""
                }` +
                `${researchType === true ? `<td>${research.type}</td>` : ""}` +
                `${
                  researchResId === true
                    ? `<td>${research.researchID}</td>`
                    : ""
                }` +
                `${
                  researchPages === true ? `<td>${research.pages}</td>` : ""
                }` +
                `${
                  researchAcademicYear === true
                    ? `<td>${research.schoolYear}</td>`
                    : ""
                }` +
                `${
                  researchLastUpdate === true
                    ? `<td>${moment(research.lastUpdate).format(
                        "MMMM Do YYYY, h:mm A"
                      )}</td>`
                    : ""
                }` +
                "</tr>"
              : ""
            : ""
        );
        researchesList.map(item => {
          researchesListNoComma = researchesListNoComma + item;
        });

        researchesListNoComma =
          researchesListNoComma +
          `<tr class="blank_row"><td colspan="${numberOfColForEndRowRes}" style="text-align:center;">- Nothing Follows -</td></tr>`;

        researchesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>TITLE</th>" +
          `${researchCollege === true ? "<th>COLLEGE</th>" : ""}` +
          `${researchCourse === true ? "<th>COURSE</th>" : ""}` +
          `${researchStatus === true ? "<th>STATUS</th>" : ""}` +
          `${researchType === true ? "<th>TYPE</th>" : ""}` +
          `${researchResId === true ? "<th>RESEARCH ID</th>" : ""}` +
          `${researchPages === true ? "<th>PAGES</th>" : ""}` +
          `${researchAcademicYear === true ? "<th>ACADEMIC YEAR</th>" : ""}` +
          `${researchLastUpdate === true ? "<th>LAST UPDATE</th>" : ""}` +
          "</tr>";
      }
    }
    researchTitle = `<h4 style="font-size: 7px">Researches:</h4>`;
  } else {
    totalresearch = "";
    researchTitle = "";
    researchesListNoComma = "";
    researchesListHeader = "";
  }
  return `<!DOCTYPE html>
  <html>
    <head>
      <style>
        .item1 {
          grid-area: header;
        }
  
        .grid-container {
          display: grid;
          grid-template-areas:
            "header header header header header header"
            "menu main main main right right"
            "menu footer footer footer footer footer";
          grid-gap: 10px;
        }
  
        .grid-container > .headerr {
          background-color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 20px 0;
        }
  
        .rep-logo {
          width: 5rem;
          height: 5rem;
          float: left;
        }
  
        .hidden-logo {
          width: 5rem;
          height: 5rem;
          float: right;
          visibility:hidden;
        }
  
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
  
        td,
        th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
  
        tr:nth-child(even) {
          background-color: #000000;
          color: white;
        }

        .blank_row {
          height: 10px !important; /* overwrites any other rules */
          background-color: #FFFFFF;
      }
      </style>
    </head>
    <body>
      <div class="grid-container">
        <div class="item1 headerr" style="font-size: 9px">
          <img
            src="http://www.bulsu.edu.ph/resources/bulsu_red.png"
            alt="bulsu-logo"
            class="rep-logo"
          />
          <img
            src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/${
              college.logo
            }"
            alt="college-logo"
            class="rep-logo"
          />
          <img
          src="http://www.bulsu.edu.ph/resources/bulsu_red.png"
          alt="bulsu-logo"
          class="hidden-logo"
        />
        <img
          src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/${
            college.logo
          }"
          alt="college-logo"
          class="hidden-logo"
        />
          <br />
          Bulacan State University
          <br />
          City of Malolos
          <br />
          ${collegeName}
          <br />
          <br />
          <br />
          <h4>${typeOfReport}</h4>
          <h4>University Research Office</h4>
        </div>
          <div style="font-size: 7px;">
            <p style="float: left;">
              <b>College Name: </b>${collegeName}
              <br />
              <b>Date Printed: </b>${currentDate}
            </p>
          </div>
          <br />
          <br />
          <hr />
          <div class="details" style="font-size: 7px">
            <h4 style="font-size: 7px">College Details:</h4>
            <div>
              <ul style="list-style-type:circle; text-align: left">
                <li>Librarian: ${librarian}</li>
                ${stat}
                ${totalres}
                ${totaljour}
                ${totalcourse}
                ${updatedon}
              </ul>
            </div>
          </div>
          <div class="courses" style="font-size: 5px">
            ${courseTitle}
            <table>
              ${coursesListHeader}
              ${coursesListNoComma}
            </table>
          </div>
          <div class="courses" style="font-size: 5px">
          ${researchTitle}
          <table>
            ${researchesListHeader}
            ${researchesListNoComma}
          </table>
        </div>
      </div>
    </body>
  </html>
  `;
};

const moment = require("moment");

module.exports = ({
  status,
  researchTotal,
  journalTotal,
  lastUpdate,
  courses,
  deletedCourses,
  typeOfReport,
  college,
  listOfResearches,
  deletedResearches,
  researches
}) => {
  let librarian = college.librarian;
  let stat;
  let totaljour;
  let totalres;
  let updatedon;
  let collegeName = college.name.fullName;
  let numberOfColForEndRow = 0;

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

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  if (researchTotal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (journalTotal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  numberOfColForEndRow = 4 + numberOfColForEndRow;

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
    totalres = `<li>Total Researches: ${college.researchTotal}</li>`;
  } else {
    totalres = "";
  }

  // College course list and count
  if (courses === true) {
    if (deletedCourses) {
      // INCLUDE DELETED COURSES
      totalcourse = `<li>Total Courses: ${college.course.length}</li>`;

      if (college.course.length == 0) {
        coursesListNoComma = "No Courses in this College";
        coursesListHeader = "";
      } else {
        coursesList = college.course.map(
          (indCourse, index) =>
            "<tr>" +
            `<td>${++index}</td>` +
            `<td>${indCourse.name}</td>` +
            `<td>${indCourse.initials}</td>` +
            `<td>${
              indCourse.deleted === 1
                ? "Deleted"
                : indCourse.status === 0
                ? "Active"
                : "Inactive"
            }</td>` +
            `${
              researchTotal === true
                ? `<td>${indCourse.researchTotal}</td>`
                : ""
            }` +
            `${
              journalTotal === true ? `<td>${indCourse.journalTotal}</td>` : ""
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
          "<th>STATUS</th>" +
          `${researchTotal === true ? `<th>RESEARCH TOTAL</th>` : ""}` +
          `${journalTotal === true ? `<th>JOURNAL TOTAL</th>` : ""}` +
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

      totalcourse = `<li>Total Courses: ${ctrNoDeleted}</li>`;

      if (college.course.length == 0) {
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
              `<td>${
                indCourse.deleted === 1
                  ? "Deleted"
                  : indCourse.status === 0
                  ? "Active"
                  : "Inactive"
              }</td>` +
              `${
                researchTotal === true
                  ? `<td>${indCourse.researchTotal}</td>`
                  : ""
              }` +
              `${
                journalTotal === true
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
          "<th>STATUS</th>" +
          `${researchTotal === true ? `<th>RESEARCH TOTAL</th>` : ""}` +
          `${journalTotal === true ? `<th>JOURNAL TOTAL</th>` : ""}` +
          "</tr>";
      }
    }

    courseTitle = `<h4 style="font-size: 10px">Courses:</h4>`;
  } else {
    totalcourse = "";
    courseTitle = "";
    coursesListNoComma = "";
    coursesListHeader = "";
  }

  // College researches list and count
  if (listOfResearches === true) {
    let resCtr = 0;
    if (deletedResearches === true) {
      researches.map(research => {
        if (research.college === college.name.fullName) {
          ++resCtr;
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
              `<td>${research.college}</td>` +
              `<td>${research.course}</td>` +
              `${
                research.deleted === 1
                  ? "<td>Deleted</td>"
                  : research.hidden === 0
                  ? "<td>Active</td>"
                  : "<td>Hidden</td>"
              }` +
              `<td>${research.type}</td>` +
              `<td>${research.researchID}</td>` +
              `<td>${research.pages}</td>` +
              `<td>${research.schoolYear}</td>` +
              `${`<td>${moment(research.lastUpdate).format(
                "MMMM Do YYYY, h:mm A"
              )}</td>`}` +
              "</tr>"
            : ""
        );
        researchesList.map(item => {
          researchesListNoComma = researchesListNoComma + item;
        });

        researchesListNoComma =
          researchesListNoComma +
          `<tr class="blank_row"><td colspan="10" style="text-align:center;">- Nothing Follows -</td></tr>`;

        researchesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>TITLE</th>" +
          "<th>COLLEGE</th>" +
          "<th>COURSE</th>" +
          "<th>STATUS</th>" +
          "<th>TYPE</th>" +
          "<th>RESEARCH ID</th>" +
          "<th>PAGES</th>" +
          "<th>ACADEMIC YEAR</th>" +
          "<th>UPDATED ON</th>" +
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
                `<td>${research.college}</td>` +
                `<td>${research.course}</td>` +
                `${
                  research.deleted === 1
                    ? "<td>Deleted</td>"
                    : research.hidden === 0
                    ? "<td>Active</td>"
                    : "<td>Hidden</td>"
                }` +
                `<td>${research.type}</td>` +
                `<td>${research.researchID}</td>` +
                `<td>${research.pages}</td>` +
                `<td>${research.schoolYear}</td>` +
                `${`<td>${moment(research.lastUpdate).format(
                  "MMMM Do YYYY, h:mm A"
                )}</td>`}` +
                "</tr>"
              : ""
            : ""
        );
        researchesList.map(item => {
          researchesListNoComma = researchesListNoComma + item;
        });

        researchesListNoComma =
          researchesListNoComma +
          `<tr class="blank_row"><td colspan="10" style="text-align:center;">- Nothing Follows -</td></tr>`;

        researchesListHeader =
          "<tr>" +
          "<th>NO</th>" +
          "<th>TITLE</th>" +
          "<th>COLLEGE</th>" +
          "<th>COURSE</th>" +
          "<th>STATUS</th>" +
          "<th>TYPE</th>" +
          "<th>RESEARCH ID</th>" +
          "<th>PAGES</th>" +
          "<th>ACADEMIC YEAR</th>" +
          "<th>UPDATED ON</th>" +
          "</tr>";
      }
    }
    researchTitle = `<h4 style="font-size: 10px">Researches:</h4>`;
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
          <div style="font-size: 10px;">
            <p style="float: left;">
              <b>College Name: </b>${collegeName}
              <br />
              <b>Date Printed: </b>${currentDate}
            </p>
          </div>
          <br />
          <br />
          <hr />
          <div class="details" style="font-size: 10px">
            <h4 style="font-size: 10px">Details:</h4>
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
          <div class="courses" style="font-size: 9px">
            ${courseTitle}
            <table>
              ${coursesListHeader}
              ${coursesListNoComma}
            </table>
          </div>
          <div class="courses" style="font-size: 7px">
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

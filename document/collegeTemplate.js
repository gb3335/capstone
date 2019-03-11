const moment = require("moment");

module.exports = ({
  status,
  researchTotal,
  journalTotal,
  lastUpdate,
  courses,
  typeOfReport,
  college
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
            researchTotal === true ? `<td>${indCourse.researchTotal}</td>` : ""
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

    courseTitle = `<h4 style="font-size: 10px">Courses:</h4>`;
  } else {
    totalcourse = "";
    courseTitle = "";
    coursesListNoComma = "";
    coursesListHeader = "";
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
          College of Information and Communications Technology
          <br />
          <br />
          <br />
          <h4>${typeOfReport}</h4>
          <h4>University Research Office</h4>
        </div>
          <div style="font-size: 10px;">
            <p style="float: left;">
              <b>College Name: </b>${collegeName}&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}
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
      </div>
    </body>
  </html>
  `;
};

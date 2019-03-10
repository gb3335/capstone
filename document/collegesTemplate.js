const moment = require("moment");

module.exports = ({
  status,
  coursesTotal,
  researchTotal,
  journalTotal,
  lastUpdate,
  colleges,
  typeOfReport
}) => {
  let collegesList;
  let collegesListNoComma = "";
  let collegesListHeader;

  let totalNumOfColleges = 0;
  let numberOfColForEndRow = 0;

  let totalcol = colleges.length;

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  if (status === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (coursesTotal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (researchTotal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (journalTotal === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (lastUpdate === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  numberOfColForEndRow = 4 + numberOfColForEndRow;

  if (totalcol == 0) {
    collegesList = "No Researches in this College";
    collegesListHeader = "";
  } else {
    collegesList = colleges.map(
      (college, index) =>
        "<tr>" +
        `<td>${++index}</td>` +
        `<td>${college.name.fullName}</td>` +
        `<td>${college.name.initials}</td>` +
        `<td>${college.librarian}</td>` +
        `${
          status === true
            ? college.deleted === 0
              ? "<td>Active</td>"
              : "<td>Deleted</td>"
            : ""
        }` +
        `${coursesTotal === true ? `<td>${college.course.length}</td>` : ""}` +
        `${researchTotal === true ? `<td>${college.researchTotal}</td>` : ""}` +
        `${journalTotal === true ? `<td>${college.journalTotal}</td>` : ""}` +
        `${
          lastUpdate === true
            ? `<td>${moment(college.lastUpdate.date).format(
                "MMMM Do YYYY, h:mm A"
              )}</td>`
            : ""
        }` +
        "</tr>"
    );

    collegesList.map(item => {
      collegesListNoComma = collegesListNoComma + item;
    });

    totalNumOfColleges = collegesList.length;

    collegesListNoComma =
      collegesListNoComma +
      `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

    collegesListHeader =
      "<tr>" +
      "<th>NO</th>" +
      "<th>NAME</th>" +
      "<th>INITIALS</th>" +
      "<th>LIBRARIAN</th>" +
      `${status === true ? "<th>STATUS</th>" : ""}` +
      `${coursesTotal === true ? "<th>TOTAL COURSES</th>" : ""}` +
      `${researchTotal === true ? "<th>TOTAL RESEARCHES</th>" : ""}` +
      `${journalTotal === true ? "<th>TOTAL JOURNALS</th>" : ""}` +
      `${lastUpdate === true ? "<th>UPDATED ON</th>" : ""}` +
      "</tr>";
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
  
        .bulsu-logo {
          width: 5rem;
          height: 5rem;
          float: left;
        }
  
        .cict-logo {
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
            class="bulsu-logo"
          />

          <img
            src="http://www.bulsu.edu.ph/resources/bulsu_red.png"
            alt="bulsu-logo"
            class="cict-logo"
          />
         
          <br />
          Republic of the Philippines
          <br />
          Bulacan State University
          <br />
          City of Malolos, Bulacan
          <br />
          <br />
          <br />
          <h4>${typeOfReport}</h4>
          <h4>University Research Office</h4>
        </div>
          <div class="courses" style="font-size: 7px">
            <p style="font-size: 9px"><b>Total # of Colleges: </b>${totalNumOfColleges}&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}</p>
            <table>
              ${collegesListHeader}
              ${collegesListNoComma}
            </table>
          </div>
      </div>
    </body>
  </html>
  `;
};

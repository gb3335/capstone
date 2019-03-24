const moment = require("moment");

module.exports = ({
  status,
  researchId,
  college,
  course,
  type,
  pages,
  academicYear,
  lastUpdate,
  deletedResearches,
  researches,
  typeOfReport
}) => {
  let researchesList;
  let researchesListNoComma = "";
  let researchesListHeader;

  let totalNumOfResearches = 0;
  let numberOfColForEndRow = 0;

  let totalcol = researches.length;

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  if (status === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (researchId === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (college === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (course === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (type === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (pages === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (academicYear === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (lastUpdate === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }

  numberOfColForEndRow = 2 + numberOfColForEndRow;

  if (totalcol == 0) {
    researchesList = "No Researches in this College";
    researchesListHeader = "";
  } else {
    if (deletedResearches) {
      researchesList = researches.map(
        (research, index) =>
          "<tr>" +
          `<td>${++index}</td>` +
          `<td>${research.title}</td>` +
          `${college === true ? `<td>${research.college}</td>` : ""}` +
          `${course === true ? `<td>${research.course}</td>` : ""}` +
          `${
            status === true
              ? research.deleted === 1
                ? "<td>Deleted</td>"
                : research.hidden === 0
                ? "<td>Active</td>"
                : "<td>Hidden</td>"
              : ""
          }` +
          `${type === true ? `<td>${research.type}</td>` : ""}` +
          `${researchId === true ? `<td>${research.researchID}</td>` : ""}` +
          `${pages === true ? `<td>${research.pages}</td>` : ""}` +
          `${academicYear === true ? `<td>${research.schoolYear}</td>` : ""}` +
          `${
            lastUpdate === true
              ? `<td>${moment(research.lastUpdate).format(
                  "MMMM Do YYYY, h:mm A"
                )}</td>`
              : ""
          }` +
          "</tr>"
      );
      totalNumOfResearches = researchesList.length;
    } else {
      let ind = 0;
      researchesList = researches.map((research, index) =>
        research.deleted === 0
          ? "<tr>" +
            `<td>${++ind}</td>` +
            `<td>${research.title}</td>` +
            `${college === true ? `<td>${research.college}</td>` : ""}` +
            `${course === true ? `<td>${research.course}</td>` : ""}` +
            `${
              status === true
                ? research.deleted === 1
                  ? "<td>Deleted</td>"
                  : research.hidden === 0
                  ? "<td>Active</td>"
                  : "<td>Hidden</td>"
                : ""
            }` +
            `${type === true ? `<td>${research.type}</td>` : ""}` +
            `${researchId === true ? `<td>${research.researchID}</td>` : ""}` +
            `${pages === true ? `<td>${research.pages}</td>` : ""}` +
            `${
              academicYear === true ? `<td>${research.schoolYear}</td>` : ""
            }` +
            `${
              lastUpdate === true
                ? `<td>${moment(research.lastUpdate).format(
                    "MMMM Do YYYY, h:mm A"
                  )}</td>`
                : ""
            }` +
            "</tr>"
          : ""
      );

      let ctrNoDeleted = 0;
      researches.map(research => {
        if (research.deleted === 0) {
          ++ctrNoDeleted;
        }
      });

      totalNumOfResearches = ctrNoDeleted;
    }

    researchesList.map(item => {
      researchesListNoComma = researchesListNoComma + item;
    });

    researchesListNoComma =
      researchesListNoComma +
      `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

    researchesListHeader =
      "<tr>" +
      "<th>NO</th>" +
      "<th>TITLE</th>" +
      `${college === true ? "<th>COLLEGE</th>" : ""}` +
      `${course === true ? "<th>COURSE</th>" : ""}` +
      `${status === true ? "<th>STATUS</th>" : ""}` +
      `${type === true ? "<th>TYPE</th>" : ""}` +
      `${researchId === true ? "<th>RESEARCH ID</th>" : ""}` +
      `${pages === true ? "<th>PAGES</th>" : ""}` +
      `${academicYear === true ? "<th>ACADEMIC YEAR</th>" : ""}` +
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
        <p style="font-size: 7px"><b>Total # of Researches: </b>${totalNumOfResearches}&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}</p>

        <div class="courses" style="font-size: 5px">
          <table>
          <colgroup>
          <col span="1" style="width: 5%;">
          <col span="1" style="width: 20%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 5%;">
          <col span="1" style="width: 5%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 10%;">
          <col span="1" style="width: 15%;">
          </colgroup>

          ${researchesListHeader}
          ${researchesListNoComma}
          </table>
      </div>
      </div>
    </body>
  </html>
  `;
};

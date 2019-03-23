const moment = require("moment");

module.exports = ({
  status,
  issn,
  college,
  course,
  pages,
  yearPublished,
  lastUpdate,
  deletedJournals,
  journals,
  typeOfReport
}) => {
  let journalsList;
  let journalsListNoComma = "";
  let journalListHeaders;
  let totalNumOfJournals = 0;
  let numberOfColForEndRow = 0;
  let totalcol = journals.length;

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  if (status === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (issn === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (college === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (course === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (pages === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (yearPublished === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (lastUpdate === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  numberOfColForEndRow = 2 + numberOfColForEndRow;
  if (totalcol == 0) {
    journalsList = "No Journals in this College";
    journalListHeaders = "";
  } else {
    if (deletedJournals) {
      journalsList = journals.map(
        (journal, index) =>
          "<tr>" +
          `<td>${++index}</td>` +
          `<td>${journal.title}</td>` +
          `${college === true ? `<td>${journal.college}</td>` : ""}` +
          `${course === true ? `<td>${journal.course}</td>` : ""}` +
          `${
          status === true
            ? journal.deleted === 1
              ? "<td>Deleted</td>"
              : journal.hidden === 0
                ? "<td>Active</td>"
                : "<td>Hidden</td>"
            : ""
          }` +

          `${issn === true ? `<td>${journal.issn}</td>` : ""}` +
          `${pages === true ? `<td>${journal.pages}</td>` : ""}` +
          `${yearPublished === true ? `<td>${journal.yearPublished}</td>` : ""}` +
          `${
          lastUpdate === true
            ? `<td>${moment(journal.lastUpdate).format(
              "MMMM Do YYYY, h:mm A"
            )}</td>`
            : ""
          }` +
          "</tr>"
      );
      totalNumOfJournals = journalsList.length;
    } else {
      let ind = 0;
      journalsList = journals.map((journal, index) =>
        journal.deleted === 0
          ? "<tr>" +
          `<td>${++ind}</td>` +
          `<td>${journal.title}</td>` +
          `${college === true ? `<td>${journal.college}</td>` : ""}` +
          `${course === true ? `<td>${journal.course}</td>` : ""}` +
          `${
          status === true
            ? journal.deleted === 1
              ? "<td>Deleted</td>"
              : journal.hidden === 0
                ? "<td>Active</td>"
                : "<td>Hidden</td>"
            : ""
          }` +

          `${issn === true ? `<td>${journal.issn}</td>` : ""}` +
          `${pages === true ? `<td>${journal.pages}</td>` : ""}` +
          `${
          yearPublished === true ? `<td>${journal.yearPublished}</td>` : ""
          }` +
          `${
          lastUpdate === true
            ? `<td>${moment(journal.lastUpdate).format(
              "MMMM Do YYYY, h:mm A"
            )}</td>`
            : ""
          }` +
          "</tr>"
          : ""
      );

      let ctrNoDeleted = 0;
      journals.map(journal => {
        if (journal.deleted === 0) {
          ++ctrNoDeleted;
        }
      });

      totalNumOfJournals = ctrNoDeleted;
    }

    journalsList.map(item => {
      journalsListNoComma = journalsListNoComma + item;
    });

    journalsListNoComma =
      journalsListNoComma +
      `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

    journalListHeaders =
      "<tr>" +
      "<th>NO</th>" +
      "<th>TITLE</th>" +
      `${college === true ? "<th>COLLEGE</th>" : ""}` +
      `${course === true ? "<th>COURSE</th>" : ""}` +
      `${status === true ? "<th>STATUS</th>" : ""}` +

      `${issn === true ? "<th>ISSN</th>" : ""}` +
      `${pages === true ? "<th>PAGES</th>" : ""}` +
      `${yearPublished === true ? "<th>YEAR PUBLISHED</th>" : ""}` +
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
        <div class="courses" style="font-size: 5px">
          <p style="font-size: 7px"><b>Total # of Colleges: </b>${totalNumOfJournals}&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}</p>
          <table>
          ${journalListHeaders}
          ${journalsListNoComma}
          </table>
      </div>
      </div>
    </body>
  </html>
  `;
};

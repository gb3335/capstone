module.exports = ({
  status,
  coursesTotal,
  researchTotal,
  journalTotal,
  colleges,
  typeOfReport
}) => {
  let collegesList;
  let collegesListNoComma = "";
  let collegesListHeader;

  let totalcol = colleges.length;

  if (totalcol == 0) {
    collegesList = "No Researches in this College";
    collegesListHeader = "";
  } else {
    collegesList = colleges.map(
      college =>
        "<tr>" +
        `<td>${college.name.fullName}</td>` +
        `<td>${college.name.initials}</td>` +
        `<td>${college.librarian}</td>` +
        `<td>${
          status === true
            ? college.deleted === 0
              ? "Active"
              : "Deleted"
            : "Not Available"
        }</td>` +
        `<td>${
          coursesTotal === true ? college.course.length : "Not Available"
        }</td>` +
        `<td>${
          researchTotal === true ? college.researchTotal : "Not Available"
        }</td>` +
        `<td>${
          journalTotal === true ? college.journalTotal : "Not Available"
        }</td>` +
        `<td>${new Date(college.lastUpdate.date).toLocaleString()}</td>` +
        "</tr>"
    );

    collegesList.map(item => {
      collegesListNoComma = collegesListNoComma + item;
    });

    collegesListHeader =
      "<tr>" +
      "<th>Name</th>" +
      "<th>Initials</th>" +
      "<th>Librarian</th>" +
      "<th>Status</th>" +
      "<th>Total Courses</th>" +
      "<th>Total Researches</th>" +
      "<th>Total Journals</th>" +
      "<th>Updated on</th>" +
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
          background-color: #dddddd;
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
            src="http://www.bulsu.edu.ph/resources/colleges-logo/CICT.png"
            alt="cict-logo"
            class="cict-logo"
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
        </div>
        <div class="reportBody" style="padding: 7px; border: 1px solid gray">
          <div class="courses" style="font-size: 7px">
            <h4 style="font-size: 10px">Colleges:</h4>
            <table>
              ${collegesListHeader}
              ${collegesListNoComma}
            </table>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};

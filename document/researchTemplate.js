const moment_timezone = require("moment-timezone");
const moment = require("moment");

module.exports = ({
  college,
  course,
  researchId,
  pages,
  academicYear,
  lastUpdate,
  type,
  abstract,
  authors,
  research,
  typeOfReport
}) => {
  let collegeString = "";
  let courseString = "";
  let researchIdString = "";
  let pagesString = "";
  let academicYearString = "";
  let lastUpdateString = "";
  let typeString = "";
  let abstractString = "";
  let authorsList = "";
  let authorsListNoComma = "";
  let authorsHeader = "";
  let authorsTitle = "";

  const currentDate = moment_timezone()
    .tz("Asia/Manila")
    .format("MMMM Do YYYY, h:mm A");

  if (college) {
    collegeString = `<li>College: ${research.college}</li>`;
  }
  if (course) {
    courseString = `<li>Course: ${research.course}</li>`;
  }
  if (researchId) {
    researchIdString = `<li>Research ID: ${research.researchID}</li>`;
  }
  if (pages) {
    pagesString = `<li>Pages: ${research.pages}</li>`;
  }
  if (academicYear) {
    academicYearString = `<li>Academic Year: ${research.schoolYear}</li>`;
  }
  if (lastUpdate) {
    lastUpdateString = `<li>Last Update: ${moment(research.lastUpdate).format(
      "MMMM Do YYYY, h:mm A"
    )}</li>`;
  }
  if (type) {
    typeString = `<li>Type: ${research.type}</li>`;
  }
  if (abstract) {
    abstractString = `<div class="details" style="font-size: 7px">
                        <h4 style="font-size: 7px">College Abstract:</h4>
                        <div>
                          <p>${research.abstract}</p>
                        </div>
                      </div>`;
  }

  if (authors) {
    authorsList = research.author.map(
      (auth, index) =>
        `<tr><td>${++index}</td><td>${
          auth.role === "Author One"
            ? `${auth.name} (Author One)`
            : `${auth.name}`
        }</td></tr>`
    );
    authorsHeader = "<tr><th>NO</th><th>NAME</th></tr>";

    authorsTitle = `<h4 style="font-size: 7px">Authors:</h4>`;

    authorsList.map(item => {
      authorsListNoComma = authorsListNoComma + item;
    });

    authorsListNoComma =
      authorsListNoComma +
      `<tr class="blank_row"><td colspan="2" style="text-align:center;">- Nothing Follows -</td></tr>`;
  } else {
    authorsList = "";
    authorsHeader = "";
    authorsTitle = "";
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
          width: 3rem;
          height: 3rem;
          float: left;
        }
  
        .cict-logo {
          width: 3rem;
          height: 3rem;
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
        <div class="item1 headerr" style="font-size: 7px">
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
        <div style="font-size: 7px;">
            <p style="float: left;">
              <b>Research Title: </b>${research.title}
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
              ${collegeString}
              ${courseString}
              ${researchIdString}
              ${pagesString}
              ${academicYearString}
              ${lastUpdateString}
              ${typeString}
            </ul>
          </div>
        </div>
         ${abstractString}
        <br/>
        <div class="authors" style="font-size: 7px">
            ${authorsTitle}
            <table>
              ${authorsHeader}
              ${authorsListNoComma}
            </table>
        </div>
      </div>
    </body>
  </html>
  `;
};

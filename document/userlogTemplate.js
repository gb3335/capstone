const moment_timezone = require("moment-timezone");
const moment = require("moment");

module.exports = ({
  activities,
  typeOfReport,
  userType,
  userName,
  type,
  date,
  time
}) => {
  const currentDate = moment_timezone()
    .tz("Asia/Manila")
    .format("MMMM Do YYYY, h:mm A");

  let ctr = 1;
  let activitiesList;
  let activitiesListNoComma = "";
  let activitiesHeader = `
            <th>NO</th>
            
            ${userName ? `<th>USER</th>` : ""}
            ${userType ? `<th>USER TYPE</th>` : ""}
            ${date ? `<th>DATE</th>` : ""}
            ${time ? `<th>TIME</th>` : ""}
            ${type ? `<th>ACTIVITY</th>` : ""}`;


  activitiesList = activities.map(
    (activity, index) =>
      `<tr>
        <td>${++index}</td>
        ${userName ? `<td>${activity.user}</td>` : ""}
        ${userType ? `<td>${activity.userlogs}</td>` : ""}
        ${date ? `<td>${activity.date.substr(24)}</td>` : ""}
        ${time ? `<td>${activity.time}</td>` : ""}
        ${type ? `<td>${activity.type}</td>` : ""}
      </tr>`
  );

  activitiesList.map(item => {
    activitiesListNoComma = activitiesListNoComma + item;
  });

  if (userType) {
    ctr++;
  }
  if (userName) {
    ctr++;
  }
  if (type) {
    ctr++;
  }
  if (date) {
    ctr++;
  }
  if (time) {
    ctr++;
  }
  activitiesListNoComma =
    activitiesListNoComma +
    `<tr class="blank_row"><td colspan="${ctr}" style="text-align:center;">- Nothing Follows -</td></tr>`;

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
        <p style="font-size: 7px"><b>Total # of Activities: </b>${
    activities.length
    }&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}</p>

        <div class="courses" style="font-size: 7px">
          <table>
          <tr>
            ${activitiesHeader}
          </tr>
          ${activitiesListNoComma}
          </table>
      </div>
      </div>
    </body>
  </html>
  `;
};

const moment = require("moment");

module.exports = ({
  email,
  userName,
  college,
  type,
  status,
  dateCreated,
  blockedUsers,
  users,
  typeOfReport
}) => {
  let userList;
  let usersListNoComma = "";
  let usersListHeaders;
  let totalNumOfUsers = 0;
  let numberOfColForEndRow = 0;
  let totalcol = users.length;

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");

  String.prototype.getInitials = function(glue) {
    if (typeof glue == "undefined") {
      var glue = true;
    }

    var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

    if (glue) {
      return initials.join(".");
    }

    return initials;
  };

  if (email === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (userName === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (college === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (type === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (status === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  if (dateCreated === true) {
    numberOfColForEndRow = ++numberOfColForEndRow;
  }
  numberOfColForEndRow = 2 + numberOfColForEndRow;
  if (totalcol == 0) {
    userList = "No Journals in this College";
    usersListHeaders = "";
  } else {
    if (blockedUsers) {
      userList = users.map(
        (user, index) =>
          "<tr>" +
          `<td>${++index}</td>` +
          `<td>${user.name.lastName}, ${user.name.firstName} ${
            user.name.middleName
              ? user.name.middleName.getInitials() + ". "
              : ""
          }</td>` +
          `${email === true ? `<td>${user.email}</td>` : ""}` +
          `${
            userName === true
              ? `<td>${user.userName ? user.userName : `None`}</td>`
              : ""
          }` +
          `${type === true ? `<td>${user.userType}</td>` : ""}` +
          `${
            college === true
              ? `<td>${
                  (user.college === null) |
                  (user.college === "") |
                  (user.college === "undefined")
                    ? `None`
                    : user.college
                }</td>`
              : ""
          }` +
          `${
            status === true
              ? `<td>${user.isBlock === 0 ? `ACTIVE` : `DEACTIVATED`}</td>`
              : ""
          }` +
          `${
            dateCreated === true
              ? `<td>${moment(user.date).format("MMMM Do YYYY, h:mm A")}</td>`
              : ""
          }` +
          "</tr>"
      );
      totalNumOfUsers = userList.length;
    } else {
      let ind = 0;
      userList = users.map((user, index) =>
        user.isBlock === 0
          ? "<tr>" +
            `<td>${++ind}</td>` +
            `<td>${user.name.lastName}, ${user.name.firstName} ${
              user.name.middleName
                ? user.name.middleName.getInitials() + ". "
                : ""
            }</td>` +
            `${email === true ? `<td>${user.email}</td>` : ""}` +
            `${userName === true ? `<td>${user.userName}</td>` : ""}` +
            `${type === true ? `<td>${user.userType}</td>` : ""}` +
            `${
              college === true
                ? `<td>${
                    (user.college === null) |
                    (user.college === "") |
                    (user.college === "undefined")
                      ? `None`
                      : user.college
                  }</td>`
                : ""
            }` +
            `${
              status === true
                ? `<td>${user.isBlock === 0 ? `ACTIVE` : `DEACTIVATED`}</td>`
                : ""
            }` +
            `${
              dateCreated === true
                ? `<td>${moment(user.date).format("MMMM Do YYYY, h:mm A")}</td>`
                : ""
            }` +
            "</tr>"
          : ""
      );

      let ctrNoDeleted = 0;
      users.map(user => {
        if (user.deleted === 0) {
          ++ctrNoDeleted;
        }
      });

      totalNumOfUsers = ctrNoDeleted;
    }

    userList.map(item => {
      usersListNoComma = usersListNoComma + item;
    });

    usersListNoComma =
      usersListNoComma +
      `<tr class="blank_row"><td colspan="${numberOfColForEndRow}" style="text-align:center;">- Nothing Follows -</td></tr>`;

    usersListHeaders =
      "<tr>" +
      "<th>NO</th>" +
      "<th>NAME</th>" +
      `${email === true ? `<th>EMAIL</th>` : ""}` +
      `${userName === true ? "<th>USERNAME</th>" : ""}` +
      `${type === true ? "<th>TYPE</th>" : ""}` +
      `${college === true ? "<th>COLLEGE</th>" : ""}` +
      `${status === true ? "<th>STATUS</th>" : ""}` +
      `${dateCreated === true ? "<th>DATE CREATED</th>" : ""}` +
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
          <p style="font-size: 7px"><b>Total # of Research: </b>${totalNumOfUsers}&nbsp;&nbsp;&nbsp;<b>Date Printed: </b>${currentDate}</p>
          <table>
          ${usersListHeaders}
          ${usersListNoComma}
          </table>
      </div>
      </div>
    </body>
  </html>
  `;
};

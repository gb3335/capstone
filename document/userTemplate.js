const moment_timezone = require("moment-timezone");
const moment = require("moment");

module.exports = ({

  user,
  typeOfReport,
}) => {
  let nameString = "";
  let userNameString = "";
  let emailString = "";
  let collegeString = "";
  let statusString = "";
  let lastUpdateString = "";
  let dateCreatedString = "";

  const currentDate = moment().format("MMMM Do YYYY, h:mm A");
  // name: this.state.name,
  // userName: this.state.userName,
  // email: this.state.email,
  // type: this.state.type,
  // type: this.state.type,
  // college: this.state.college,
  // status: this.state.status,
  // dateCreated: this.state.dateCreated,
  // blockedUsers: this.state.blockedUsers,
  // users: this.props.users.users,
  String.prototype.getInitials = function (glue) {
    if (typeof glue == "undefined") {
      var glue = true;
    }

    var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

    if (glue) {
      return initials.join('.');
    }

    return initials;
  };


  if (user) {


    nameString = `<li>Name: ${user.name.lastName}, ${user.name.firstName} ${user.name.middleName.getInitials()}.</li>`;


    userNameString = `<li>Username: ${user.userName ? user.userName : `No username yet.`}</li>`;


    emailString = `<li>Email: ${user.email}</li>`;


    collegeString = `<li>College: ${user.colleg ? user.college : "None"}</li>`;


    statusString = `<li>User Status: ${user.isBlock === 0 ? `Active` : `Deactivated`}</li>`;


    dateCreatedString = `<li>Date Created: ${moment(user.date).format(
      "MMMM Do YYYY, h:mm A"
    )}</li>`;
  }
  let path
  user.avatar === "/images/User.png" ? path = "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/5caab69692cdb0204c7874ae-613b016c-6830-44f7-9ccb-9a813099fbb0.png" : path = "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" + user.avatar;





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
            "header "
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

        .user-logo {
          width: 8rem;
          height: 8rem;
          float: left;
        }
  
        .users-logo {
          width: 8rem;
          height: 8rem;
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
          <h4>
          <br />
          Republic of the Philippines
          <br />
          Bulacan State University
          <br />
          City of Malolos, Bulacan
          <br />
          <br />
          <br />
          </h4>
          <h2>${typeOfReport}</h2>
          <h2>University Research Office</h2>
        
        </div>
        <div style="font-size: 7px;">
            <p style="float: left;">
             
              <br />
              <h4><b>Date Printed: </b>${currentDate}</h4>
            </p>
          </div>
         
          <hr />
         <div class"logo" style="margin-top:30px;margin-left:275px"> 
          <img src="${path}"
          alt="user-logo"
          class="user-logo"
            />
          
          </div>
        <div class="details" style="font-size: 7px">
         
          <h4 style="font-size: 13px; margin-top:180px">User Details:</h4>
          <div>
            <ul style="list-style-type:circle; text-align: left;font-size: 11px">
              ${nameString}
              ${userNameString}
              ${emailString}
              ${collegeString}
              ${statusString}
              ${lastUpdateString}
              ${dateCreatedString}
            </ul>
          </div>
        </div>
         
        <br/>
       
      </div>
    </body>
  </html>
  `;
};

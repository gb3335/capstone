module.exports = ({
  status,
  researchTotal,
  journalTotal,
  courses,
  typeOfReport,
  college
}) => {
  let librarian = college.librarian;
  let stat;
  let totalres;
  let totaljour;
  let totalcourse;
  let coursesList;
  let lastUpdate = college.lastUpdate.date;
  let collegeName = college.name.fullName;
  let today = new Date();

  if (status === true) {
    if (college.status === 0) {
      stat = "Active";
    } else {
      stat = "Inactive";
    }
  } else {
    stat = "Not Available";
  }

  if (researchTotal === true) {
    totalres = college.researchTotal;
  } else {
    totalres = "Not Available";
  }

  if (journalTotal === true) {
    totaljour = college.journalTotal;
  } else {
    totaljour = "Not Available";
  }

  if (courses === true) {
    totalcourse = college.course.length;

    coursesList = college.course.map(
      indCourse =>
        "<tr>" +
        `<td>${indCourse.name}</td>` +
        `<td>${indCourse.initials}</td>` +
        `<td>${indCourse.status === 0 ? "Active" : "Inactive"}</td>` +
        `<td>${indCourse.researchTotal}</td>` +
        `<td>${indCourse.journalTotal}</td>` +
        "</tr>"
    );
  } else {
    totalcourse = "Not Available";
    coursesList = "Not Available";
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
          <div style="font-size: 10px;">
            <h3 style="float: left;">
              ${collegeName}
            </h3>
          </div>
  
          <br />
          <hr />
          <div class="details" style="font-size: 10px">
            <h4 style="font-size: 9px">Details:</h4>
            <div>
              <ul style="list-style-type:circle; text-align: left">
                <li>Librarian: ${librarian}</li>
                <li>Status: ${stat}</li>
                <li>Total Researches: ${totalres}</li>
                <li>Total Journals: ${totaljour}</li>
                <li>Total Courses: ${totalcourse}</li>
                <li>Last Update: ${lastUpdate}</li>
              </ul>
            </div>
          </div>
          <div class="courses" style="font-size: 9px">
            <h4 style="font-size: 10px">Courses:</h4>
            <table>
              <tr>
                <th>Name</th>
                <th>Initials</th>
                <th>Status</th>
                <th>Research Total</th>
                <th>Journal Total</th>
              </tr>
             ${coursesList}
            </table>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};

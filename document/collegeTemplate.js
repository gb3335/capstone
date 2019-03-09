module.exports = ({
  status,
  research,
  journal,
  courses,
  typeOfReport,
  college,
  researchOfCol
}) => {
  let librarian = college.librarian;
  let stat;
  let lastUpdate = college.lastUpdate.date;
  lastUpdate = new Date(lastUpdate);
  let collegeName = college.name.fullName;

  // for researches table
  let totalresearch;
  let researchList;
  let researchListNoComma = "";
  let researchListHeader;

  // for journals table
  let totaljour;

  // for courses table
  let totalcourse;
  let coursesList;
  let coursesListNoComma = "";
  let coursesListHeader;

  if (status === true) {
    if (college.status === 0) {
      stat = "Active";
    } else {
      stat = "Inactive";
    }
  } else {
    stat = "Not Available";
  }

  if (journal === true) {
    totaljour = college.journalTotal;
  } else {
    totaljour = "Not Available";
  }

  // College course list and count
  if (courses === true) {
    totalcourse = college.course.length;

    if (totalcourse == 0) {
      coursesList = "No Courses in this College";
      coursesListHeader = "";
    } else {
      coursesList = college.course.map(
        indCourse =>
          "<tr>" +
          `<td>${indCourse.name}</td>` +
          `<td>${indCourse.initials}</td>` +
          `<td>${
            indCourse.deleted === 1
              ? "Deleted"
              : indCourse.status === 0
              ? "Active"
              : "Inactive"
          }</td>` +
          `<td>${indCourse.researchTotal}</td>` +
          `<td>${indCourse.journalTotal}</td>` +
          "</tr>"
      );

      coursesList.map(item => {
        coursesListNoComma = coursesListNoComma + item;
      });

      coursesListHeader =
        "<tr>" +
        "<th>Name</th>" +
        "<th>Initials</th>" +
        "<th>Status</th>" +
        "<th>Research Total</th>" +
        "<th>Journal Total</th>" +
        "</tr>";
    }
  } else {
    totalcourse = "Not Available";
    coursesList = "Not Available";
    coursesListHeader = "";
  }

  // College researches list and count
  if (research === true) {
    totalresearch = researchOfCol.length;

    if (totalresearch == 0) {
      researchList = "No Researches in this College";
      researchListHeader = "";
    } else {
      researchList = researchOfCol.map(
        indRes =>
          "<tr>" +
          `<td>${indRes.title}</td>` +
          `<td>${indRes.type}</td>` +
          `<td>${
            indRes.deleted === 1
              ? "Deleted"
              : indRes.hidden === 0
              ? "Active"
              : "Hidden"
          }</td>` +
          `<td>${indRes.course}</td>` +
          `<td>${indRes.schoolYear}</td>` +
          "</tr>"
      );

      researchList.map(item => {
        researchListNoComma = researchListNoComma + item;
      });

      researchListHeader =
        "<tr>" +
        "<th>Title</th>" +
        "<th>Type</th>" +
        "<th>Status</th>" +
        "<th>Course</th>" +
        "<th>Academic Year</th>" +
        "</tr>";
    }
  } else {
    totalresearch = "Not Available";
    researchList = "Not Available";
    researchListHeader = "";
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
          <br />
          <hr />
          <div class="details" style="font-size: 10px">
            <h4 style="font-size: 9px">Details:</h4>
            <div>
              <ul style="list-style-type:circle; text-align: left">
                <li>Librarian: ${librarian}</li>
                <li>Status: ${stat}</li>
                <li>Total Researches: ${totalresearch}</li>
                <li>Total Journals: ${totaljour}</li>
                <li>Total Courses: ${totalcourse}</li>
                <li>Last Update: ${lastUpdate.toLocaleString()}</li>
              </ul>
            </div>
          </div>
          <div class="courses" style="font-size: 9px">
            <h4 style="font-size: 10px">Courses:</h4>
            <table>
              ${coursesListHeader}
              ${coursesListNoComma}
            </table>
          </div>
          <div class="researches" style="font-size: 9px">
            <h4 style="font-size: 10px">Researches:</h4>
            <table>
              ${researchListHeader}
              ${researchListNoComma}
            </table>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};

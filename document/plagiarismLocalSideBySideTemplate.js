const moment = require("moment");

const moment_timezone = require("moment-timezone");

module.exports = input => {
  const {
    typeOfReport,
    subTypeOfReport,
    output,
    pattern,
    text,
    comparedJournal,
    journal,
    reportFor
  } = input;

  let docuFound = "";
  let title = "";
  let score = "[";

  const currentDate = moment_timezone()
    .tz("Asia/Manila")
    .format("MMMM Do YYYY, h:mm A");
  let level = "";

  if (output[0].SimilarityScore > 0 && output[0].SimilarityScore < 30) {
    level = "<span class='little-text'>Little Plagiarism</span";
  } else if (
    output[0].SimilarityScore >= 30 &&
    output[0].SimilarityScore <= 70
  ) {
    level = "<span class='moderate-text'>Moderate Plagiarism</span";
  } else if (output[0].SimilarityScore > 70) {
    level = "<span class='heavy-text'>Heavy Plagiarism</span";
  } else {
    level = "<span>Clean</span";
  }
  let plagiarised = output[0].SimilarityScore;

  let clean = 100 - plagiarised;

  let journalDetailString =
    reportFor === "Journal"
      ? `<div class="context" style="margin-top:-10px">
  <h6>
  <p>Type: Journal</p>
   
    <p>Volume #: ${journal.volume}</p>
    <p>ISSN: ${journal.issn}</p>
    <p>Year Published: ${journal.yearPublished}</p>
    </h6>
</div>`
      : `<div> </div>`;
  let journalComparedString =
    reportFor === "Journal"
      ? `<div class="context" style="margin-top:-10px">
<h6>
<p>Type: Journal</p>
  
  <p>Volume #: ${comparedJournal.volume}</p>
  <p>ISSN: ${comparedJournal.issn}</p>
  <p>Year Published: ${comparedJournal.yearPublished}</p>
  </h6>
</div>`
      : `<div> </div>`;

  score += clean + "," + plagiarised + "]";

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
          position: absolute;
          width: 5rem;
          height: 5rem;
          padding-left: 40px;
          padding-top: 10px;
          
        }
        .bulsu-logo2 {
          width: 5rem;
          height: 5rem;
          float: left;
          visibility:hidden;
        }
        .blank_row {
          height: 10px !important; /* overwrites any other rules */
          background-color: #FFFFFF;
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
          background-color: #3d3d3d;
          color: white;
        }
        .blank_row {
            height: 10px !important; /* overwrites any other rules */
            background-color: #FFFFFF;  
        }
        .pie-container{
            padding-top: 30px;
            width: 500px; 
            margin: auto;
        }
        .over-container{
            padding-top: 20px;
            padding-bottom: 20px;
            width: 450px;
            margin: auto;
        }
.overview{
    font-size: 7px;
    font-weight: bold;
    margin-bottom: 5px;
}
.overviewContent{
    font-size: 7px;
    
}
.little-text{
   color: #36A2EB;
}
.moderate-text{
   color: #f49e61;
}
.heavy-text{
   color: #FF6384;
}
.note{
    margin-top:10px;
    font-size: 7px;
    font-style: italic;
}
mark {
  background: rgba(250, 159, 179, 0.589);
  color: inherit;
  padding: 0;
}
      </style>
    </head>
    <body>
    <img
            src="http://www.bulsu.edu.ph/resources/bulsu_red.png"
            alt="bulsu-logo"
            class="bulsu-logo"
          />
      <div class="grid-container">
        <div class="item1 headerr" style="font-size: 12px">
          <img
            src="http://www.bulsu.edu.ph/resources/bulsu_red.png"
            alt="bulsu-logo"
            class="bulsu-logo2"
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
          <h5>${typeOfReport}</h5>
          <h6>${subTypeOfReport} ${currentDate}</h6>
          <h5>University Research Office</h5>
        </div>
        
        <div class="courses" style="font-size: 7px">
            <div class="pie-container">
                <canvas id="pie"></canvas>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <h4 style="font-size: 10px">Source Document for Plagiarism: ${
              output[0].Document.Pattern.Name
            }${journalDetailString}</h4>
            <div class="context">
                <p>${pattern}</p>
            </div>
            <br />
            <h4 style="font-size: 10px">Target Document for Plagiarism: ${
              output[0].Document.Text.Name
            }${journalDetailString}</h4>
            <div class="context2">
                <p>${text}</p>
            </div>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
    <script>
        
        Chart.defaults.global.defaultFontSize = 9;
        const canvas = document.getElementById('pie');
        const data = {
            labels : ["Uniqueness Percentage ${parseFloat(clean).toFixed(
              2
            )}", "Similarity Percentage ${parseFloat(plagiarised).toFixed(2)}"],
            datasets : [
                {
                    data : ${score},
                    backgroundColor: [
                    '#36A2EB',
                    '#FF6384'
                    ]
                }
            ]
        }
        const pieChart = new Chart(canvas,{
            type:"pie",
            data: data,
            options: {
              animation: false,
              legend: {
                position: "right"
              }
            }
        })
        
        
    </script>
    </body>
    
  </html>
  `;
};

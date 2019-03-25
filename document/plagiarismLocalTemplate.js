const moment = require("moment");

const moment_timezone = require('moment-timezone');

module.exports = (input) => {
  
const {typeOfReport, subTypeOfReport , output, word} = input;

  let little= 0, moderate= 0, heavy=0;
  let docuFound="";
  let title = "";
  let words = "\""+word+"\"";
  const currentDate = moment_timezone().tz('Asia/Manila').format("MMMM Do YYYY, h:mm A");
  let score="[";
  output.forEach((out, index)=>{
      if(out.SimilarityScore>0 && out.SimilarityScore<30){
        little++;
        docuFound+=`<tr>
                      <td>${index+1}</td>
                      <td>${out.Document.Text.Name}</td>
                      <td>${parseFloat(out.SimilarityScore).toFixed(2)}%</td>
                  </tr>`
      }else if(out.SimilarityScore>=30 && out.SimilarityScore<=70){
        moderate++;
        docuFound+=`<tr>
                      <td>${index+1}</td>
                      <td>${out.Document.Text.Name}</td>
                      <td>${parseFloat(out.SimilarityScore).toFixed(2)}%</td>
                    </tr>`
      }
      else if(out.SimilarityScore>70){
        heavy++;
        docuFound+=`<tr>
                      <td>${index+1}</td>
                      <td>${out.Document.Text.Name}</td>
                      <td>${parseFloat(out.SimilarityScore).toFixed(2)}%</td>
                    </tr>`
      }
      title=out.Document.Pattern.Name;
      
  })

  docuFound+=`<tr class="blank_row"><td colspan="${3}" style="text-align:center;">- Nothing Follows -</td></tr>`

  score+=little+','+moderate+','+heavy+']'
  


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
            font-size: 15;
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
        <h6>Research Title: ${title}</h6>
        <div class="courses" style="font-size: 7px">
            <div class="pie-container">
                <canvas id="pie"></canvas>
            </div>
            <h4 style="font-size: 10px">Text Checked for Plagiarism: </h4>
            <div class="context">
                <p>${word}</p>
            </div>
            <div class="courses" style="font-size: 7px">
                <h4 style="font-size: 10px">Documents Found: ${little+moderate+heavy} &nbsp;&nbsp;&nbsp;Date Printed: ${currentDate}</h4>
                <table>
                    <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Similarity Score</th>
                    </tr>
                   ${docuFound}
                </table>
            </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>

    <script>

        
        Chart.defaults.global.defaultFontSize = 9;
        const canvas = document.getElementById('pie');

        const data = {
            labels : ["Little Plagiarism ${little}", "Moderate Plagiarism ${moderate}", "Heavy Plagiarism ${heavy}"],
            datasets : [
                {
                    data : ${score},
                    backgroundColor: [
                    '#36A2EB',
                    '#f49e61',
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

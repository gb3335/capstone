const moment = require("moment");

module.exports = (input) => {
  
const {typeOfReport, subTypeOfReport , output, pattern, word} = input;

  let little= 0, moderate= 0, heavy=0;
  let docuFound="";
  let title = "";
  let words = "\""+word+"\"";
  const currentDate = moment().format("MMMM Do YYYY, h:mm A");
  let score="["
  output.forEach((out, index)=>{
      if(out.SimilarityScore>0 && out.SimilarityScore<30){
      little++;
      }else if(out.SimilarityScore>=30 && out.SimilarityScore<=70){
      moderate++;
      }
      else if(out.SimilarityScore>70){
      heavy++;
      }
      title=out.Document.Pattern.Name;
      docuFound+=`<tr>
                    <td>${index+1}</td>
                    <td>${out.Document.Text.Id}</td>
                    <td>${parseFloat(out.SimilarityScore).toFixed(2)}%</td>
                  </tr>`
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
          width: 5rem;
          height: 5rem;
          float: left;
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
            padding-top: 50px;
            padding-bottom: 5px;
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
      <div class="grid-container">
        <div class="item1 headerr" style="font-size: 12px">
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
          <h5>${typeOfReport}</h5>
          <h6>${subTypeOfReport}</h6>
          <h5>University Research Office</h5>
        </div>
        <br/>
            <br/>
        <div class="courses" style="font-size: 8px">
            <div class="pie-container">
                <canvas id="pie"></canvas>
            </div>
            <div class="over-container">
                <div class="overview">Statistics Overview</div>
                <div class="overviewContent mb-2">Number Of Candidate Document: ${little+moderate+heavy}</div>
                <div class="overviewContent heavy-text">Heavy Plagiarism: ${heavy}</div>
                <div class="overviewContent moderate-text">Moderate Plagiarism: ${moderate}</div>
                <div class="overviewContent little-text">Little Plagiarism: ${little}</div>
                <div class="note">Note: Little Plagiarism is less than 30% similarity score, 30 to 69% for Moderate and 70 to 100% for Heavy</div>
            </div>
            <br/>
            <br/>
            <h4 style="font-size: 10px">Text Checked for Plagiarism: </h4>
            <div class="context">
                <p>${pattern}</p>
            </div>
            <div class="courses" style="font-size: 7px">
                <h4 style="font-size: 10px">Websites Found: ${little+moderate+heavy} &nbsp;&nbsp;&nbsp;Date Printed: ${currentDate}</h4>
                <table>
                    <tr>
                    <th>#</th>
                    <th>Link</th>
                    <th>Similarity Score</th>
                    </tr>
                   ${docuFound}
                </table>
            </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"></script>

    <script>

        Chart.defaults.global.defaultFontSize = 9;
        const canvas = document.getElementById('pie');

        const data = {
            labels : ["Little Plagiarism", "Moderate Plagiarism", "Heavy Plagiarism"],
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
            options: {}
        })
        
    </script>
    <script>
    var options = {
      "accuracy": {
          "value": "exactly",
          "limiters": ['!', '@', '#', '&', '*', '(', ')', '-', '–', '—', '+', '=', '[', ']', '{', '}', '|', ':', ';', '‘', '’', '“', '”', ',', '.', '<', '>', '/', '?']
      }
    };
       
        var context = document.querySelector(".context");
        var instance = new Mark(context);
        instance.mark(${words}, options);
    </script>
    </body>

    
  </html>

  `;
};

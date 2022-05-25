
<template>
  <div>
    <v-container fluid>
      <v-row align="center">
        <v-col cols="2" sm="2" style="margin-top:20px">
         <span class="tickedSearch"> Unesite ID tiketa</span>
          <input
            v-on:keyup="checkIfEligible"
            v-on:change="checkIfEligible"
            v-model="ticketId"
            class="pera form-control"
          />

          <select
          class="form-control lista"
          v-on:change="selectSource($event)"
          >
          <option selected value="1">Online</option>
          <option value="2">Retail</option>
          </select>
          <div v-if="loadingData!=null" >
              <input type="radio" name="tip" v-on:change="view='web'"/><span class="tip">Web</span>&nbsp;
              <input type="radio" name="tip" v-on:change="view='land'" checked/><span class="tip">Land</span>
          </div>
          <button class="btn btn-danger" v-if="loadingData!=null" v-on:click="download()">Preuzmi</button>
          <br/>
           <v-btn
            class="btnSearch"
            :disabled="isError"
            elevation="2"
            outlined
            plain
            raised
            v-on:click="getData"
            >Pretraži</v-btn
          >
        </v-col>
        <v-col cols="10" sm="10" class="mtop3" v-if="loadingData!=null && loadingData!=true && data.length>0 && view=='land'">
        <v-container
          id="tiket"
          class="ticket"
          style="width:62%!important"
        >
        

          <table style="margin-top: 15px; background:white; width: 100%">
            <thead >  
              <p class="barcode" style="width:245%;">
                    <img
                      style="margin:0px auto"
                      src="@/assets/barkod.png"
                      height='60'
                    />
              </p>
            </thead>
            <tbody>
              <tr class="header">
                <td class="logo">
                  <img
                    
                      src="@/assets/logo-crni.png"
                    />
                 </td>
                 <td>
                  <p id="ticketDetails">
                      {{ globalTicketData["Vreme Uplate"] }} <br>
                      ID: {{ globalTicketData["ID Tiketa"] }} <br>

                  </p>
                </td>
                 <td>
                   <img
                    
                      src="@/assets/frame.png"
                      height='80'
                    />
               </td>      
              </tr>
              </tbody>
          </table>
          
          <table>
              <tr style="border-top:1px solid black; border-bottom:1px solid black">
                <td class="pl10">
                  FIKS: {{globalTicketData.NumberOfMatches}}/{{globalTicketData.NumberOfMatches}}
                </td>
              </tr>
              <tr v-for="item in data" :key="item.Id" class="matches">
                <td class="matchStartDate"><v-container class="colPrikaz">
                  <span>{{getDayOfWeekAndTime(item['MatchStartDate'])}}</span></v-container>
                </td> 
                <td style="font-weight:bolder;">
                 <span class="breaking"> <span>{{item.Domacin}}</span></span>- <span class="breaking"> <span>{{item.Gost}}</span> </span>
                </td>
                
                <td class="outcome">
                  {{item.BetGameOutcomeShortName}} {{item.BetParamText ? `(`+item.BetParamText+`)` : ''}}
                </td>
                <td class="odd" style="font-weight:bolder; position:relative" >
                  <img src="@/assets/olovka.png" alt="" class="olovka">
                  {{convertToOdd(item.BetOdds)}}
                </td>
                <td class="match" >

                  {{item.HomeValue}} : {{item.AwayValue}}
                </td>
              </tr>
              
        </table>
        <table id="footer">
          <tr class="uplata">
                <td  style="border-right:1px solid black;" class="mtop">
                  Uplata: <span>{{convertToCurrency(globalTicketData.Ulog)}} RSD </span><br>
                  Uk. Kvota: <span> {{convertToCurrency(globalTicketData.SumOdds.toFixed(2))}} </span>
                </td>
                <td>
                  Potencijalni Dobitak: <span> {{convertToCurrency(globalTicketData.BasicWinningAmount)}} </span> <br>
                  Bonus: <span> {{convertToCurrency(globalTicketData.BonusAmount)}} </span>
                  <p style="background:black; color:white">Potencijalna Isplata: <span style="font-weight:bold; color:white"> {{convertToCurrency(globalTicketData.TotalWinningAmount)}} </span> </p>
                </td>
              </tr>
        </table>
        <table id="promo">
          <tr>
            <img src="@/assets/promo.png" alt="">
          </tr>
        </table>
        </v-container>
        </v-col>
        <v-col cols="10" sm="10" class="mtop3" v-if="loadingData!=null && loadingData!=true && data.length>0 && view=='web'">
        <v-container
          id="tiket"
          class="ticket"
          style="width:62%!important"
        >
        

          <table style="margin-top: 15px; background:#313131; width: 100%; border-top:1px solid white">
            <thead style="border-bottom:1px solid #110C0C" class="web-header">  
              <p class="status">    
                  <p class="zaglavlje">
                    TIKET JE:  
                     {{ globalTicketData.Status }}               
                  </p>
              </p>
            </thead>
            <tbody>
              <tr class="header">
                <td class="logo-web">
                  <img
                    
                      src="@/assets/desktop-logo.png"
                    />
                 </td>
                 <td>
                  <p id="ticketDetails-web">
                      {{ globalTicketData["Vreme Uplate"] }} <br>
                      ID: {{ globalTicketData["ID Tiketa"] }} <br>

                  </p>
                </td>
                      
              </tr>
              </tbody>
          </table>
          
          <table style="background:#313131; color:white">
              <tr style="border-top:1px solid black; border-bottom:1px solid black">
                <td class="pl10">
                  FIKS: {{globalTicketData.NumberOfMatches}}/{{globalTicketData.NumberOfMatches}}
                </td>
                
                <!-- <td class="float-r">
                      TIKET JE:  
                     {{ globalTicketData.Status }}   
                </td> -->
              </tr>
              <tr v-for="item in data" :key="item.MatchId" class="matches-web">
                <td class="matchStartDate-web"><v-container class="colPrikaz">
                  <span>{{getDayOfWeekAndTime(item['MatchStartDate'])}}</span></v-container>
                </td> 
                <td style="font-weight:bolder;">
                 <span class="breaking-web"> <span>{{item.Domacin}}</span></span> - <span class="breaking-web"> <span>{{item.Gost}}</span> </span>
                </td>
                
                <td class="outcome-web">
                  {{item.BetGameOutcomeShortName}} {{item.BetParamText ? `(`+item.BetParamText+`)` : ''}}
                </td>
                <td  class="odd-web" >
                  <!-- <img src="@/assets/olovka.png" alt="" class="olovka"> -->
                  {{convertToOdd(item.BetOdds)}}
                </td>
                <td  class="match-web">

                  {{item.HomeValue}} : {{item.AwayValue}}
                </td>
              </tr>

        </table>
        <table id="footer-web" style="background:#313131; color:white">
          <tr class="uplata-web">
                <td  style="border-right:1px solid black;" class="mtop">
                  Uplata: <span>{{convertToCurrency(globalTicketData.Ulog)}} RSD </span><br>
                  Uk. Kvota: <span> {{convertToCurrency(globalTicketData.SumOdds.toFixed(2))}} </span>
                </td>
                <td>
                  Potencijalni Dobitak: <span> {{convertToCurrency(globalTicketData.BasicWinningAmount)}} </span> <br>
                  Bonus: <span> {{convertToCurrency(globalTicketData.BonusAmount)}} </span>
                  <p style="background:black; font-weight:bolder;">Potencijalna Isplata: <span style="color: #03AD14"> {{convertToCurrency(globalTicketData.TotalWinningAmount)}} </span> </p>
                </td>
              </tr>
        </table>
        
        </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-if="data.length == 0 || loadingData==true">
      <v-row align="center">
        <v-col cols="3" sm="3"></v-col>
        <v-col cols="6" sm="6" class="mtop10">
          <span v-if="loadingData==null" class="loading">Slip will load here</span>
          <v-container v-if="loadingData">
            <loading :active.sync="loadingData" 
            loader="dots"
            color="#225e0d"
            blur="10px"
        :is-full-page="fullPage"></loading>
          </v-container>
        </v-col>
        <v-col cols="3" sm="3"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// var _ = require('lodash');
import { targetURL } from "../global/config";
import html2canvas from "html2canvas";
// import Bar from "../views/charts/Bar.vue";
const axios = require("axios").default;
export default {
  name: "slipdetailedpreview",
  data() {
    return {
      view: "land",
      channels: [
        {
          id: 1,
          title: "Online",
        },
        {
          id: 2,
          title: "Retail",
        },
      ],
      loadingData: null,
      selectedChannel: 1,
      fullPage: true,
      ticketId: null,
      isError: true,
      globalTicketData: {},
      slipStatus: ["Dobitan", "Cashback", "Na cekanju"],
      data: [],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
        "Jul",
        "Avg",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ],
      statuses: [
        {
          id: null,
          title: "Svi",
        },
        {
          id: 1,
          title: "Dobitan",
        },
        {
          id: 2,
          title: "Cashback",
        },
        {
          id: -1,
          title: "Gubitan",
        },
      ],
      slipType: [
        {
          id: null,
          title: "Svi",
        },
        {
          id: 0,
          title: "Prematch",
        },
        {
          id: 1,
          title: "Live",
        },
        {
          id: 2,
          title: "Mixed",
        },
        {
          id: 3,
          title: "Outright",
        },
      ],
    };
  },
  components: {
    Loading,
  },
  methods: {
    download() {
     if(this.ticketId){
        var self = this;
      html2canvas(document.getElementById("tiket"), {
        letterRendering: 1,
        allowTaint: true,
      }).then((canvas) => {
        var a = document.createElement("a");
        a.href = canvas.toDataURL("image/jpeg");
        a.download = self.ticketId + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
     }
    },
    convertToOdd(odd) {
      console.log(odd);
      var val = null;
      if (odd.toString().indexOf(".") == -1) {
        val = odd + ".00";
      } else {
        if (odd.toString().split(".")[1].length == 1) {
          val = odd + "0";
        } else {
          val = odd.toFixed(2);
        }
      }
      return val;
    },
    selectSource(e) {
      this.selectedChannel = parseInt(e.target.value);
    },
    getTicketType() {
      switch (this.globalTicketData.SlipType) {
        case 0:
          return "PREMATCH";
        case 1:
          return "LIVE";
        case 2:
          return "MIXED";
        case 3:
          return "OUTRIGHT";
        default:
          return "UNKNOWN TYPE";
      }
    },
    getSportName(sportId) {
      switch (sportId) {
        case 1:
          return "Fudbal";
        case 2:
          return "Košarka";
        case 3:
          return "Tenis";
        case 4:
          return "Rukomet";
        case 5:
          return "Odbojka";
        case 6:
          return "Hokej";
        case 7:
          return "Bejzbol";
        case 9:
          return "Vaterpolo";
        case 10:
          return "Americki fudbal";
        case 11:
          return "Golovi u ligi";
        case 12:
          return "Igrači specijal";
        case 13:
          return "Dueli timova";
        case 14:
          return "Futsal";
        case 15:
          return "Meč specijal";
        case 16:
          return "Specijal";
        case 17:
          return "Olimpijske igre";
        case 18:
          return "Košarka specijal";
        case 19:
          return "Odbojka specijal";
        case 20:
          return "Rukomet specijal";
        case 21:
          return "ZOI 2018 specijal";
        case 22:
          return "Dueli strelaca";
        case 23:
          return "Zimski sportovi";
        case 24:
          return "3x3 košarka";
        case 25:
          return "Stoni tenis";
        case 26:
          return "Borilačke veštine";
        case 27:
          return "Australijski fudbal";
        case 28:
          return "ESport";
        case 29:
          return "Pikado";
        case 30:
          return "Šah";
        case 31:
          return "Snuker";
        case 34:
          return "Politika";
      }
    },
    getAdditional(item) {
      var str = "";
      if (item.halftime) {
        str += "(";
        str += item.halftime;
        if (item.periods == "") {
          str += ")";
        } else {
          str += ",";
          if (item.periods.slice(-1) === ",") {
            item.periods = item.periods.slice(0, -1);
          }
          str += item.periods;
          str += ")";
        }
      } else {
        if (item.periods != "") {
          str += "(";
          if (item.periods.slice(-1) === ",") {
            item.periods = item.periods.slice(0, -1);
          }
          str += item.periods;
          str += ")";
        }
      }
      let sportsWithOvertime = [1, 2, 50];
      let sportsWithPenalties = [1];
      if (sportsWithOvertime.includes(item.SportId) && item.overtime) {
        str = str.slice(0, -1);
        str += ",";
        str += item.overtime;
        str += ")";
      }
      if (sportsWithPenalties.includes(item.SportId) && item.penalties) {
        str = str.slice(0, -1);
        str += ",";
        str += item.penalties;
        str += ")";
      }

      let strRemovedBrackets = str.substring(1, str.length - 1); // "1:2,2:3,3:4"
      let strToArray = strRemovedBrackets.split(","); // ["1:2","2:3","3:4"]
      let html = "";
      for (let i = 0; i < strToArray.length; i++) {
        let domacin = strToArray[i].split(":")[0];
        let gost = strToArray[i].split(":")[1];
        if (item.SportId == 3 || item.SportId == 5) {
          //tenis ili odbojka
          if (parseInt(domacin) > parseInt(gost)) {
            html +=
              `
            <v-container style='margin-right:10px' class="colPrikaz">
                <span style='font-weight:bold'>` +
              domacin +
              `</span>
                <span>` +
              gost +
              `</span>
            </v-container>
            `;
          } else {
            html +=
              `
            <v-container style='margin-right:10px' class="colPrikaz">
                <span>` +
              domacin +
              `</span>
                <span style='font-weight:bold'>` +
              gost +
              `</span>
            </v-container>
            `;
          }
        } else {
          html +=
            `
         <v-container style='margin-right:10px' class="colPrikaz">
            <span>` +
            domacin +
            `</span>
            <span>` +
            gost +
            `</span>
         </v-container>
         `;
        }
      }
      let pre =
        `<v-container style='margin-right:10px' class="colPrikaz"><span class="score">` +
        item.HomeScore +
        `</span>
                    <span class="score">` +
        item.AwayScore +
        `</span></v-container>`;
      return pre + html;
    },
    convertToCurrency(value) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      return formatter.format(value).replace("$", "");
    },
    determineURL() {
      let path = window.origin;
      if (path.includes("localhost")) {
        this.url = targetURL.SERVER;
      } else {
        this.url = targetURL.SERVER;
      }
    },
    checkIfEligible() {
      this.isError = !/^\d{1,}$/.test(this.ticketId);
    },
    getData() {
      this.isError = false;
      let obj = {
        ticketId: this.ticketId,
        source: this.selectedChannel,
      };
      this.loadingData = true;
      axios
        .post(this.url + "/api/SlipDetailedPreview", obj)
        .then((response) => {
          if (response.data.tiket.length > 0) {
            this.loadingData = false;
            this.checkForNulls(response.data.tiket);
            this.data = response.data.tiket;
            this.data.sort((a, b) => (a.Id > b.Id) ? 1 : -1)
            this.assignGlobalPropsToData(this.data[0]);
          } else {
            this.data = [];
            this.loadingData = null;
          }
        });
    },
    checkForNulls(data) {
      data.forEach((el) => {
        Object.keys(el).forEach((key) => {
          if (el[key] == null) {
            el[key] = 0.0;
          }
        });
      });
    },
    getOutcome(outcome) {},
    getDate(datetime) {
      let datetimeArr = datetime.split(" ");
      let date = new Date(datetimeArr[0]);
      let dateString;
      dateString = date.getDate() + ". " + this.months[date.getMonth()];
      return dateString;
    },
    getDayOfWeekAndTime(datetime) {
      var daysOfWeek = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];
      let datetimeArr = datetime.split(" ");
      let date = new Date(datetimeArr[0]);
      let dayOfWeek = daysOfWeek[date.getDay()];
      let timeParts = datetimeArr[1].split(".")[0].split(":");
      let time = timeParts[0] + ":" + timeParts[1];
      return dayOfWeek + " " + time;
    },
    convertToReadableFormat(
      datetime,
      includeYear = true,
      includeSeconds = false
    ) {
      let datetimeArr = datetime.split(" ");
      let date = new Date(datetimeArr[0]);
      let dateString, time;
      if (includeYear) {
        dateString =
          date.getDate() +
          ". " +
          this.months[date.getMonth()] +
          " " +
          date.getFullYear() +
          ".";
        time = datetimeArr[1].split(".")[0];
      } else {
        dateString = date.getDate() + ". " + this.months[date.getMonth()];
        let timeParts = datetimeArr[1].split(".")[0].split(":");
        if (includeSeconds) {
          time = timeParts[0] + ":" + timeParts[1] + ":" + timeParts[2];
        } else {
          time = timeParts[0] + ":" + timeParts[1];
        }
      }

      return dateString + " " + time;
    },
    assignGlobalPropsToData(data) {
      let obj = this.globalTicketData;
      obj["SlipType"] = data.SlipType;
      obj["ID Tiketa"] = data["ID tiketa"];
      obj["Vreme Uplate"] = this.convertToReadableFormat(data["Vreme uplate"]);
      obj["User"] = data.Username;
      obj["Status"] = data.Status;
      obj["NumberOfMatches"] = data.NumberOfMatches;
      obj["SumOdds"] = data.SumOdds;
      obj["BasicWinningAmount"] = data.BasicWinningAmount;
      obj["BonusAmount"] = data.BonusAmount;
      obj["Ulog"] = data.Ulog;
      obj["TotalWinningAmount"] = data.TotalWinningAmount;
    },
  },
  created() {
    this.determineURL();
  },
};
</script>

<style scoped>
.uplata{
border-top:1px solid gray;
}

.uplata-web{
 border-top:1px solid #c9c9c9;

}
.gost{
  text-align: left;
  padding-left:25px
}
#footer-web tr span {
  text-align: right !important;
  float: right;
  padding: 0px 4px;
}
#footer-web {
  border-top: 2px solid black;
  background: rgb(22, 22, 22);
  color: white;
  border-bottom: 2px solid white;
}
#footer-web tr td {
  padding: 0px 10px !important;
}

#footer tr td {
  padding: 0px 10px !important;
}
.web-header {
  background: rgb(27, 63, 14);
  background: linear-gradient(
    0deg,
    rgba(27, 63, 14, 1) 0%,
    rgba(40, 82, 39, 1) 49%,
    rgba(27, 63, 14, 1) 90%
  );
  display: flex !important;
  width: 250%;
}

.zaglavlje {
  width: 100%;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 400;
  padding-left: 5px;
  padding-top: 5px;
  margin-bottom: 5px;
  text-shadow: 1px 1px 4px #000000;
}

#glavna tbody td {
  border-top: none !important;
  padding-bottom: 10px !important;
}
#glavna thead td {
  border-bottom: 1px solid #dee2e6;
}

.liveobr {
  position: absolute;
  top: 8px;
  right: -9px;
  width: 33px;
  transform: rotate(-90deg);
  margin-top: 8px;
  text-align: center;
  /* vertical-align: middle; */
  color: white;
  background-color: red;
  /* padding: 3px; */
  height: 15px;
  margin-top: 13px;
  font-size: 11px;
  /* font-family: 'Arial';*/
}
.CellWithComment {
  position: relative;
}

.CellComment {
  text-align: center;
  display: none;
  position: absolute;
  z-index: 100;
  border: 1px;
  background-color: black;
  border-style: solid;
  border-width: 1px;
  border-color: yellow;
  padding: 3px;
  color: yellow;
  top: 4px;
  left: 0;
  width: 80px;
  height: 50px;
  padding-top: 12px;
}

.CellWithComment:hover span.CellComment {
  display: block;
}
.table td {
  padding: 0.35rem;
}
.colPrikaz {
  display: flex !important;
  flex-direction: column !important;
  padding-left: 5px !important;
}
.score {
  color: yellow;
}
.live {
  margin-bottom: 3px;
  margin-left: 5px;
}
.ticket {
  background-color: rgb(255, 255, 255);
  height: auto !important;
  margin-top: 15px;
  padding: 0px 1px !important;
}
.btnSearch {
  height: 40px !important;
  margin-top: 5px;
  background: #ffe15b !important;
  color: rgb(39, 40, 41);
  padding:10px;
  font-weight: bolder;
  letter-spacing: 2px;
  font-size: 22x;
  text-transform: uppercase;
  text-align: center !important;
  vertical-align: middle;
  border-radius: 5px;
}
.btnSearch > * {
  text-align: center !important;
  vertical-align: middle;
}
/* .mtop3 {
  margin-top: 3%;
} */
.mtop3 v-text-field {
  font-family: "Century Gothic";
}
.mtop10 {
  margin-top: 10%;
  text-align: center;
  font-size: 33px;
}

.v-application .align-center {
  align-items: initial !important;
}
table {
  width: 100%;
}

table thead tr th p {
  color: rgb(20, 20, 20) !important;
}
.barcode {
  border-bottom: 1px solid black !important;
  text-align: center !important;
}
.barcode > * {
  width: 100% !important;
}
.barcode img {
  margin: 0px auto;
}
.vreme p {
  color: rgb(20, 20, 20) !important;
}
.logo {
  width: 40% !important;
  border-right: 1px solid gray;
}
.logo-web {
  width: 40% !important;
  padding: 6px !important;
  padding-left: 22px !important;
}
.logo > * {
  color: rgb(20, 20, 20) !important;
}
.pl10{
  padding-left:10px!important
}
.pl5{
  padding-left:5px!important
}
#ticketDetails {
  font-weight: 400;
  margin-bottom: 0px !important;
  padding-top: 12px;
  color: #333;
  text-align: left;
  padding-left: 20px;
}

#ticketDetails-web {
  font-weight: 400;
  margin-bottom: 0px !important;
  padding-top: 12px;
  color: rgb(245, 245, 245);
  text-align: right;
  padding-right: 22px;
  letter-spacing: 1.2px;
  font-size: 15px;
  float: right;
}
.matches,
.matches-web {
  height: 40px !important;
}

.matches-web:nth-child(even) {
  background: rgb(17, 12, 12) !important;
  color: rgb(235, 235, 235);
}
.matches-web:nth-child(odd) {
  background: rgb(36, 36, 36) !important;
  color: rgb(235, 235, 235);
}

#footer tr span {
  text-align: right !important;
  float: right;
  padding: 0px 4px;
}

table tr p {
  margin-bottom: 0px !important;
}
.olovka {
  position: absolute;
  top:5px;
  right: 12px;
  width: 105px !important;
}

.mtop {
  padding-bottom: 23px !important;
}
#promo {
  border-top: 1px solid black;
  margin: 0px auto !important;
  text-align: center !important;
}
#promo img {
  width: 75%;
}
.loading {
  color: white !important;
}

.v-text-field__slot input {
  width: 460px !important;
  height: 100px !important;
}

.pera {
  color: black !important;
  background: rgb(255, 255, 255) !important;
  text-align: center !important;
  margin: 0px auto;
}
.lista {
  color: black !important;
  background: rgb(255, 255, 255) !important;
}
.tickedSearch {
  color: rgb(255, 255, 255) !important;
  font-size: 18px;
}
.form-control {
  margin-bottom: 7px;
}
td .breaking {
  display: inline-block;
  width: 112px !important;
  white-space: nowrap !important;
  overflow: hidden;
  color:white;
  text-overflow: ellipsis!important;
  vertical-align: middle;
}

td .breaking-web{
  display: inline-block;
  width: 100px !important;
  white-space: nowrap !important;
  overflow: hidden;
  color:rgba(0,0,0,0)!important;
  text-overflow: ellipsis!important;
  vertical-align: middle;}

.breaking > span {
  color:black;
}

.breaking-web > span {
  color:white;
}




.tip {
  color: white;
}

.matchStartDate, .matchStartDate-web{
  padding-left:5px!important
}

.matchStartDate, .outcome, .odd{
  color:black
}

.matchStartDate-web, .outcome-web, .odd-web{
  color:white
}

.matchStartDate, .outcome, .matchStartDate-web, .outcome-web{
  width:110px!important
}

.odd{
  width:56px!important;
}

.odd-web{
  width:70px!important;
  font-weight:bolder; 
  position:relative; 
  color: #03ad1d
}

.match-web{
    width:50px!important;
  font-style: italic!important;
}

.match{
  width:50px!important;
  font-style: italic!important;
  color:#153edc!important
}
</style>

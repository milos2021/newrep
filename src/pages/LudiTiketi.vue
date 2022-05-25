<template>
  <div class="row">
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css"
      rel="stylesheet"
    />
    <!--COL LEVO-->
    <div class="col-md-2 mainData">
      <div class="card">
        <span class="report-title">Ticket search</span>
        <div class="row d-flex flex-column">
          <article class="card-group-item">
            <header class="card-header">
              <h5>Period</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <form action="">
                  <v-row>
                    <v-col cols="12" sm="12">
                      <input type="datetime-local" v-model="date" />
                      <!-- <vue-rangedate-picker @selected="onDateSelected" i18n="EN">
                                             </vue-rangedate-picker> -->
                    </v-col>
                    <!-- <v-col
                                                 cols="12"
                                                 sm="12">
                                                 <v-text-field
                                                  v-model="dateRangeText"
                                                  label="Date range"
                                                   prepend-icon="mdi-calendar"
                                                   readonly
                                                    ></v-text-field>
                                            </v-col> -->
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <input type="datetime-local" v-model="date2" />
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <!-- <article class="card-group-item">
                <header class="card-header">
                  <h5>Status Tiketa</h5>
                </header>
                <div class="filter-content">
                  <div class="card-body status-tiketa">
                    <form>
                      <v-row align="center">
                        <v-col
                            class="d-flex"
                            cols="12"
                            sm="12"
                        >
                            <v-select
                            :items="slipStatus"
                            v-model="selected.status"
                            ></v-select>
                        </v-col>                 
                      </v-row>
                      
                      </form>
                  </div>
                </div>
             </article> -->
          <article class="card-group-item">
            <header class="card-header">
              <h5>Tip Tiketa</h5>
            </header>
            <div class="filter-content">
              <div class="card-body tip-tiketa">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                      <v-select
                        :items="slipType"
                        v-model="selected.slipType"
                        item-value="id"
                        item-text="title"
                      ></v-select>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Status Tiketa</h5>
            </header>
            <div class="filter-content">
              <div class="card-body tip-tiketa">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                      <v-select
                        :items="statuses"
                        v-model="selected.status"
                        item-value="id"
                        item-text="title"
                        v-on:change="manageStatus($event)"
                      ></v-select>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Visina Uplate</h5>
            </header>
            <div class="filter-content">
              <div class="card-body visina-uplate">
                <form>
                  <v-row align="center">
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Od"
                        v-model="ranges.betFrom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Do"
                        v-model="ranges.betTo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Visina Isplate</h5>
            </header>
            <div class="filter-content">
              <div class="card-body visina-isplate">
                <form>
                  <v-row align="center">
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Od"
                        v-model="ranges.winFrom"
                        :disabled="optionsDisabled.winFrom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Do"
                        v-model="ranges.winTo"
                        :disabled="optionsDisabled.winTo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Ukupna kvota</h5>
            </header>
            <div class="filter-content">
              <div class="card-body ukupna-kvota">
                <form>
                  <v-row align="center">
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Od"
                        v-model="ranges.oddsFrom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        dense
                        label="Do"
                        v-model="ranges.oddsTo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Pretraga po kodu meča</h5>
            </header>
            <div class="filter-content">
              <div class="card-body pretraga-sifra">
                <form>
                  <v-row align="center">
                    <v-col cols="12" sm="12">
                      <v-text-field
                        value=""
                        hint="Unesi šifru meča"
                        v-model="code"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Outcome sport</h5>
            </header>
            <div class="filter-content">
              <div class="card-body pretraga-outcome">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                      <v-autocomplete
                        :items="sports"
                        v-on:change="filterOutcomes($event)"
                        v-model="selected.sport"
                        item-value="Id"
                        :disabled="optionsDisabled.sport"
                        item-text="Name"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Outcome pretraga</h5>
            </header>
            <div class="filter-content">
              <div class="card-body pretraga-outcome">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                      <v-autocomplete
                        :items="outcomes"
                        v-model="selected.outcome"
                        item-value="Id"
                        :disabled="optionsDisabled.outcomes"
                        item-text="BetGameOutcomeShortName"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Nezavisno od outcome-a</h5>
            </header>
            <div class="filter-content">
              <div class="card-body pretraga-outcome">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                      <v-checkbox
                        label="Svi outcome-ovi"
                        v-on:change="manageOutcomes($event)"
                        hide-details
                        v-model="alloutcomes"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>

          <article class="card-group-item">
            <header class="card-header relative"></header>
            <div class="filter-content">
              <div class="card-body">
                <form>
                  <div class="btn-group-vertical">
                    <v-btn
                      v-on:click="searchData()"
                      depressed
                      tabindex="1"
                      class="btn btn-dark"
                    >
                      Search</v-btn
                    >
                    <v-btn depressed class="btn btn-light"> Reset</v-btn>
                  </div>
                </form>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="col-md-10 mainTable">
      <div class="row search-bar">
        <div class="col-md-12">
          <form action="">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </form>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        hide-details
        :items-per-page="70"
        :items="allData"
        :search="search"
        item-key="Id"
        :loading="isLoading"
        loading-text="Učitavanje podataka..."
        show-expand
        single-expand
        class="elevation-1"
        @item-expanded="expand"
      >
      <template v-slot:item.Amount="{ item }">
          <span>{{ convertToCurrency(item.Amount) }}</span>
        </template>
              <template v-slot:item.SumOdds="{ item }">
          <span>{{ convertToCurrency(item.SumOdds) }}</span>
        </template>
              <template v-slot:item.TotalWinningAmount="{ item }">
          <span>{{ convertToCurrency(item.TotalWinningAmount) }}</span>
        </template>
                      <template v-slot:item.ClientAcceptanceTime="{ item }">
          <span>{{ convertToReadableFormat(item.ClientAcceptanceTime) }}</span>
        </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(item.Id)" v-if="!isExpanded">Info</v-btn>
          <v-btn @click="expand(false)" v-if="isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td
            :colspan="headers.length"
            style="background: black; color: black"
            v-if="loadingUserData == false"
          >
            <table style="margin-top: 15px; color: white; width: 50%">
              <tr>
                <td>
                  <p>
                    TIKET JE:
                    {{ globalTicketData.Status }}&nbsp;
                    <img
                      v-if="globalTicketData.Status >= 1"
                      src="@/assets/ok.png"
                      style="margin-top: -3px; margin-left: 4px"
                      width="15"
                    />
                    <img
                      v-if="globalTicketData.Status == -1"
                      src="@/assets/notok.png"
                      style="margin-top: -3px; margin-left: 4px"
                      width="15"
                    />
                  </p>
                </td>
                <td>
                  <p style="text-align: right">{{ getTicketType() }} TIKET</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>#{{ globalTicketData["ID Tiketa"] }}</p>
                </td>
                <td style="text-align: right">
                  <p>VREME UPLATE: {{ globalTicketData["Vreme Uplate"] }}</p>
                </td>
              </tr>
            </table>

            <table
              class="table"
              id="glavna"
              style="
                padding-right: 40px;
                padding-left: 40px;
                color: white;
                width: 50%;
              "
            >
              <thead>
                <tr>
                  <td>Početak</td>
                  <!-- <td>Match Code</td> -->
                  <td>Competition</td>
    
                  <td>Dogadjaj</td>
                  <td>Igra</td>
                  <td>Kvota</td>
                  <!-- <td></td> -->
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data" v-bind="item.MatchId">
                  <td class="CellWithComment" style='width:100px'><v-container class="colPrikaz"><span>{{getDate(item['Vreme uplate'])}}</span>
                    <span>{{getDayOfWeekAndTime(item['Vreme uplate'])}}</span></v-container>
                </td> 
                  <td style="width: 140px">
                    <v-container class="colPrikaz">
                      <span>
                        <img
                          v-if="item['Name'] == 'Fudbal'"
                          src="@/assets/football.png"
                          style="margin-top: -4px"
                          width="16"
                        />
                        <img
                          v-if="item['Name'] == 'Košarka'"
                          src="@/assets/basketball.png"
                          style="margin-top: -4px"
                          width="16"
                        />
                        <img
                          v-if="item['Name'] == 'Tenis'"
                          src="@/assets/tennis.png"
                          style="margin-top: -4px"
                          width="16"
                        />
                        {{ item["Name"] }}
                      </span>
                      <span>{{ item.CompetitionName }}</span>
                    </v-container>
                  </td>
                  <!-- <td style="vertical-align:middle; position:relative" >
                  <span v-if='item.BetType==2' >
                    <p class="liveobr">LIVE</p>
                  </span>
                </td> -->
                  <td style="width: 170px">
                    <v-container class="colPrikaz"
                      ><span>{{ item.Domacin }}</span>
                      <span>{{ item.Gost }}</span></v-container
                    >
                  </td>
                  <td style="width: 140px">
                    <v-container class="colPrikaz">
                      <span>{{ item.BetGameName }}</span>
                      <span
                        >{{ item.BetGameOutcomeShortName }}
                        {{
                          item.BetParamText ? "(" + item.BetParamText + ")" : ""
                        }}</span
                      >
                    </v-container>
                  </td>
                  <td style="width: 100px; vertical-align: middle">
                    <span class="stilKv">{{ item.BetOdds.toFixed(2) }}</span>
                  </td>

                  <!-- <td style="width:50px">
                  
                </td> -->

                  <td>
                    <img
                      v-if="item['Status Linije'] > 0"
                      src="@/assets/ok.png"
                      style="margin-top: 15px"
                      width="15"
                    />
                    <img
                      v-if="item['Status Linije'] == -1"
                      src="@/assets/notok.png"
                      style="margin-top: 15px"
                      width="15"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="table"
              style="
                padding-top: 20px;
                padding-right: 40px;
                padding-left: 40px;
                color: white;
                width: 50%;
              "
            >
              <tr>
                <td>UPLATA</td>
                <td>{{ convertToCurrency(globalTicketData.Amount) }}</td>
                <td>DOBITAK</td>
                <td>
                  {{ convertToCurrency(globalTicketData.BasicWinningAmount) }}
                </td>
              </tr>
              <tr>
                <td>UKUPNA KVOTA</td>
                <td>{{ convertToCurrency(globalTicketData.SumOdds) }}</td>
                <td>BONUS</td>
                <td>
                  {{ convertToCurrency(globalTicketData.BonusWinningAmount) }}
                </td>
              </tr>
              <tr>
                <td>BROJ PAROVA</td>
                <td>{{ globalTicketData.NumberOfMatches }}</td>
                <td>UKUPNA ISPLATA</td>
                <td>
                  {{ convertToCurrency(globalTicketData.TotalWinningAmount) }}
                </td>
              </tr>
            </table>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
  <!-- <div class="col-12">
        <card class="card-plain">
          <div class="table-full-width table-responsive">
            <base-table :title="table2.title" :sub-title="table2.subTitle" :data="table2.data"
                         :columns="table2.columns">

            </base-table>
          </div>
        </card>
      </div> -->
</template>
<script>
import VueRangedatePicker from "vue-rangedate-picker";
import getOutcomes from "./outcomes.ts";
import getSports from "./sports.ts";
const axios = require("axios").default;
export default {
  components: { VueRangedatePicker },
  data() {
    return {
      optionsDisabled:{
        outcomes:true,
        sport:true,
        winFrom:false,
        winTo:false
      },
      alloutcomes: true,
      isLoading: false,
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
      outcomes: getOutcomes(),
      sports: getSports(),
      globalTicketData: {},
      slipStatus: ["Dobitan", "Cashback", "Na cekanju"],
      ranges: {
        betFrom: 20,
        betTo: 500,
        winFrom: 5000,
        winTo: 10000,
        oddsFrom: 10,
        oddsTo: 50,
      },
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
      selected: {
        status: "Dobitan",
        slipType: null,
        outcome: "5000",
        sport: "1",
        status: null,
      },
      code: "",
      selectedDate: {
        start: "",
        end: "",
      },
      time: null,
      menu2: false,
      modal2: false,
      date2: null,
      date: null,
      menu: false,
      menu2: false,
      loadingUserData: true,
      selectedUserData: {},
      expanded: [],
      search: "",
      balanceLimit: 20000,
      slipCount: 1000,
      headers: [
        {
          text: "ID Tiketa",
          align: "left",
          value: "Id",
        },
        { text: "Korisnik", value: "UserName" },
        { text: "Datum", value: "ClientAcceptanceTime" },
        { text: "Uplata", value: "Amount" },
        { text: "Isplata", value: "TotalWinningAmount" },
        { text: "Kvota", value: "SumOdds" },
        { text: "Status tiketa", value: "SlipWinningStatus" },
      ],
      dates: ["2019-09-10", "2021-11-20"],
      allData: [],
      data: [],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    manageStatus(e){
      console.log(e)
      if(e==-1){
        this.ranges.winFrom=0
        this.ranges.winTo=0
        this.optionsDisabled.winFrom = true
        this.optionsDisabled.winTo = true
      } else if(e==1){
        if(this.ranges.winfrom==0){
          this.ranges.winfrom=100
        }
      }

      if(e!=-1){
        this.ranges.winFrom=5000
        this.ranges.winTo=10000
        this.optionsDisabled.winFrom = false
        this.optionsDisabled.winTo = false
      }
        
    },
    getDayOfWeekAndTime(datetime){
      var daysOfWeek = [
        "Ned","Pon","Uto","Sre","Čet","Pet","Sub"
      ]
      let datetimeArr = datetime.split(" ");
      let date = new Date(datetimeArr[0]);
      let dayOfWeek = daysOfWeek[date.getDay()];
      let timeParts = datetimeArr[1].split(".")[0].split(":");
      let time = timeParts[0] + ":" + timeParts[1];
      return dayOfWeek+", "+time
    },
    getDate(datetime){
      let datetimeArr = datetime.split(" ");
      let date = new Date(datetimeArr[0]);
      let dateString;
      dateString = date.getDate() + ". " + this.months[date.getMonth()];
      return dateString;
    },
    manageOutcomes(state){
      if(!state){
        this.optionsDisabled.sport = false;
        this.optionsDisabled.outcomes = false;
      } else {
        this.optionsDisabled.sport = true;
        this.optionsDisabled.outcomes = true;
      }
    },
    filterOutcomes(e) {
      var sport = e;
      this.outcomes = getOutcomes();
      this.outcomes = this.outcomes.filter(
        (x) => x.BetGameOutcomeSportId == sport
      );
    },
    searchData() {
      if (this.date && this.date2) {
        let fromData = this.date.split("T");
        let from = fromData[0] + " " + fromData[1] + ":00.000";
        let toData = this.date2.split("T");
        let to = toData[0] + " " + toData[1] + ":00.000";

        /*
    od = data['from']
		do = data['to']
		slipType = data['slipType']
		betFrom = data['betFrom']
		betTo = data['betTo']
		winFrom = data['winFrom']
		winTo = data['winTo']
		oddsFrom = data['oddsFrom']
		oddsTo = data['oddsTo']
		matchCode = data['matchCode']
		outcomeId = data['outcomeId']
      */

        let obj = {};
        obj["from"] = from;
        obj["to"] = to;
        obj["slipType"] = this.selected.slipType;
        obj["betFrom"] = parseInt(this.ranges.betFrom);
        obj["betTo"] = parseInt(this.ranges.betTo);
        obj["winFrom"] = parseInt(this.ranges.winFrom);
        obj["winTo"] = parseInt(this.ranges.winTo);
        obj["oddsFrom"] = parseInt(this.ranges.oddsFrom);
        obj["oddsTo"] = parseInt(this.ranges.oddsTo);
        obj["matchCode"] = (this.code && this.code!=-1) ? this.code : null;
        obj["outcomeId"] = this.alloutcomes ? null : parseInt(this.selected.outcome);
        obj["status"] = parseInt(this.selected.status);
        var error = false;
        var keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          if (
            !obj[keys[i]] &&
            isNaN(obj[keys[i]]) &&
            keys[i] != "slipType" &&
            keys[i] != "matchCode" &&
            keys[i] != "status"
          ) {
            error = true;
            break;
          }
        }

        if (error) {
          console.error("Greska u unosu podataka");
        } else {
          if(!this.isLoading){
            this.allData=[]
          console.log("LOADING")
          this.isLoading = true;
          axios
            .post("http://10.0.90.23:8000/api/LudiTiketi", obj)
            .then((response) => {
              let data = response.data.tiket;
              for (let i = 0; i < data.length; i++) {
                switch (data[i].SlipWinningStatus) {
                  case 1:
                    data[i].SlipWinningStatus = "Dobitan";
                    break;
                  case -1:
                    data[i].SlipWinningStatus = "Gubitan";
                    break;
                  case 2:
                    data[i].SlipWinningStatus = "Cashback";
                    break;
                  default:
                    data[i].SlipWinningStatus = "?";
                    break;
                }
              }
              this.allData = response.data.tiket;
              this.isLoading = false;
            })
            .catch((error) => {
              console.log(error);
            });
          }
          
        }
      }
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
    convertToCurrency(value) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      return formatter.format(value).replace("$", "");
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
    onDateSelected: function (daterange) {
      this.selectedDate = daterange;
    },

    expand(item) {
      if (!item.value) {
        this.selectedUserData = {};
      } else {
        this.getUserData(item.value);
      }
    },
    assignGlobalPropsToData(data) {
      let obj = this.globalTicketData;
      obj["SlipType"] = data.SlipType;
      obj["ID Tiketa"] = data["ID tiketa"];
      obj["Vreme Uplate"] = this.convertToReadableFormat(data["Vreme uplate"]);
      obj["SlipUserId"] = data.SlipUserId;
      obj["Amount"] = data.Ulog;
      obj["BasicWinningAmount"] = data.BasicWinningAmount;
      obj["BonusWinningAmount"] = data.BonusAmount;
      obj["Status"] = data.Status;
      obj["NumberOfMatches"] = data.NumberOfMatches;
      obj["SumOdds"] = data.SumOdds;
      obj["TotalWinningAmount"] = data.TotalWinningAmount;
    },
    getUserData(id) {
      this.loadingUserData = true;
      axios
        .post("http://10.0.90.23:8000/api/SlipDetailedPreview", {
          ticketId: id,
        })
        .then((response) => {
          this.data = response.data.tiket;
          this.assignGlobalPropsToData(this.data[0]);
          this.loadingUserData = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.allData = [];
    this.filterOutcomes(1);
    // axios
    //   .post("http://10.0.90.23:8000/api/UserReport3", {
    //     tip: 1,
    //     balanceLimit: 20000,
    //     slipCount: 1000,
    //   })
    //   .then((response) => {
    //     this.allData = response.data.tiket;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
};
</script>
<style>
/*
.v-btn__content {
  color: black !important;
  padding-top: 5px;
}
.mainTable {
  margin-top: -70px;
}
.mainData,
.card {
  background: white !important;
  margin-top: 0px;
  box-shadow: none;
  border-radius: 8px;
  height: 950px !important;
}
.mainData {
  
  margin-top: -65px;
}
#inspire {
  width: 96% !important;
  padding: 0px !important;
  margin: 0px !important;
}
.col-sm-12.col-12 {
  width: 90% !important;
  padding: 2px !important;
}
.input-date {
  width: 100% !important;
}
.v-picker {
  max-width: 200px;
}
.v-application--wrap {
  min-height: 40px !important;
}
.v-picker__title__btn {
  color: #1d201f;
  margin: -8px auto !important;
}
.v-time-picker-clock__hand {
  background-color: black !important;
  z-index: 11 !important;
}
.v-time-picker-clock__item--active {
  color: black !important;
  font-size: 26px !important;
  background-color: #ade9d2;
}
.v-time-picker-title {
  justify-content: center !important;
}
ul li,
ol li {
  color: rgb(44, 44, 43) !important;
}
.card {
  margin-top: 0px;
  height: 100% !important;
}
article {
  width: 100% !important;
}

.report-title {
  font-size: 19px;
  padding-bottom: 10px;
  text-align: center;
}
.mtop10 {
  margin-top: 10px !important;
}

.card label {
  font-size: 13px;
}
.card-header {
  background: #ffd546 !important;
  background: linear-gradient(0.25turn, #ffd546, #ffe489, #ffd546) !important;
  text-align: center;
  text-transform: uppercase;
  margin: 2px 0px;
  height: 30px;
  box-shadow: 0px 2px 3px #cccccc;
  padding-top: 7px !important;
}
.card h1,
.card h2,
.card h3,
.card h4,
.card h5,
.card h6,
.card p {
  color: #2e2e2e !important;
}

.relative {
  height: 65px;
  position: sticky;
  bottom: 0px;
}

.v-text-field__slot #input-66 {
  color: rgb(255, 255, 255) !important;
}
.search-bar .v-text-field__slot label {
  color: white !important;
}
.search-bar
  .theme--light.v-text-field
  > .v-input__control
  > .v-input__slot:before {
  border-color: #ffffff !important;
}
.search-bar i {
  color: white !important;
}

.slip-type .d-flex.col-md-12,
.igra {
  padding-bottom: 0px !important;
}
.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}

.v-btn__content:nth-child(0) {
  color: rgb(255, 255, 255) !important;
}
.v-input {
  margin-bottom: -8px !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  padding: 0px !important;
} 
.btn-group-vertical {
  width: 90%;
  position: relative !important;
  bottom: 100px;
  left: 13%;
  display: block !important;
  padding-bottom: -10px !important;
}
.btn-group-vertical > * {
  margin: 10px auto;
  max-width: 80% !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  border-radius: 0px !important;
}
.btn-group-vertical button[type="button"]:focus,
.btn-group-vertical button[type="button"]:active {
  box-shadow: none !important;
  transform: scale(1.05);
}

.btn.btn-dark,
.btn.btn-dark:focus {
  background: #468f73 !important;
  color: #fff !important;
}
.btn.btn-light,
.btn.btn-light:focus {
  background: #ffffff !important;
  color: rgb(0, 0, 0) !important;
}

.v-btn {
  flex-direction: column;
}

.table > thead > tr > th {
  color: #1d201f;
}
.v-data-table-header {
}
.table > thead > tr {
  border-right: 1px solid black;
}
.table > tbody > tr > td {
  border-color: rgba(8, 8, 8, 0.2) !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
  width: 280px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: #494949 !important;
  transition: 0.2s;
  color: white;
}

.v-data-footer {
  justify-content: space-between;
  height: 50px;
}
.v-data-footer_select {
  flex-direction: end;
}

button.v-btn--is-elevated {
  background-color: #468f73 !important;
  height: 34px !important;
}
button.v-btn--is-elevated:active {
  outline: none;
}
.v-data-footer__pagination {
  position: relative;
  left: 8%;
}
.v-data-footer__icons-before {
  position: relative;
  left: -28%;
  background-color: #ffd546;
  border-radius: 30%;
}
.v-data-footer__icons-after {
  position: relative;
  right: 48%;
  background-color: #ffd546;
  border-radius: 30%;
}
.v-select__selections {
  margin-left: 10px !important;
}
.visina-uplate .v-text-field,
.visina-isplate .v-text-field,
.ukupna-kvota .v-text-field {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.search-bar {
  padding-bottom: 20px !important;
}

@media (min-width: 960px) {
  .col-md-10 {
    flex: 0 0 86.6666666667% !important;
    max-width: 86.6666666667% !important;
  }
  .mainData {
    flex: 0 0 12.6666666667% !important;
    max-width: 12.6666666667% !important;
  }
}
@media (min-width: 600px) {
  .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
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
  color: white;
  background-color: red;
  height: 15px;
  margin-top: 13px;
  font-size: 11px;
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

.score {
  color: yellow;
}
.live {
  margin-bottom: 3px;
  margin-left: 5px;
}
.ticket {
  background-color: black;
  height: auto !important;
  margin-top: 15px;
  border-radius: 5px;
}
.btnSearch {
  margin-top: 0px !important;
  height: 47px !important;
}

.mtop3 v-text-field {
  font-family: "Century Gothic";
}
.mtop10 {
  margin-top: 10%;
  text-align: center;
  font-size: 33px;
}
.from .v-input__slot,
.to .v-input__slot {
  width: 50px !important;
}
.to .v-text-field__slot label:first-child {
  padding-left: 41px;
}
.cashflowMobile {
  color: #333;
}
.v-toolbar__content {
  background-color: #225e0d !important;
}
@media screen and (min-width: 768px) {
  #report2 table {
    border-top: 1px solid black;
  }
  #report2 .mainHeader:nth-child(7),
  #report2 .mainHeader:nth-child(11),
  #report2 .mainHeader:nth-child(13) {
    border-right: 1px solid black;
  }
  #report2 .mainHeader:nth-child(2) {
    border-left: 1px solid black;
  }
  #report2 .mainHeader:nth-child(4) {
    border-right: 1px solid black;
  }
  #report2 table td + td {
    border-left: 1px solid black;
  }
  #report2 table {
    border-bottom: 1px solid black;
  }
}
@media screen and (max-width: 768px) {
  .desktop,
  .v-data-table-header tr {
    height: 55px !important;
  }
  .cashflowMobile table tr {
    max-width: 100%;
    position: relative;
    display: block;
    height: 355px;
  }

  .cashflowMobile table tr:nth-child(odd) {
    border-left: 6px solid rgb(48, 170, 103);
  }

  .cashflowMobile table tr:nth-child(even) {
    border-left: 6px solid rgb(174, 179, 179);
  }

  .cashflowMobile table tr td {
    display: flex;
    width: 100%;
    height: auto;
    padding: 10px;
  }

  .cashflowMobile table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .cashflowMobile .theme--light tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
#mobileRow .flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

#mobileRow .flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}
.v-application .align-center {
  align-items: initial !important;
}
table {
  width: 100%;
}*/
.colPrikaz {
  display: flex !important;
  flex-direction: column !important;
  padding: 0 !important;
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
</style> 

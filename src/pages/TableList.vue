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
    
    <div class="col-2 mainData">
      <div class="card">      

      <span class="report-title">User Balance Report</span>
      <div class="row  d-flex flex-column">
        <article>
          <header class="card-header">
                  <h5>Balance Limit</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <div class="col-md-12">
                  <v-text-field
                    v-model="balanceLimit"
                    label="Balance Limit"
                    single-line
                    hide-details
                  ></v-text-field>
                </div>
              </div>
          </div>
        </article>
        <article>
          <header class="card-header">
                  <h5>Slip Count</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                  <div class="col-md-12">
                    <v-text-field
                      v-model="slipCount"
                      label="Slip Count"
                      single-line
                      hide-details
                    ></v-text-field>
                  </div>  
                </div>
            </div>
        </article>
        <div class="col-12">
                <v-btn
                v-on:click="searchData()"
                >Search
                </v-btn>
        </div>
       
        <!-- <div class="col-md-4 mtop10" >
         <v-btn
         v-on:click="searchData()"
         >Search
         </v-btn>
        </div> -->

        </div>
      </div>
      </div>

      <div class="col-md-10 mainTable">
        
      <div class="row desno">
        <div class="col-4">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="From"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
         <!-- <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field> -->
        </div>
        <div class="col-md-4">
        <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date2"
                label="To"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            
            <v-date-picker
              v-model="date2"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </div>
          <div class="col-md-4">
                       
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

                
            
          </div>
        </div>
      <v-data-table
        :headers="headers"
        hide-details
        :items-per-page="7"
        :items="allData"
        :search="search"
        show-expand
        :single-expand="true"
        loading
        loading-text="Učitavanje podataka..."
        class="elevation-1"
        @item-expanded="expand"
      >
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(true)" v-if="!isExpanded">Info</v-btn>
          <v-btn @click="expand(false)" v-if="isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" style="background: black; color: white">
            <table class="table">
              <thead>
                <tr>
                  <td>
                    Period: od <b>{{date}}</b> do <b>{{date2}}</b>
                  </td>
                </tr>
                <tr>
                  <th>Broj Tiketa</th>
                  <th>Broj Parova Mean</th>
                  <th>Kvota Tiketa Mean</th>
                  <th>Kvota Linija Mean</th>
                  <th>Bet Mean</th>
                  <th>Sum Bet</th>
                  <th>Sum Win</th>
                  <th>Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!loadingUserData">
                  <td>{{ selectedUserData.broj_tiketa }}</td>
                  <td>{{ selectedUserData.broj_parova_mean }}</td>
                  <td>{{ selectedUserData.kvota_tiketa_mean }}</td>
                  <td>{{ selectedUserData.kvota_linija_mean }}</td>
                  <td>{{ selectedUserData.bet_mean }}</td>
                  <td>{{ selectedUserData.sum_bet }}</td>
                  <td>{{ selectedUserData.sum_win }}</td>
                  <td>{{ selectedUserData.profit }}</td>
                  <td>{{ selectedUserData.margin }}</td>
                </tr>
                <tr v-if="loadingUserData">
                  <td colspan="9">Loading data...</td>
                </tr>
              </tbody>
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
const axios = require("axios").default;
export default {
  components: {},
  data() {
    return {
      date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      date:new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      menu:false,
      menu2: false,
      loadingUserData: false,
      selectedUserData: {},
      expanded: [],
      search: "",
      balanceLimit: 20000,
      slipCount:1000,
      headers: [
        {
          text: "Username",
          align: "start",
          value: "username",
        },
        { text: "Balance (RSD)", value: "balance" },
        { text: "Registration Date", value: "date_of_reg" },
      ],
      allData: [
        // {
        //   id: 1,
        //   balance: 1000,
        //   username: "SSS",
        //   date_of_reg: "2021-02-01",
        // },
      ],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    searchData(){
      this.allData = []
      axios
      .post("http://10.0.90.23:8000/api/UserReport3", {
        tip: 1,
        balanceLimit: parseInt(this.balanceLimit),
        slipCount: parseInt(this.slipCount),
      })
      .then((response) => {
        this.allData = response.data.tiket;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    expand(item) {
      if (!item.value){
        this.selectedUserData = {};
      } else {
      this.getUserData(item.item.id);

      }
    },
    getUserData(id) {
      this.loadingUserData = true;
      // axios
      //   .post("http://10.0.90.23:8000/api/UserReport3", {
      //     tip: 2,
      //     from: "'"+this.date+" 08:00:00.000'",
      //     to: "'"+this.date2+" 08:00:00.000'",
      //     userId: "'" + id + "'",
      //   })
      //   .then((response) => {
      //     this.loadingUserData = false;
      //     let data = response.data.tiket[0];
      //     this.selectedUserData = data;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
  },
  created() {
    this.allData = [{"username":"Galileo", "balance":45000, "date_of_reg":"2021-09-13"}]
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
<style scoped>
.v-btn__content {
  color: black !important;
}
.row{
  margin:0px!important;
}
.row.desno{
  background-color: rgb(255, 255, 255);
  width:inherit!important;
  margin-left:0%;
}

.card{
  background: white!important;
  box-shadow: none;
  padding-top:20px;
    border-radius: 10px;

}
.card label{
  font-size: 13px;
}
.card h1, .card h2, .card h3, .card h4, .card h5, .card h6, .card p{
  color:#2E2E2E!important;
}


.card-header{
    background: #FFD546!important;
    background: linear-gradient(0.25turn, #FFD546, #ffe489, #FFD546)!important;
    text-align: center!important;
    text-transform: uppercase;
    margin: 13px 0px;   
    height:30px;
    box-shadow: 0px 2px 3px #cccccc;
    padding-top:6px!important;
}
.report-title{
      font-size: 19px!important;
       text-align: center!important;

}
.col-12 span.v-btn__content{
  min-width: 130px!important;

}
.col-12{
  width: 100%!important;
  text-align: center;
}
i.v-icon.notranslate.mdi.mdi-calendar.theme--light{
  padding-right: 12px!important;
}
.mainData {
  background: white;
  border-radius: 10px;
  padding:0px!important;
  height: 450px;
  position: fixed;
  margin-left: -11px!important;
}
.mainTable{
  position: relative;
  left:13.4%;
}
tbody tr > td:nth-child(1){
  color:rgb(31, 31, 31)!important;
  
}
.col-md-10{
  background-color: #FFFFFF;
  border-radius: 5px;
}
.report-title {
  font-size: 25px;
}
.mtop10{
  margin-top:10px!important
}
button.v-btn--is-elevated{
  background-color: #468F73!important;
  height:34px!important;
}
button.v-btn--is-elevated:active, .v-btn__content:active{
  outline: none;
}
.col-md-4.mtop10 .v-btn{
  width: 124px!important;
  background-color:#5ece84!important;
}
.theme--light.v-input input{
  /* background: rgb(248, 248, 248)!important; */
}
.v-data-table{
  border-radius: 10px!important;
}

.v-data-footer{
  justify-content: space-between;
  height: 50px;
}
.v-data-footer_select{
flex-direction: end;
}

button.v-btn--is-elevated{
  background-color: #468f73!important;
  height:34px!important;
}
button.v-btn--is-elevated:active{
  outline: none;
}
.col-12 button[type=button]:active{
  background: rgb(83, 207, 170)!important;
  
}
.col-12 button[type=button]{
  border-radius: 0px;
}
.v-data-footer__pagination{
  position: relative;
  left:8%;

}
.v-data-footer__icons-before{
  position:relative;
  left:-28%;
  background-color: #FFD546;
  border-radius: 30%;
}
.v-data-footer__icons-after{
  position:relative;
  right:48%;
  background-color: #FFD546;
  border-radius: 30%;
}
.v-select__selections{
  margin-left:10px!important;
}
.table th, .table td{
  border-top:1px solid rgba(8, 8, 8, 0.2);
}
.table > thead > tr > th, table{
  color:#1D201F;
}
.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover{
  background-color:#494949!important;
  transition: 0.2s;
  color:rgb(252, 252, 252)!important;
  }
.v-data-table__expanded.v-data-table__expanded__content >*{
  background-color:#F9F2F9!important;
}


@media (min-width: 960px){
.col-md-10 {
    flex: 0 0 86.6666666667%!important;
    max-width: 86.6666666667%!important;
}
.mainData{
  flex: 0 0 12.6666666667%!important;
    max-width: 12.6666666667%!important;

}
}
</style>

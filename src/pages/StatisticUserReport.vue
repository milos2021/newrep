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
        <span class="report-title">Statistic User Report</span>
        <div class="row d-flex flex-column">
          <article class="card-group-item">
            <header class="card-header">
              <h5>Period</h5>
            </header>
            <div class="filter-content">
              <div class="card-body pick-date">
                <v-row align="center">
                  <v-col class="d-flex" cols="12" md="12">
                    <vue-rangedate-picker
                      @selected="onDateSelected"
                      :captions="pickerDescription"
                      :months="months"
                      :shortDays="shortDays"
                      :initRange="selectedDate"
                      i18n="EN"
                    >
                    </vue-rangedate-picker>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Slip Type</h5>
            </header>
            <div class="filter-content">
              <div class="card-body slip-type">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-radio-group v-model="defaultSlipType">
                        <v-radio
                          v-for="type in slipTypes"
                          :key="type"
                          :label="type"
                          :value="type"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Igra</h5>
            </header>
            <div class="filter-content">
              <div class="card-body igra">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-checkbox
                        label="Fudbal"
                        hide-details
                        v-model="sport.fudbal"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-checkbox
                        label="Košarka"
                        value="Košarka"
                        hide-details
                        v-model="sport.kosarka"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-checkbox
                        label="Tenis"
                        value="Tenis"
                        hide-details
                        v-model="sport.tenis"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-checkbox
                        label="Igrači Specijal"
                        value="Igrači Specijal"
                        hide-details
                        v-model="sport.igraciSpecijal"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-checkbox
                        label="Ostalo"
                        value="Ostalo"
                        hide-details
                        v-model="sport.ostalo"
                        v-bind:false-value="false"
                        v-bind:true-value="true"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article>
          <!-- <article class="card-group-item">
            <header class="card-header">
              <h5>Uneti Username</h5>
            </header>
            <div class="filter-content">
              <div class="card-body username">
                <form>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" md="12">
                      <v-text-field></v-text-field>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </article> -->
          <article class="card-group-item">
            <header class="card-header relative"></header>
            <div class="filter-content">
              <div class="card-body">
                <form>
                  <div class="btn-group-vertical">
                    <v-btn
                      depressed
                      tabindex="1"
                      class="btn btn-dark"
                      v-on:click="searchData()"
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
      
      <v-data-table
        :headers="headers"
        hide-details
        :items-per-page="15"
        item-key="username"
        :items="filteredData"
        :search="search"
        show-expand
        single-expand
        :loading="isLoading"
        loading-text="Učitavanje podataka..."
        class="elevation-1"
        @item-expanded="expand"
      >
      <template v-slot:header.username="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="username ? 'primary' : ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="username"
                  class="pa-4"
                  type="number"
                  label="Enter username"
                ></v-text-field>
                <v-btn
                  @click="username = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >Clean</v-btn>
              </div>
            </v-menu>
          </template>
          
          <template v-slot:header.betmean="{ header }">
            {{ header.text }}
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon small :color="betmean ? 'primary': ''">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <div style="background-color: white; width: 280px">
                <v-text-field
                  v-model="betmean"
                  class="pa-4"
                  type="number"
                  label="Enter the search term"
                ></v-text-field>
                <v-btn
                  @click="betmean = ''"
                  small
                  text
                  color="primary"
                  class="ml-2 mb-2"
                >Clean</v-btn>
              </div>
            </v-menu>
          </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(item.slipuserid)" v-if="!isExpanded"
            >Info</v-btn
          >
          <v-btn @click="expand(false)" v-if="isExpanded">close</v-btn>
        </template>
        <!-- FUDBAL -->
        <template v-slot:item.fudbalsumbet="{ item }">
          <span>{{ convertToCurrency(item.fudbalsumbet) }}</span>
        </template>
        <template v-slot:item.fudbalsumwin="{ item }">
          <span>{{ convertToCurrency(item.fudbalsumwin) }}</span>
        </template>
        <template v-slot:item.profitfudbal="{ item }">
          <span>{{ convertToCurrency(item.profitfudbal) }}</span>
        </template>
        <template v-slot:item.marginfudbal="{ item }">
          <span>{{ convertToMargin(item.marginfudbal) }}</span>
        </template>
        <!-- KOSARKA -->
        <template v-slot:item.kosarkasumbet="{ item }">
          <span>{{ convertToCurrency(item.kosarkasumbet) }}</span>
        </template>
        <template v-slot:item.kosarkasumwin="{ item }">
          <span>{{ convertToCurrency(item.kosarkasumwin) }}</span>
        </template>
        <template v-slot:item.profitkosarka="{ item }">
          <span>{{ convertToCurrency(item.profitkosarka) }}</span>
        </template>
        <template v-slot:item.marginkosarka="{ item }">
          <span>{{ convertToMargin(item.marginkosarka) }}</span>
        </template>
        <!-- TENIS -->
        <template v-slot:item.tenissumbet="{ item }">
          <span>{{ convertToCurrency(item.tenissumbet) }}</span>
        </template>
        <template v-slot:item.tenissumwin="{ item }">
          <span>{{ convertToCurrency(item.tenissumwin) }}</span>
        </template>
        <template v-slot:item.profittenis="{ item }">
          <span>{{ convertToCurrency(item.profittenis) }}</span>
        </template>
        <template v-slot:item.margintenis="{ item }">
          <span>{{ convertToMargin(item.margintenis) }}</span>
        </template>
        <!-- Igraci Specijal -->
        <template v-slot:item.igracispecijalsumbet="{ item }">
          <span>{{ convertToCurrency(item.igracispecijalsumbet) }}</span>
        </template>
        <template v-slot:item.igracispecijalsumwin="{ item }">
          <span>{{ convertToCurrency(item.igracispecijalsumwin) }}</span>
        </template>
        <template v-slot:item.profitigracispecijal="{ item }">
          <span>{{ convertToCurrency(item.profitigracispecijal) }}</span>
        </template>
        <template v-slot:item.marginigracispecijal="{ item }">
          <span>{{ convertToMargin(item.marginigracispecijal) }}</span>
        </template>
        <!-- OSTALO -->
        <template v-slot:item.ostalosumbet="{ item }">
          <span>{{ convertToCurrency(item.ostalosumbet) }}</span>
        </template>
        <template v-slot:item.ostalosumwin="{ item }">
          <span>{{ convertToCurrency(item.ostalosumwin) }}</span>
        </template>
        <template v-slot:item.profitostalo="{ item }">
          <span>{{ convertToCurrency(item.profitostalo) }}</span>
        </template>
        <template v-slot:item.marginostalo="{ item }">
          <span>{{ convertToMargin(item.marginostalo) }}</span>
        </template>

        <template v-slot:item.brojparovamean="{ item }">
          <span>{{ convertToCurrency(item.brojparovamean) }}</span>
        </template>
        <template v-slot:item.kvotalinijamean="{ item }">
          <span>{{ convertToCurrency(item.kvotalinijamean) }}</span>
        </template>
        <template v-slot:item.kvotatiketamean="{ item }">
          <span>{{ convertToCurrency(item.kvotatiketamean) }}</span>
        </template>
        <template v-slot:item.betmean="{ item }">
          <span>{{ convertToCurrency(item.betmean) }}</span>
        </template>
        <template v-slot:item.sumbet="{ item }">
          <span>{{ convertToCurrency(item.sumbet) }}</span>
        </template>
        <template v-slot:item.sumwin="{ item }">
          <span>{{ convertToCurrency(item.sumwin) }}</span>
        </template>
        <template v-slot:item.profit="{ item }">
          <span>{{ convertToCurrency(item.profit) }}</span>
        </template>
        <template v-slot:item.margin="{ item }">
          <span>{{ convertToMargin(item.margin) }}</span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" style="background: black; color: white">
            <table class="table tData">
              <tr>
                <td>
                  Period: od <b>{{ formatDate(selectedDate.start) }}</b> do
                  <b>{{ formatDate(selectedDate.end) }}</b>
                  <span v-if="Object.keys(selectedUserData).length > 0">
                    - Risk Level: {{ selectedUserData.risklevel }}</span
                  >
                </td>
              </tr>
              <tr v-if="loadingUserData">
                <td colspan="9">Loading data...</td>
              </tr>
            </table>
            <div v-if="!loadingUserData">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Num Lines</span><br />
                      <span> {{ selectedUserData.numlines }}</span>
                    </div>
                  </div>
                  <!-- <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Risk Level</span><br />
                      <span> {{ selectedUserData.risklevel }}</span>
                    </div>
                  </div> -->
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Perc. Hit</span><br />
                      <span>
                        {{ convertToMargin(selectedUserData.perchit) }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Min. Razl. Mean</span
                      ><br />
                      <span> {{ selectedUserData.minutirazlikamean }}</span>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Total Bet</span><br />
                      <span>
                        {{ convertToCurrency(selectedUserData.bet) }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Bet Mean</span><br />
                      <span>
                        {{ convertToCurrency(selectedUserData.betmean) }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Bet Std</span><br />
                      <span>
                        {{ convertToCurrency(selectedUserData.betstd) }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Total Win</span><br />
                      <span>
                        {{ convertToCurrency(selectedUserData.win) }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Kv. Lin. Mean</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.kvotalinijamean)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Kv. Tik. Mean</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.kvotatiketamean)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Kv. Tik. Std</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.kvotatiketastd)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Broj Tiketa</span><br />
                      <span> {{ selectedUserData.brojtiketa }}</span>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary" role="alert">
                      <span style="font-size: 10px"> Br. Par. Mean</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.brojparovamean)
                        }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Fudbal Bet</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.fudbalsumbet)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Fudbal Win</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.fudbalsumwin)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Fudbal Profit</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.profitfudbal)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Fudbal Margin</span><br />
                      <span>
                        {{
                          convertToMargin(selectedUserData.marginfudbal)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Kosarka Bet</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.kosarkasumbet)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Kosarka Win</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.kosarkasumwin)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Kosarka Profit</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.profitkosarka)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Kosarka Margin</span><br />
                      <span>
                        {{
                          convertToMargin(selectedUserData.marginkosarka)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Tenis Bet</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.tenissumbet)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Tenis Win</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.tenissumwin)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Tenis Profit</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.profittenis)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Tenis Margin</span><br />
                      <span>
                        {{
                          convertToMargin(selectedUserData.margintenis)
                        }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Igr. Sp. Bet</span><br />
                      <span>
                        {{
                          convertToCurrency(
                            selectedUserData.igracispecijalsumbet
                          )
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Igr. Sp. Win</span><br />
                      <span>
                        {{
                          convertToCurrency(
                            selectedUserData.igracispecijalsumwin
                          )
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Igr. Sp. Profit</span
                      ><br />
                      <span>
                        {{
                          convertToCurrency(
                            selectedUserData.profitigracispecijal
                          )
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Igr. Sp. Margin</span
                      ><br />
                      <span>
                        {{
                          convertToMargin(selectedUserData.marginigracispecijal)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Ostalo Bet</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.ostalosumbet)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Ostalo Win</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.ostalosumwin)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Ostalo Profit</span><br />
                      <span>
                        {{
                          convertToCurrency(selectedUserData.profitostalo)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="alert alert-primary sportAlert" role="alert">
                      <span style="font-size: 10px"> Ostalo Margin</span><br />
                      <span>
                        {{
                          convertToMargin(selectedUserData.marginostalo)
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div
                      class="alert alert-primary sportAlert"
                      role="alert"
                      style="height: 60%"
                    >
                      <span style="font-size: 10px"> Total Profit</span><br />
                      <span>
                        {{
                          convertToCurrency(
                            Math.round(
                              selectedUserData.bet - selectedUserData.win,
                              2
                            )
                          )
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div
                      class="alert alert-primary sportAlert"
                      role="alert"
                      style="height: 60%"
                    >
                      <span style="font-size: 10px"> Total Margin</span><br />
                      <span>
                        {{
                          convertToMargin(
                            (selectedUserData.bet - selectedUserData.win) /
                              selectedUserData.bet
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
  <!-- <div class="col-12">
            show-expand
        :single-expand="true"
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
import _ from "lodash";
const axios = require("axios").default;
import VueRangedatePicker from "vue-rangedate-picker";
export default {
  components: { VueRangedatePicker },
  data() {
    return {
      betmean:"",
      username:"",
      sport: {
        fudbal: false,
        kosarka: false,
        tenis: false,
        igraciSpecijal: false,
        ostalo: false,
      },
      isLoading: false,
      defaultSlipType: "Prematch",
      slipTypes: ["Prematch", "Live"],
      months: [
        "Januar",
        "Februar",
        "Mart",
        "April",
        "Maj",
        "Jun",
        "Jul",
        "Avgust",
        "Septembar",
        "Oktobar",
        "Novembar",
        "Decembar",
      ],
      shortDays: ["Ned", "Pon", "Uno", "Sre", "Cet", "Pet", "Sub"],
      pickerDescription: {
        title: "Izaberi opseg",
        ok_button: "Primeni",
      },
      selectedDate: {
        start: "",
        end: "",
      },
      izabraniPeriod: "7 Dana",
      menu: false,
      menu2: false,
      loadingUserData: false,
      selectedUserData: {},
      expanded: [],
      search: "",
      headers: this.getHeaders(),
      dates: [],
      allData: [],
      from: new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .substr(0, 10),
      to: new Date().toISOString().substr(0, 10),
    };
  },
  computed:{
filteredData() {
      
      var conditions = [];
      
      if (this.betmean) {
        conditions.push(this.filterBetmean);
      }
      
      if (this.username) {
        conditions.push(this.filterUsername);
      }
      
      
      if (conditions.length > 0) {
        return this.allData.filter((dessert) => {
          return conditions.every((condition) => {
            return condition(dessert);
          })
        })
      }
      
      return this.allData;
    }
  },
  methods: {
         filterUsername(item) {
       return item.username.toLowerCase().includes(this.username.toLowerCase());
     },
     filterBetmean(item) {
       return item.betmean.toString().includes(this.betmean);
     },
    convertToCurrency(value) {
      if (value == "/") {
        return value;
      }
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      return formatter.format(value).replace("$", "");
    },
    convertToMargin(value) {
      return (value * 100).toFixed(2) + "%";
    },
    getHeaders(type) {
      let headers;
      if (!type) {
        headers = [
          {
            text: "UserName",
            align: "start",
            value: "username",
          },
          { text: "AVG Br. Parova", value: "brojparovamean", align: "right" },
          { text: "Br. Tiketa", value: "brojtiketa", align: "right" },
          { text: "AVG Kv. Linija", value: "kvotalinijamean", align: "right" },
          { text: "AVG Kv. Tiketa", value: "kvotatiketamean", align: "right" },
          { text: "AVG Bet", value: "betmean", align: "right" },
          { text: "Bet Sum", value: "sumbet", align: "right" },
          { text: "Win Sum", value: "sumwin", align: "right" },
          { text: "Profit", value: "profit", align: "right" },
          { text: "Margin", value: "margin", align: "right" },
        ];
      } else {
        headers = [
          {
            text: "Username",
            align: "start",
            value: "username",
          },
          { text: "Num Lines", value: "numlines", align: "right" },
          { text: "Broj Tiketa", value: "brojtiketa", align: "right" },
        ];
        headers = this.getHeadersForSpecificSports(headers);
      }
      return headers;
    },
    getHeadersForSpecificSports(headers) {
      let obj = headers;
      if (_.cloneDeep(this.sport.fudbal)) {
        obj.push({
          text: "Fudbal Sum Bet",
          value: "fudbalsumbet",
          align: "right",
        });
        obj.push({
          text: "Fudbal Sum Win",
          value: "fudbalsumwin",
          align: "right",
        });
        obj.push({
          text: "Fudbal Br. Tiketa",
          value: "fudbalbrojtiketa",
          align: "right",
        });
        obj.push({
          text: "Profit Fudbal",
          value: "profitfudbal",
          align: "right",
        });
        obj.push({
          text: "Margin Fudbal",
          value: "marginfudbal",
          align: "right",
        });
      }
      if (_.cloneDeep(this.sport.kosarka)) {
        obj.push({
          text: "Kosarka Sum Bet",
          value: "kosarkasumbet",
          align: "right",
        });
        obj.push({
          text: "Kosarka Sum Win",
          value: "kosarkasumwin",
          align: "right",
        });
        obj.push({
          text: "Kosarka Br. Tiketa",
          value: "kosarkabrojtiketa",
          align: "right",
        });
        obj.push({
          text: "Profit Kosarka",
          value: "profitkosarka",
          align: "right",
        });
        obj.push({
          text: "Margin Kosarka",
          value: "marginkosarka",
          align: "right",
        });
      }
      if (_.cloneDeep(this.sport.tenis)) {
        obj.push({
          text: "Tenis Sum Bet",
          value: "tenissumbet",
          align: "right",
        });
        obj.push({
          text: "Tenis Sum Win",
          value: "tenissumwin",
          align: "right",
        });
        obj.push({
          text: "Tenis Br. Tiketa",
          value: "tenisbrojtiketa",
          align: "right",
        });
        obj.push({
          text: "Profit Tenis",
          value: "profittenis",
          align: "right",
        });
        obj.push({
          text: "Margin Tenis",
          value: "margintenis",
          align: "right",
        });
      }
      if (_.cloneDeep(this.sport.igraciSpecijal)) {
        obj.push({
          text: "Igraci Spec. Sum Bet",
          value: "igracispecijalsumbet",
          align: "right",
        });
        obj.push({
          text: "Igraci Spec. Sum Win",
          value: "igracispecijalsumwin",
          align: "right",
        });
        obj.push({
          text: "Igraci Spec. Broj Tiketa",
          value: "igracispecijalbrojtiketa",
          align: "right",
        });
        obj.push({
          text: "Profit Igraci Spec.",
          value: "profitigracispecijal",
          align: "right",
        });
        obj.push({
          text: "Margin Igraci Spec.",
          value: "marginigracispecijal",
          align: "right",
        });
      }
      if (_.cloneDeep(this.sport.ostalo)) {
        obj.push({
          text: "Ostalo Sum Bet",
          value: "ostalosumbet",
          align: "right",
        });
        obj.push({
          text: "Ostalo Sum Win",
          value: "ostalosumwin",
          align: "right",
        });
        obj.push({
          text: "Ostalo Br. Tiketa",
          value: "ostalobrojtiketa",
          align: "right",
        });
        obj.push({
          text: "Profit Ostalo",
          value: "profitostalo",
          align: "right",
        });
        obj.push({
          text: "Margin Ostalo",
          value: "marginostalo",
          align: "right",
        });
      }

      return obj;
    },
    onDateSelected: function (daterange) {
      this.selectedDate = daterange;
      console.log(daterange);
    },
    formatDate(date) {
      const offset = date.getTimezoneOffset();
      date = new Date(date.getTime() - offset * 60 * 1000);
      return date.toISOString().split("T")[0];
    },
    isDefaultReport() {
      var fudbal = this.sport.fudbal;
      var kosarka = this.sport.kosarka;
      var tenis = this.sport.tenis;
      var igraciSpecijal = this.sport.igraciSpecijal;
      var ostalo = this.sport.ostalo;
      console.log(fudbal, kosarka, tenis, igraciSpecijal, ostalo);
      return !(fudbal || kosarka || tenis || igraciSpecijal || ostalo);
    },
    getSelectedSports() {
      var fudbal = this.sport.fudbal;
      var kosarka = this.sport.kosarka;
      var tenis = this.sport.tenis;
      var igraciSpecijal = this.sport.igraciSpecijal;
      var ostalo = this.sport.ostalo;
      var sports = [
        fudbal ? 1 : 0,
        kosarka ? 2 : 0,
        tenis ? 3 : 0,
        igraciSpecijal ? 12 : 0,
        ostalo ? 123 : 0,
      ];
      sports = sports.filter((x) => x != 0);
      return sports;
    },
    searchData() {
      this.allData = [];
      var isDefault = this.isDefaultReport();
      console.log(isDefault);
      this.headers = isDefault ? this.getHeaders() : this.getHeaders(true);
      if (this.selectedDate.start == "" || this.selectedDate.end == "") return;
      this.isLoading = true;
      axios
        .post("http://10.0.90.23:8000/api/StatisticUserReport", {
          type: isDefault ? null : this.getSelectedSports(),
          from: new Date(new Date(this.selectedDate.start))
            .toISOString()
            .substr(0, 10),
          to: new Date(new Date(this.selectedDate.end))
            .toISOString()
            .substr(0, 10),
          slipType: this.defaultSlipType.toLowerCase() == "prematch" ? 0 : 1,
        })
        .then((response) => {
          this.allData = response.data.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    expand(item) {
      if (!item.value) {
        this.selectedUserData = {};
      } else {
        this.getUserData(item.value);
      }
    },
    getUserData(id) {
      this.loadingUserData = true;
      let from = new Date(new Date(this.selectedDate.start))
      let to = new Date(new Date(this.selectedDate.end))
      to.setDate(to.getDate() + 1)
      axios
        .post("http://10.0.90.23:8000/api/StatisticUserData", {
          userId: id,
          from:
            from
              .toISOString()
              .substr(0, 10) + " 08:00:00.000",
          to:
            to
              .toISOString()
              .substr(0, 10) + " 08:00:00.000",
          slipType: this.defaultSlipType == "Prematch" ? 0 : 1,
        })
        .then((response) => {
          this.loadingUserData = false;

          console.log(response.data.tiket[0]);
          this.selectedUserData = response.data.tiket[0];
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.loadingUserData = false;
        });
    },
  },
  created() {},
};
</script>
<style scoped>
.card-group-item:last-child{
  padding-top:25px!important;
  margin:0px!important;
}
article:last-child{
  height:90px!important;
}
.v-input--checkbox{
  margin:0px;
}
.v-input__slot >*{
    padding-right:40px!important;

}
.v-input--selection-controls.v-input--checkbox:nth-child(4){
  margin-left:20%!important;
}

/* .searchField{
  background: linear-gradient(0.35turn, #4b4950, 40%, #1e1e2f);
  color:white!important;
  padding-top: 6px!important;
    padding-bottom: 1px;
    margin-bottom: 12px;
    border: 1px solid white;
    border-radius: 7px;
}

.searchField .theme--light.v-input, .theme--light.v-input input, .theme--light.v-input textarea{
  color:white!important
}

.searchField .theme--light.v-label{
  color:white!important
}

.theme--light.v-text-field > .v-input__control > .v-input__slot:active {
  color: #000000 !important;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:after {
  color: #ffffff !important;
  background: #626272;
}
#mainTable v-table v-thead > * {
  padding-top: 20px !important;
}

.sportAlert {
  background: #ccc;
  color: black;
  font-weight: bold;
}
*/

  
  /*
article {
  width: 100% !important;
}

.tData > tbody > tr > td {
  color: black !important;
}
article {
  width: 100% !important;
}
.filter-content {
  width: auto !important;
}
.input-date[data-v-5e837f70] {
  width: 212px !important;
}
.v-btn__content {
  color: black !important;
}
.mainData,
.card {
  background: white !important;
  box-shadow: none;
  border-radius: 8px;
  height: 840px;
}
.mainData {
}
.card {
  margin-top: 0px;
  height: 820px;
}
.col-md-2 * {
  padding-bottom: 1px !important;
  padding-top: 3px !important;
}
.report-title {
  font-size: 19px;
  padding: 12px;
}
.mtop10 {
  margin-top: 10px !important;
}
.mainTable {
  position: relative !important;
}
.card label {
  font-size: 13px;
}
.calendar_preset-ranges {
  color: black;
}

.card-header {
  background: #ffd546 !important;
  background: linear-gradient(0.25turn, #ffd546, #ffe489, #ffd546) !important;
  text-align: center;
  text-transform: uppercase;
  margin: 13px 0px;
  height: 30px;
  box-shadow: 0px 2px 3px #cccccc;
  padding-top: 6px !important;
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
  position: relative;
  top: 8px;
}

.theme--light.v-label {
  color: rgb(14, 13, 13) !important;
  padding-left: 5px;
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

.btn-group-vertical {
  width: 90%;
  position: relative !important;
  bottom: 100px;
  left: 13%;
  display: block !important;
}
.btn-group-vertical > * {
  margin: 10px auto;
  height: 28px;
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
.v-data-table {
  border-radius: 10px !important;
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
.col-12 button[type="button"]:active {
  background: rgb(83, 207, 170) !important;
}
.col-12 button[type="button"] {
  border-radius: 0px;
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
.table th,
.table td {
  border-top: 1px solid rgba(8, 8, 8, 0.2);
}
.table > thead > tr > th,
table {
  color: #1d201f;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: #494949 !important;
  transition: 0.2s;
  color: rgb(252, 252, 252) !important;
}
.v-data-table__expanded.v-data-table__expanded__content > * {
  background-color: #f9f2f9 !important;
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
} */
</style>

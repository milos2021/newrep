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
    <div
      v-if="!fullScreen"
      v-bind:class="{ sakriven: danas, 'col-md-2': !danas && !fullScreen }"
    >
      <div class="card">
        <span class="report-title">Cashflow Report</span>
        <div class="row d-flex flex-column">
          <article class="card-group-item">
            <header class="card-header">
              <h5>Payment method</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-select
                      :items="methods"
                      item-value="id"
                      item-text="title"
                      v-model="filters.method"
                      label="Payment Method"
                      v-on:change="filterByMethod"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>
          <article class="card-group-item">
            <header class="card-header">
              <h5>Period</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <v-row align="center">
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      :items="periods"
                      item-value="id"
                      item-text="title"
                      v-model="filters.period"
                      label="Period"
                      v-on:change="filterByPeriod"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>
          <article class="card-group-item" v-if="otherLists.showMonth">
            <header class="card-header">
              <h5>Filter by Month</h5>
            </header>
            <div class="filter-content">
              <div class="card-body tip-tiketa">
                <v-row align="center">
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      :items="months"
                      item-value="id"
                      item-text="title"
                      v-model="filters.month"
                      label="Month"
                      v-on:change="filterByMonth"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>
          <!-- godina -->
          <article class="card-group-item" v-if="otherLists.showYear">
            <header class="card-header">
              <h5>Filter by Year</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <v-row align="center">
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      :items="years"
                      item-value="id"
                      item-text="title"
                      v-model="filters.year"
                      label="Year"
                      v-on:change="filterByYear"
                    ></v-select>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>
          <!-- vikend -->
          <article class="card-group-item" v-if="otherLists.showCalendar">
            <header class="card-header">
              <h5>Filter by weekend</h5>
            </header>
            <div class="filter-content">
              <div class="card-body">
                <v-row align="center" id="weekend">
                  <v-col cols="12" sm="12" md="12">
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="dates"
                      persistent
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dates"
                          multiple
                          label="Select dates"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dates"
                        multiple
                        dark
                        chips
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(dates)"
                        >
                          OK
                        </v-btn>
                        <v-btn text color="primary" @click="modal = false">
                          Close
                        </v-btn>
                        <v-btn text color="primary" @click="dates = []">
                          Clear
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <div class="text-center">
                      <v-snackbar v-model="snackbar" :timeout="timeout">
                        {{ errorText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn
                            color="blue"
                            text
                            v-bind="attrs"
                            @click="snackbar = false"
                          >
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </article>

          <article class="card-group-item">
            <header class="card-header relative"></header>
            <div class="filter-content">
              <div class="card-body">
                <div class="btn-group-vertical">
                  <v-btn
                    color="primary"
                    elevation="2"
                    id="blackBtn"
                    v-on:click="searchData"
                    class="btn btn-dark"
                  >
                    Search</v-btn
                  >
                  <!-- <v-btn v-on:click="goFull()" depressed class="btn btn-light">
                    FS</v-btn
                  > -->

                  <!-- <export-excel
                            class="btn btn-default"
                            :data="json_data"
                            type="csv"
                            :name="todayDateFile"
                            v-if="!initialLoad && tiketi.length > 0"
                        >
                            <img
                            src="@/assets/excel.png"
                            style="
                                margin-top: -8px;
                                margin-left: 3px;
                                width: 40px;
                                cursor: pointer;
                            "
                            />
                        </export-excel> -->
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div
      v-bind:class="{
        'col-md-12': danas || fullScreen,
        'col-md-10': !danas && !fullScreen,
        mt30: danas ? true : false,
        mt15: fullScreen ? true : false,
        mainTable: true,
        desetka: danas || fullScreen ? false : true,
      }"
    >
      <!-- <div class="row search-bar">
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
      </div> -->
      <p
        v-if="danas"
        style="
          text-align: center;
          font-size: 20px;
          font-style: italic;
          margin-bottom: 5px;
        "
      >
        Cashflow Every 5 Minutes
      </p>
      <p
        v-if="danas"
        v-on:click="
          danas = false;
          filterByPeriod(3);
        "
        style="
          text-align: center;
          font-size: 15px;
          font-style: italic;
          color: yellow;
          cursor: pointer;
        "
      >
        History Mode
      </p>
      <div
        v-if="danas"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 99999;
        "
      >
        <span v-if="today" v-on:click="goThrough(-1)">
          <img src="@/assets/left-arrow.png" alt="back" width="20px" />
        </span>
        <v-btn text class="refreshBtn" @click="refresh()"> Refresh </v-btn>
        <span v-if="!today" v-on:click="goThrough(1)">
          <img src="@/assets/right-arrow.png" alt="back" width="20px" />
        </span>
        <!-- <img src="@/assets/refresh.png" width="20" alt="Osvezi" v-on:click="refresh()"/> -->
      </div>
      <p
        class="text-center"
        style="margin-top: 10px; margin-bottom: 10px; font-size: 15px"
        v-if="danas"
      >
        Last updated at:&nbsp;
        <span style="font-weight: bold">{{ danasPodaci.execution_time }}</span>
      </p>
      <table id="quick" v-if="allClosed && danas">
        <tr>
          <td class="quick_title">Deposit</td>
          <td class="quick_value">
            {{ convertToCurrency(danasPodaci.deposit_sum_all, false) }}
          </td>
        </tr>
        <tr>
          <td class="quick_title quick_double">Difference</td>
          <td
            class="quick_value"
            v-bind:class="{ crvena: danasPodaci.diff_sum < 0 }"
          >
            {{ convertToCurrency(danasPodaci.diff_sum, false) }} ({{
              convertToMargin(danasPodaci.diff_margin)
            }})
          </td>
        </tr>
        <tr>
          <td class="quick_title">Balance</td>
          <td class="quick_value">
            {{ convertToCurrency(danasPodaci.actual_std_balance, false) }}
          </td>
        </tr>
      </table>
      <div v-if="danas" class="today row">
        <!-- deposit -->
        <div class="card report3 col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-dep
              variant="primary"
              v-on:click="expandPanel(0)"
              >Deposit</b-button
            >
            <b-collapse id="collapse-dep" v-model="stanja[0]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="depositToggle" class="table">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Users</th>
                        <th>Number</th>
                        <th>Sum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-right" style="font-weight: bold">
                          All
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_all,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_all,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_sum_all,
                              false
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Shop</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_shops,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_users_shops /
                                  danasPodaci.deposit_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_shops,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_number_shops /
                                  danasPodaci.deposit_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_sum_shops,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_sum_shops /
                                  danasPodaci.deposit_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Card</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_cc,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_users_cc /
                                  danasPodaci.deposit_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_cc,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_number_cc /
                                  danasPodaci.deposit_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(danasPodaci.deposit_sum_cc, false)
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_sum_cc /
                                  danasPodaci.deposit_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Bank</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_bank,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_users_bank /
                                  danasPodaci.deposit_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_bank,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_number_bank /
                                  danasPodaci.deposit_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_sum_bank,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_sum_bank /
                                  danasPodaci.deposit_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="text-left w0">iPay</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_ipay,
                              false
                            )
                          }}<br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_users_ipay /
                                  danasPodaci.deposit_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_ipay,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_number_ipay /
                                  danasPodaci.deposit_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_sum_ipay,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_sum_ipay /
                                  danasPodaci.deposit_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Komšija</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_users_komsija,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_users_komsija /
                                  danasPodaci.deposit_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_number_komsija,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_number_komsija /
                                  danasPodaci.deposit_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.deposit_sum_komsija,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.deposit_sum_komsija /
                                  danasPodaci.deposit_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- <div class="col-md-4"><span></span></div> 
                    <div class="col-md-4"><span></span></div> 
                    <div class="col-md-4"><span> </span></div> -->
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>
        <!-- withdraw -->
        <div class="card report3 col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-with
              variant="primary"
              v-on:click="expandPanel(1)"
              >Withdraw</b-button
            >
            <b-collapse id="collapse-with" v-model="stanja[1]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="withdrawToggle" class="table">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Users</th>
                        <th>Number</th>
                        <th>Sum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-right" style="font-weight: bold">
                          All
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_users_all,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_number_all,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_sum_all,
                              false
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Shop</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_users_shops,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_users_shops /
                                  danasPodaci.withdraw_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_number_shops,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_number_shops /
                                  danasPodaci.withdraw_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_sum_shops,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_sum_shops /
                                  danasPodaci.withdraw_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Bank</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_users_bank,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_users_bank /
                                  danasPodaci.withdraw_users_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_number_bank,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_number_bank /
                                  danasPodaci.withdraw_number_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.withdraw_sum_bank,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.withdraw_sum_bank /
                                  danasPodaci.withdraw_sum_all) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>

        <!-- difference -->
        <div class="report3 card col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-diff
              variant="primary"
              v-on:click="expandPanel(2)"
              >Difference</b-button
            >
            <b-collapse id="collapse-diff" v-model="stanja[2]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="differenceToggle" class="table">
                    <thead>
                      <tr>
                        <th>Sum</th>
                        <th>Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">
                          {{ convertToCurrency(danasPodaci.diff_sum, false) }}
                        </td>
                        <td>
                          {{ convertToMargin(danasPodaci.diff_margin) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>
      </div>

      <div v-if="danas" class="today row">
        <div class="report3 card col-md-6 desktop">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-promo
              variant="primary"
              v-on:click="expandPanel(3)"
              >Promo</b-button
            >
            <b-collapse id="collapse-promo" v-model="stanja[3]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="promoToggle" class="table">
                    <thead>
                      <tr>
                        <th>Users</th>
                        <th>Number</th>
                        <th>Sum</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {{
                            convertToCurrency(danasPodaci.promo_users, false)
                          }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(danasPodaci.promo_number, false)
                          }}
                        </td>
                        <td style="font-weight: bold">
                          {{ convertToCurrency(danasPodaci.promo_sum, false) }}
                        </td>
                        <td style="font-weight: bold">
                          {{ convertToCurrency(danasPodaci.promo_cost, false) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>

        <div class="report3 card col-md-6 phone">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-promo
              variant="primary"
              v-on:click="expandPanel(4)"
              >Promo</b-button
            >
            <b-collapse id="collapse-promo" v-model="stanja[4]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="promoToggle" class="table">
                    <thead>
                      <tr>
                        <th>Users</th>
                        <th>Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {{
                            convertToCurrency(danasPodaci.promo_users, false)
                          }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(danasPodaci.promo_number, false)
                          }}
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th>Sum</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">
                          {{ convertToCurrency(danasPodaci.promo_sum, false) }}
                        </td>
                        <td style="font-weight: bold">
                          {{ convertToCurrency(danasPodaci.promo_cost, false) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>

        <!-- promo achievment -->
        <div class="report3 card col-md-6 desktop">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-balance
              variant="primary"
              v-on:click="expandPanel(5)"
              >Balance</b-button
            >
            <b-collapse id="collapse-balance" v-model="stanja[5]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="balanceToggle" class="table">
                    <thead>
                      <tr>
                        <th>Std Actual</th>
                        <th>Reserved <br />(Bank)</th>
                        <th>Not Approved (Bank)</th>
                        <th>
                          Reserved <br />
                          (Shop)
                        </th>
                        <th>Not Approved<br />(Shop)</th>
                        <th>Promo Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.actual_std_balance,
                              false
                            )
                          }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(
                              danasPodaci.permanently_reserved,
                              false
                            )
                          }}
                        </td>
                        <td>
                          {{ convertToCurrency(danasPodaci.na_per, false) }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(
                              danasPodaci.temporarely_reserved,
                              false
                            )
                          }}
                        </td>
                        <td>
                          {{ convertToCurrency(danasPodaci.na_tem, false) }}
                        </td>
                        <td style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.actual_promo_balance,
                              false
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>

        <div class="report3 card col-md-6 phone">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-balance
              variant="primary"
              v-on:click="expandPanel(6)"
              >Balance</b-button
            >
            <b-collapse id="collapse-balance" v-model="stanja[6]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="balanceToggle" class="table">
                    <thead>
                      <tr>
                        <th>Std<br />Actual</th>
                        <th>Reserved<br />(Bank)</th>
                        <th>Not&nbsp;Approved (Bank)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.actual_std_balance,
                              false
                            )
                          }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(
                              danasPodaci.permanently_reserved,
                              false
                            )
                          }}
                        </td>
                        <td class="red">
                          {{ convertToCurrency(danasPodaci.na_per, false) }}
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th>Promo Actual</th>

                        <th>
                          Reserved <br />
                          (Shop)
                        </th>
                        <th>Not Approved<br />(Shop)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.actual_promo_balance,
                              false
                            )
                          }}
                        </td>
                        <td>
                          {{
                            convertToCurrency(
                              danasPodaci.temporarely_reserved,
                              false
                            )
                          }}
                        </td>
                        <td class="red">
                          {{ convertToCurrency(danasPodaci.na_tem, false) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </div>
      </div>
      <p
        v-if="fullScreen"
        style="text-align: center; font-weight: bold; cursor: pointer"
        v-on:click="exitFull()"
      >
       {{searchMode.month ? filters.year+"/"+methods.filter(x=>x.id==filters.method)[0].title : meseci[filters.month-1]+"/"+filters.year+"/"+methods.filter(x=>x.id==filters.method)[0].title}} - <span style="color:yellow">Back To Filters</span>
      </p>
      <v-data-table
        id="report2"
        :height="determineTableHeight()"
        v-if="!danas && !isMobileInitial()"
        :headers="headers"
        :hide-default-header="true"
        mobile-breakpoint="0"
        :items-per-page="itemsPerPage"
        hide-default-footer
        :items="cashflowData"
        :loading="loadTable"
        @page-count="pageCount = $event"
        no-data-text="No data"
        loading-text="Data is loading..."
      >
        <template v-slot:header="{ props }">
          <div class="fixHeader">
            <tr style="text-align: center">
              <th class="stiki"></th>
              <th
                colspan="3"
                style="
                  border-left: 1px solid black;
                  border-right: 1px solid black;
                  background: #f2f2f2;
                  font-weight: 600;
                "
              >
                Deposit
              </th>
              <th
                colspan="3"
                style="
                  background: #f2f2f2;
                  border-right: 1px solid black;
                  font-weight: 600;
                "
              >
                Withdraw
              </th>
              <th
                colspan="2"
                style="
                  background: #f2f2f2;
                  border-right: 1px solid black;
                  font-weight: 600;
                "
              >
                Difference
              </th>

              <th
                colspan="2"
                style="
                  border-right: 1px solid black;
                  background: #f2f2f2;
                  font-weight: 600;
                "
              >
                Standard Balance
              </th>
              <th
                colspan="4"
                style="
                  border-right: 1px solid black;
                  background: #f0efed;
                  font-weight: 600;
                "
              >
                Promo Achivement
              </th>
              <th colspan="2" style="background: #f0efed; font-weight: 600">
                Promo Balance
              </th>
            </tr>
            <tr style="text-align: center">
              <th class="mainHeader stiki bb"></th>
              <th
                class="mainHeader"
                style="text-align: center !important; padding-top: 10px"
                v-for="head in props.headers"
                :key="head.value"
              >
                {{ head.text.toUpperCase() }}
              </th>
            </tr>
            <tr
              id="overall"
              style="
                text-align: center;
                background: #d6d6d6;
                font-weight: bold !important;
                text-align: right !important;
              "
            >
              <th
                class="absolute"
                style="
                  text-align: center !important;
                  padding-bottom: 5px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-top: 5px;
                  padding: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                Overall
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.deposit_users, false) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.deposit_number, false) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;

                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.deposit_sum) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.withdraw_users, false) }}
              </th>

              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.withdraw_number, false) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.withdraw_sum) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.diff_sum) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToMargin(overalls.diff_margin) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  font-weight: bold;
                  padding-left: 15px;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.std_start) }}
              </th>

              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  padding-bottom: 5px;
                  font-weight: bold;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.std_end) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  font-weight: bold;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                  border-left: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.promo_users, false) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  border-right: 1px solid black;
                  border-left: 1px solid black;
                  font-weight: bold;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.promo_number, false) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  border-right: 1px solid black;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.promo_sum) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.promo_cost) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-left: 15px;
                  font-weight: bold;
                  padding-bottom: 5px;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                  border-left: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.prm_start) }}
              </th>
              <th
                style="
                  text-align: right !important;
                  padding-bottom: 5px;
                  font-weight: bold;
                  padding-top: 5px;
                  border-top: 1px solid black;
                  border-bottom: 1px solid black;
                  border-left: 1px solid black;
                "
              >
                {{ convertToCurrency(overalls.prm_end) }}
              </th>
              <!-- <th
              style="
                text-align: left!important;
                padding-left: 15px;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ overalls.promo_balance_end }}
            </th> -->
            </tr>
          </div>
          <tr class="desktopOnly" style="text-align: center">
            <th class="stiki"></th>
            <th
              colspan="3"
              style="
                border-left: 1px solid black;
                border-right: 1px solid black;
                background: #f2f2f2;
                font-weight: 600;
              "
            >
              Deposit
            </th>
            <th
              colspan="3"
              style="
                background: #f2f2f2;
                border-right: 1px solid black;
                font-weight: 600;
              "
            >
              Withdraw
            </th>
            <th
              colspan="2"
              style="
                background: #f2f2f2;
                border-right: 1px solid black;
                font-weight: 600;
              "
            >
              Difference
            </th>

            <th
              colspan="2"
              style="
                border-right: 1px solid black;
                background: #f2f2f2;
                font-weight: 600;
              "
            >
              Standard Balance
            </th>
            <th
              colspan="4"
              style="
                border-right: 1px solid black;
                background: #f0efed;
                font-weight: 600;
              "
            >
              Promo Achivement
            </th>
            <th colspan="2" style="background: #f0efed; font-weight: 600">
              Promo Balance
            </th>
          </tr>
          <tr class="desktopOnly" style="text-align: center">
            <th class="mainHeader stiki bb"></th>
            <th
              class="mainHeader"
              style="text-align: center !important; padding-top: 10px"
              v-for="head in props.headers"
              :key="head.value"
            >
              {{ head.text.toUpperCase() }}
            </th>
          </tr>
          <tr
            class="desktopOnly"
            id="overall"
            style="
              text-align: center;
              background: #d6d6d6;
              font-weight: bold !important;
              text-align: right !important;
            "
          >
            <th
              class="absolute"
              style="
                text-align: center !important;
                padding-bottom: 5px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-top: 5px;
                padding: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              Overall
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.deposit_users, false) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.deposit_number, false) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;

                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.deposit_sum) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.withdraw_users, false) }}
            </th>

            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.withdraw_number, false) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.withdraw_sum) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.diff_sum) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToMargin(overalls.diff_margin) }}
            </th>
            <th
              style="
                text-align: right !important;
                font-weight: bold;
                padding-left: 15px;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.std_start) }}
            </th>

            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                padding-bottom: 5px;
                font-weight: bold;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.std_end) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                padding-bottom: 5px;
                padding-top: 5px;
                font-weight: bold;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                border-left: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.promo_users, false) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                border-right: 1px solid black;
                border-left: 1px solid black;
                font-weight: bold;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.promo_number, false) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                border-right: 1px solid black;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.promo_sum) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.promo_cost) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-left: 15px;
                font-weight: bold;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                border-left: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.prm_start) }}
            </th>
            <th
              style="
                text-align: right !important;
                padding-bottom: 5px;
                font-weight: bold;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                border-left: 1px solid black;
              "
            >
              {{ convertToCurrency(overalls.prm_end) }}
            </th>
            <!-- <th
              style="
                text-align: left!important;
                padding-left: 15px;
                padding-bottom: 5px;
                padding-top: 5px;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
              "
            >
              {{ overalls.promo_balance_end }}
            </th> -->
          </tr>
        </template>
        <template v-slot:item="{ item }">
          <tr class="desno" :key="item.datum">
            <td
              v-bind:class="{ weekend: isWeekend(item.datum), centriraj: true }"
            >
              {{ convertToDatum(item.datum) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.deposit_users, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.deposit_number, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.deposit_sum) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.withdraw_users, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.withdraw_number, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.withdraw_sum) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.diff_sum) }}
            </td>
            <td class="text-xs-right">
              {{ convertToMargin(item.diff_margin) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.std_start) }}
            </td>
            <td class="text-xs-right">{{ convertToCurrency(item.std_end) }}</td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.promo_users, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.promo_number, false) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.promo_sum) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.promo_cost) }}
            </td>
            <td class="text-xs-right">
              {{ convertToCurrency(item.prm_start) }}
            </td>
            <td class="text-xs-right">{{ convertToCurrency(item.prm_end) }}</td>
          </tr>
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
import { getMonths, getYears } from "../helpers/date.ts";
const axios = require("axios").default;
export default {
  name: "cashflow",
  data() {
    return {
      fullScreen: false,
      allClosed: true,
      stanja: [false, false, false, false, false, false, false],
      firstSearch: false,
      today: true,
      danasPodaci: {
        Datum: null,
        deposit_sum_all: 0,
        deposit_users_all: 0,
        deposit_number_all: 0,
        deposit_sum_bank: 0,
        deposit_users_bank: 0,
        deposit_number_bank: 0,
        deposit_sum_cc: 0,
        deposit_users_cc: 0,
        deposit_number_cc: 0,
        deposit_sum_ipay: 0,
        deposit_users_ipay: 0,
        deposit_number_ipay: 0,
        deposit_sum_komsija: 0,
        deposit_users_komsija: 0,
        deposit_number_komsija: 0,
        deposit_sum_shops: 0,
        deposit_users_shops: 0,
        deposit_number_shops: 0,
        withdraw_sum_all: 0,
        withdraw_users_all: 0,
        withdraw_number_all: 0,
        withdraw_sum_bank: 0,
        withdraw_users_bank: 0,
        withdraw_number_bank: 0,
        withdraw_sum_shops: 0,
        withdraw_users_shops: 0,
        withdraw_number_shops: 0,
        promo_sum: 0,
        promo_users: 0,
        promo_number: 0,
        promo_cost: 0,
        actual_std_balance: 0,
        actual_promo_balance: 0,
        actual_active_std_balance: 0,
        actual_active_promo_balance: 0,
        permanently_reserved: 0,
        temporarely_reserved: 0,
        na_per: 0,
        na_tem: 0,
        execution_time: null,
      },
      danas: true,
      searchMode: {
        month: false,
      },
      initial: true,
      meseci: [
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
      balances: [],
      cashflowData: [],
      loadTable: false,
      itemsPerPage: 1000,
      snackbar: false,
      errorText: "You can select up to 4 days",
      timeout: 3000,
      initialLoad: true,
      overalls: {
        deposit_users: null,
        deposit_number: null,
        deposit_sum: null,
        withdraw_users: null,
        withdraw_number: null,
        withdraw_sum: null,
        diff_sum: null,
        diff_margin: null,
        std_start: null,
        std_end: null,
        promo_users: null,
        promo_number: null,
        promo_sum: null,
        promo_cost: null,
        prm_start: null,
        prm_end: null,
      },
      menu: false,
      dates: [],
      modal: false,
      otherLists: {
        showYear: true,
        showMonth: true,
        showCalendar: false,
      },
      filters: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        method: 0,
        period: 3,
      },

      time: null,
      menu2: false,
      modal2: false,
      date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      menu: false,
      menu2: false,
      loadingUserData: false,
      selectedUserData: {},
      expanded: [],
      search: "",
      methods: [
        {
          id: 0,
          title: "All",
        },
        {
          id: 1,
          title: "Dobri Komšija",
        },
        {
          id: 2,
          title: "Shops",
        },
        {
          id: 3,
          title: "Credit Card",
        },
        {
          id: 4,
          title: "iPay",
        },
        {
          id: 5,
          title: "Bank Transfer",
        },
      ],
      periods: [
        // {
        //   id: 0,
        //   title: "Per Year",
        {
          id: 3,
          title: "Per Day",
        },
        // },
        {
          id: 2,
          title: "Per Month",
        },
        {
          id: 1,
          title: "Today",
        },
        // {
        //   id: 1,
        //   title: "Per Year",
        //   disabled: true,
        // },
        // {
        //   id: 2,
        //   title: "Weekend",
        // },
      ],
      months: getMonths(),
      years: getYears(),
      headers: [
        {
          text: "Users",
          align: "start",
          value: "deposit_users",
        },
        {
          text: "Number",
          value: "deposit_number",
        },
        {
          text: "Sum",
          value: "deposit_sum",
        },
        {
          text: "Users",
          value: "withdraw_users",
        },
        {
          text: "Number",
          value: "withdraw_number",
        },
        {
          text: "Sum",
          value: "withdraw_sum",
        },
        {
          text: "Sum",
          value: "difference_sum",
        },
        {
          text: "Margin",
          value: "difference_margin",
        },

        {
          text: "Start",
          value: "std_balance_start",
        },
        {
          text: "End",
          value: "std_balance_end",
        },
        {
          text: "Users",
          value: "promo_users",
        },
        {
          text: "Number",
          value: "promo_number",
        },
        {
          text: "Sum",
          value: "promo_sum",
        },
        {
          text: "Cost",
          value: "promo_cost",
        },
        {
          text: "Start",
          value: "promo_balance_start",
        },
        {
          text: "End",
          value: "promo_balance_end",
        },
      ],

      dates: ["2019-09-10", "2021-11-20"],
      allData: [],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  watch: {
    stanja: function (val) {
      this.allClosed = val.filter((x) => x == true).length == 0;
    },
  },
  methods: {
    isMobileInitial() {
      let isMobile = window.innerWidth < 668;
      return isMobile && !this.fullScreen;
    },
    goFull() {
      var elem = document.body;
      this.requestFullScreen(elem);
      this.fullScreen = true;
    },
    exitFull() {
      var elem = document.body;
      const EXIT = true;
      this.requestFullScreen(elem, EXIT);
      this.fullScreen = false;
    },
    requestFullScreen(element, exit = false) {
      // Supports most browsers and their versions.
      var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen ||
        element.webkitEnterFullScreen;

      if (requestMethod) {
        // Native full screen.
        exit ? this.exitFullScreen() : requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys(exit ? "{ESCAPE}" : "{F11}");
        }
      }
    },
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    },
    determineTableHeight() {
      let isMobile = window.innerWidth < 668;
      if ((isMobile && this.firstSearch) || this.fullScreen) {
        return window.innerHeight - 100;
      }
      if (isMobile && !this.firstSearch) {
        return "auto";
      }
      if (!isMobile) {
        return "auto";
      }
    },
    expandPanel(id) {
      for (let i = 0; i < this.stanja.length; i++) {
        this.stanja[i] = false;
      }
      this.stanja[id] = true;
    },
    goThrough(param) {
      if (param == -1) {
        this.refresh(false);
      } else {
        this.refresh(true);
      }
    },
    refresh(today = true) {
      this.today = today;
      var yesterday = false;
      if (!today) {
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toISOString().split("T")[0] + " 08:00:00";
      }
      axios
        .post("http://10.0.90.23:8000/api/CashflowToday", {
          yesterday: yesterday,
          novi: false,
        })
        .then((response) => {
          let podaci = response.data.data[0];
          podaci["execution_time"] = podaci["execution_time"]
            .slice(11)
            .slice(0, 8);
          podaci["diff_sum"] =
            parseFloat(podaci["deposit_sum_all"]) -
            parseFloat(podaci["withdraw_sum_all"]);
          podaci["diff_margin"] =
            parseFloat(podaci["diff_sum"]) /
            parseFloat(podaci["deposit_sum_all"]);
          this.danasPodaci = podaci;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    emptyOveralls() {
      Object.keys(this.overalls).forEach((key) => {
        this.overalls[key] = null;
      });
    },
    isWeekend(datum) {
      if (this.filters.period == 3) {
        let dan = new Date(datum).getDay();
        return [5, 6, 0].includes(dan);
      } else {
        return false;
      }
    },
    getDataAccoringToPaymentType(row, key) {
      /* 0 sve, 1 komsija, 2 sopovi, 3 cc, 4 ipay, 5 bank transfer */
      let val = null;
      if (key == "promo_users") {
        val = row["promo_users"];
      } else if (key == "promo_number") {
        val = row["promo_number"];
      } else if (key == "promo_sum") {
        val = row["promo_sum"];
      } else if (key == "promo_cost") {
        val = row["promo_cost"];
      }
      let FOUND_PROMO = val;
      if (!FOUND_PROMO) {
        switch (this.filters.method) {
          case 0:
            if (key == "deposit_users") {
              val = row["deposit_users_all"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_all"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_all"];
            } else if (key == "withdraw_users") {
              val = row["withdraw_users_all"];
            } else if (key == "withdraw_number") {
              val = row["withdraw_number_all"];
            } else if (key == "withdraw_sum") {
              val = row["withdraw_sum_all"];
            }
            break;
          case 1:
            if (key == "deposit_users") {
              val = row["deposit_users_komsija"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_komsija"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_komsija"];
            } else if (key == "withdraw_users") {
              val = 0;
            } else if (key == "withdraw_number") {
              val = 0;
            } else if (key == "withdraw_sum") {
              val = 0;
            }
            break;
          case 2:
            if (key == "deposit_users") {
              val = row["deposit_users_shops"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_shops"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_shops"];
            } else if (key == "withdraw_users") {
              val = row["withdraw_users_shops"];
            } else if (key == "withdraw_number") {
              val = row["withdraw_number_shops"];
            } else if (key == "withdraw_sum") {
              val = row["withdraw_sum_shops"];
            }
            break;
          case 3:
            if (key == "deposit_users") {
              val = row["deposit_users_cc"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_cc"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_cc"];
            } else if (key == "withdraw_users") {
              val = 0;
            } else if (key == "withdraw_number") {
              val = 0;
            } else if (key == "withdraw_sum") {
              val = 0;
            }
            break;
          case 4:
            if (key == "deposit_users") {
              val = row["deposit_users_ipay"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_ipay"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_ipay"];
            } else if (key == "withdraw_users") {
              val = 0;
            } else if (key == "withdraw_number") {
              val = 0;
            } else if (key == "withdraw_sum") {
              val = 0;
            }
            break;
          case 5:
            if (key == "deposit_users") {
              val = row["deposit_users_bank"];
            } else if (key == "deposit_number") {
              val = row["deposit_number_bank"];
            } else if (key == "deposit_sum") {
              val = row["deposit_sum_bank"];
            } else if (key == "withdraw_users") {
              val = row["withdraw_users_bank"];
            } else if (key == "withdraw_number") {
              val = row["withdraw_number_bank"];
            } else if (key == "withdraw_sum") {
              val = row["withdraw_sum_bank"];
            }
            break;
          default:
            break;
        }
      }

      return val;
    },
    formatV2Data(data) {
      let mainData = data["data"];
      let keys = Object.keys(mainData[0]);
      mainData.forEach((row) => {
        keys.forEach((key) => {
          if (row[key] == "NULL") {
            row[key] = 0;
          }
        });
      });

      let transformedData = [];
      let transformedObj = {};
      for (let i = 0; i < mainData.length; i++) {
        transformedObj["datum"] = mainData[i]["datum"];
        transformedObj["deposit_users"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "deposit_users"
        );
        transformedObj["deposit_number"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "deposit_number"
        );
        transformedObj["deposit_sum"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "deposit_sum"
        );
        transformedObj["withdraw_users"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "withdraw_users"
        );
        transformedObj["withdraw_number"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "withdraw_number"
        );
        transformedObj["withdraw_sum"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "withdraw_sum"
        );
        transformedObj["promo_users"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "promo_users"
        );
        transformedObj["promo_number"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "promo_number"
        );
        transformedObj["promo_sum"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "promo_sum"
        );
        transformedObj["promo_cost"] = this.getDataAccoringToPaymentType(
          mainData[i],
          "promo_cost"
        );
        transformedObj["diff_sum"] =
          parseFloat(transformedObj["deposit_sum"]) -
          parseFloat(transformedObj["withdraw_sum"]);
        transformedObj["diff_margin"] =
          transformedObj["diff_sum"] /
          parseFloat(transformedObj["deposit_sum"]);
        transformedData.push(transformedObj);
        transformedObj = {};
      }

      this.setV2MonthData(mainData);

      this.balances = data["balances"];
      if (this.balances.length == 0) {
        for (let i = 0; i < data.length; i++) {
          mainData[i]["std_start"] = 0;
          mainData[i]["prm_start"] = 0;
          mainData[i]["std_end"] = 0;
          mainData[i]["prm_end"] = 0;
        }
        this.overalls.std_start = 0;
        this.overalls.std_end = 0;
        this.overalls.prm_start = 0;
        this.overalls.prm_end = 0;
      } else {
        for (let i = 0; i < transformedData.length; i++) {
          for (let j = 0; j < this.balances.length; j++) {
            if (
              transformedData[i]["datum"] == this.balances[j]["balance_date"]
            ) {
              transformedData[i]["std_start"] = this.balances[j]["std"];
              transformedData[i]["prm_start"] = this.balances[j]["prm"];
              transformedData[i]["std_end"] = this.balances[j + 1] ? this.balances[j+1]["std"] : "/";
              transformedData[i]["prm_end"] = this.balances[j + 1] ? this.balances[j+1]["prm"] : "/";
            }
          }
        }

        this.overalls.std_start = this.balances[0]["std"];
        this.overalls.std_end = this.balances[this.balances.length - 1]["std"];

        this.overalls.prm_start = this.balances[0]["prm"];
        this.overalls.prm_end = this.balances[this.balances.length - 1]["prm"];
      }

      return transformedData;
    },
    setV2MonthData(data) {
      let relevant = data[data.length - 1];
      this.overalls.promo_users = relevant["promo_users_month"]
        ? relevant["promo_users_month"]
        : 0;
      this.overalls.promo_number = data.reduce(
        (a, b) => parseFloat(a) + parseFloat(b["promo_number"]),
        0
      );
      this.overalls.promo_sum = data.reduce(
        (a, b) => parseFloat(a) + parseFloat(b["promo_sum"]),
        0
      );
      this.overalls.promo_cost = data.reduce(
        (a, b) => parseFloat(a) + parseFloat(b["promo_cost"]),
        0
      );
      switch (this.filters.method) {
        case 0:
          this.overalls.deposit_users = relevant["deposit_users_all_month"];
          this.overalls.withdraw_users = relevant["withdraw_users_all_month"];
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_all"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_all"]),
            0
          );
          this.overalls.withdraw_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_number_all"]),
            0
          );
          this.overalls.withdraw_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_sum_all"]),
            0
          );
          break;
        case 1:
          this.overalls.deposit_users = relevant["deposit_users_komsija_month"];
          this.overalls.withdraw_users = 0;
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_komsija"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_komsija"]),
            0
          );
          this.overalls.withdraw_number = 0;
          this.overalls.withdraw_sum = 0;
          break;
        case 2:
          this.overalls.deposit_users = relevant["deposit_users_shops_month"];
          this.overalls.withdraw_users = relevant["withdraw_users_shops_month"];
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_shops"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_shops"]),
            0
          );
          this.overalls.withdraw_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_number_shops"]),
            0
          );
          this.overalls.withdraw_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_sum_shops"]),
            0
          );

          break;
        case 3:
          this.overalls.deposit_users = relevant["deposit_users_cc_month"];
          this.overalls.withdraw_users = 0;
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_cc"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_cc"]),
            0
          );
          this.overalls.withdraw_number = 0;
          this.overalls.withdraw_sum = 0;
          break;
        case 4:
          this.overalls.deposit_users = relevant["deposit_users_ipay_month"];
          this.overalls.withdraw_users = 0;
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_ipay"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_ipay"]),
            0
          );
          this.overalls.withdraw_number = 0;
          this.overalls.withdraw_sum = 0;
          break;
        case 5:
          this.overalls.deposit_users = relevant["deposit_users_bank_month"];
          this.overalls.withdraw_users = relevant["withdraw_users_bank_month"];
          this.overalls.deposit_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_number_bank"]),
            0
          );
          this.overalls.deposit_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["deposit_sum_bank"]),
            0
          );
          this.overalls.withdraw_number = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_number_bank"]),
            0
          );
          this.overalls.withdraw_sum = data.reduce(
            (a, b) => parseFloat(a) + parseFloat(b["withdraw_sum_bank"]),
            0
          );
          break;
        default:
          break;
      }
      this.overalls.diff_sum = parseFloat(
        this.overalls.deposit_sum - this.overalls.withdraw_sum
      );
      this.overalls.diff_margin = parseFloat(
        this.overalls.diff_sum / this.overalls.deposit_sum
      );
    },
    formatData(data) {
      let mainData = data["mainData"];
      let promoData = data["promoData"];
      let foundPromo = false;
      if (this.filters.period == 3) {
        for (let i = 0; i < mainData.length; i++) {
          for (let j = 0; j < promoData.length; j++) {
            if (mainData[i]["datum"] == promoData[j]["datum"]) {
              foundPromo = true;
              mainData[i]["promo_sum"] = promoData[j]["promo_sum"]
                ? promoData[j]["promo_sum"]
                : 0;
              mainData[i]["promo_users"] = promoData[j]["promo_users"]
                ? promoData[j]["promo_users"]
                : 0;
              mainData[i]["promo_number"] = promoData[j]["promo_number"]
                ? promoData[j]["promo_number"]
                : 0;
              mainData[i]['promo_cost'] = mainData[i]["promo_cost"] === 'None' ? 0 : mainData[i]['promo_cost']
              mainData[i]["promo_cost"] = promoData[j]["promo_cost"]
                ? promoData[j]["promo_cost"]
                : 0;
            }
          }
          if (!foundPromo) {
            mainData[i]["promo_sum"] = 0;
            mainData[i]["promo_users"] = 0;
            mainData[i]["promo_number"] = 0;
            mainData[i]["promo_cost"] = 0;
          } else {
            foundPromo = false;
          }
        }

        let usersData = data["mainDataMonthly"];
        this.overalls.deposit_users = usersData["deposit_users"];
        this.overalls.withdraw_users = usersData["withdraw_users"];
        this.overalls.promo_users =
          data["promoMonthlyData"].length > 0
            ? data["promoMonthlyData"][0]["promo_users"]
            : 0;
        this.balances = data["balances"];
        if (this.balances.length == 0) {
          for (let i = 0; i < data.length; i++) {
            mainData[i]["std_start"] = 0;
            mainData[i]["prm_start"] = 0;
            mainData[i]["std_end"] = 0;
            mainData[i]["prm_end"] = 0;
          }
          this.overalls.std_start = 0;
          this.overalls.std_end = 0;
          this.overalls.prm_start = 0;
          this.overalls.prm_end = 0;
        } else {
          for (let i = 0; i < mainData.length; i++) {
            for (let j = 0; j < this.balances.length; j++) {
              if (mainData[i]["datum"] == this.balances[j]["balance_date"]) {
                mainData[i]["std_start"] = this.balances[j]["std"];
                mainData[i]["prm_start"] = this.balances[j]["prm"];
                mainData[i]["std_end"] = this.balances[j + 1]["std"];
                mainData[i]["prm_end"] = this.balances[j + 1]["prm"];
              }
            }
          }

          this.overalls.std_start = this.balances[0]["std"];
          this.overalls.std_end =
            this.balances[this.balances.length - 1]["std"];

          this.overalls.prm_start = this.balances[0]["prm"];
          this.overalls.prm_end =
            this.balances[this.balances.length - 1]["prm"];
        }
      }

      if (this.filters.period == 2) {
        for (let i = 0; i < mainData.length; i++) {
          for (let j = 0; j < promoData.length; j++) {
            if (mainData[i]["datum"] == promoData[j]["datum"]) {
              foundPromo = true;
              mainData[i]["promo_sum"] = promoData[j]["promo_sum"]
                ? promoData[j]["promo_sum"]
                : 0;
              mainData[i]["promo_users"] = promoData[j]["promo_users"]
                ? promoData[j]["promo_users"]
                : 0;
              mainData[i]["promo_number"] = promoData[j]["promo_number"]
                ? promoData[j]["promo_number"]
                : 0;
              mainData[i]["promo_cost"] = promoData[j]["promo_cost"]
                ? promoData[j]["promo_cost"]
                : 0;
            }
          }
          if (!foundPromo) {
            mainData[i]["promo_sum"] = 0;
            mainData[i]["promo_users"] = 0;
            mainData[i]["promo_number"] = 0;
            mainData[i]["promo_cost"] = 0;
          } else {
            foundPromo = false;
          }
        }
        let usersData = data["mainDataYearly"][0];
        this.overalls.deposit_users = usersData["deposit_users"];
        this.overalls.withdraw_users = usersData["withdraw_users"];
        this.overalls.promo_users = data["promoYearlyData"];
        this.balances = data["balances"];
        if (this.balances.length == 0) {
          for (let i = 0; i < mainData.length; i++) {
            mainData[i]["std_start"] = 0;
            mainData[i]["prm_start"] = 0;
            mainData[i]["std_end"] = 0;
            mainData[i]["prm_end"] = 0;
          }
          this.overalls.std_start = 0;
          this.overalls.std_end = 0;
          this.overalls.prm_start = 0;
          this.overalls.prm_end = 0;
        } else {
          for (let i = 0; i < mainData.length; i++) {
            if (
              this.filters.year >= 2019 ||
              (this.filters.year == 2018 && mainData[i]["datum"] > 8)
            ) {
              switch (parseInt(mainData[i]["datum"])) {
                case 1:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-01-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-01-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-02-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-02-01"
                  )[0]["prm"];
                  break;
                case 2:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-02-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-02-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-03-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-03-01"
                  )[0]["prm"];
                  break;
                case 3:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-03-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-03-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-04-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-04-01"
                  )[0]["prm"];
                  break;
                case 4:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-04-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-04-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-05-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-05-01"
                  )[0]["prm"];
                  break;
                case 5:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-05-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-05-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-06-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-06-01"
                  )[0]["prm"];
                  break;
                case 6:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-06-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-06-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-07-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-07-01"
                  )[0]["prm"];
                  break;
                case 7:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-07-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-07-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-08-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-08-01"
                  )[0]["prm"];
                  break;
                case 8:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-08-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-08-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-09-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-09-01"
                  )[0]["prm"];
                  break;
                case 9:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-09-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-09-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-10-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-10-01"
                  )[0]["prm"];
                  break;
                case 10:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-10-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-10-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-11-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-11-01"
                  )[0]["prm"];
                  break;
                case 11:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-11-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-11-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-12-01"
                  )[0]["std"];
                  mainData[i]["prm_end"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-12-01"
                  )[0]["prm"];
                  break;
                case 12:
                  mainData[i]["std_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-12-01"
                  )[0]["std"];
                  mainData[i]["prm_start"] = this.balances.filter(
                    (x) => x.balance_date == this.filters.year + "-12-01"
                  )[0]["prm"];
                  mainData[i]["std_end"] =
                    this.balances.filter(
                      (x) => x.balance_date == this.filters.year + 1 + "-01-01"
                    ).length > 0
                      ? this.balances.filter(
                          (x) =>
                            x.balance_date == this.filters.year + 1 + "-01-01"
                        )[0]["std"]
                      : "/";
                  mainData[i]["prm_end"] =
                    this.balances.filter(
                      (x) => x.balance_date == this.filters.year + 1 + "-01-01"
                    ).length > 0
                      ? this.balances.filter(
                          (x) =>
                            x.balance_date == this.filters.year + 1 + "-01-01"
                        )[0]["prm"]
                      : "/";
                  break;
                default:
                  break;
              }
            } else {
              mainData[i]["std_start"] = 0;
              mainData[i]["prm_start"] = 0;
              mainData[i]["std_end"] = 0;
              mainData[i]["prm_end"] = 0;
            }
          }

          this.overalls.std_start = this.balances[0]["std"];
          this.overalls.std_end =
            this.balances[this.balances.length - 1]["std"];

          this.overalls.prm_start = this.balances[0]["prm"];
          this.overalls.prm_end =
            this.balances[this.balances.length - 1]["prm"];
        }
      }

      this.overalls.deposit_number = mainData.reduce(
        (a, b) => a + b["deposit_number"],
        0
      );
      this.overalls.deposit_sum = mainData.reduce(
        (a, b) => a + b["deposit_sum"],
        0
      );
      this.overalls.withdraw_number = mainData.reduce(
        (a, b) => a + b["withdraw_number"],
        0
      );
      this.overalls.withdraw_sum = mainData.reduce(
        (a, b) => a + b["withdraw_sum"],
        0
      );
      this.overalls.promo_number = mainData.reduce(
        (a, b) => a + b["promo_number"],
        0
      );
      this.overalls.promo_sum = mainData.reduce(
        (a, b) => a + b["promo_sum"],
        0
      );
      this.overalls.promo_cost = mainData.reduce(
        (a, b) => a + b["promo_cost"],
        0
      );
      this.overalls.diff_sum = mainData.reduce((a, b) => a + b["diff_sum"], 0);
      this.overalls.diff_margin =
        this.overalls.diff_sum / this.overalls.deposit_sum;
      return mainData;
    },
    onDateSelected: function (daterange) {
      this.selectedDate = daterange;
    },
    filterByPeriod(criteria) {
      if(criteria==2){
        this.years = this.years.filter(x=>x.id!=2022)
        this.filters.year = 2021
      } else {
        this.years = getYears();
      }
      if (criteria == 1) {
        this.danas = true;
        axios
          .post("http://10.0.90.23:8000/api/CashflowToday", {
            yesterday: false,
            novi: false,
          })
          .then((response) => {
            let podaci = response.data.data[0];
            podaci["execution_time"] = podaci["execution_time"]
              .slice(11)
              .slice(0, 8);
            podaci["diff_sum"] =
              parseFloat(podaci["deposit_sum_all"]) -
              parseFloat(podaci["withdraw_sum_all"]);
            podaci["diff_margin"] =
              parseFloat(podaci["diff_sum"]) /
              parseFloat(podaci["deposit_sum_all"]);
            this.danasPodaci = podaci;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // this.dates = [];
      this.showOtherLists(criteria);
      this.filters.period = criteria;
    },
    filterByMethod(criteria) {
      this.filters.method = criteria;
    },
    filterByMonth(criteria) {
      this.filters.month = criteria;
      
    },
    filterByYear(criteria) {
      this.periods.filter((x) => x.id == 2)[0]["disabled"] = criteria == 2022;
      this.filters.year = criteria;
      let actualYear = new Date().getFullYear();
      if (criteria == actualYear) {
        let actualMonth = new Date().getMonth() + 1;
        this.months = this.months.filter((x) => x.id <= actualMonth);
        this.filters.month = this.months[actualMonth-1].id;
      } else {
        this.months = getMonths();
      }
    },
    showOtherLists(period) {
      switch (period) {
        case 3:
          this.otherLists.showYear = true;
          this.otherLists.showMonth = true;
          this.otherLists.showCalendar = false;
          break;
        case 0:
          this.otherLists.showYear = true;
          this.otherLists.showMonth = false;
          this.otherLists.showCalendar = false;
          break;
        case 1:
          this.otherLists.showYear = true;
          this.otherLists.showMonth = false;
          this.otherLists.showCalendar = false;
          break;
        case 2:
          this.otherLists.showYear = true;
          this.otherLists.showMonth = false;
          this.otherLists.showCalendar = false;
          break;
        default:
          this.otherLists.showYear = false;
          this.otherLists.showMonth = false;
          this.otherLists.showCalendar = false;
          break;
      }
    },
    searchData() {
      this.addFebruary();

      this.firstSearch = true;
      this.danas = this.filters.period == 1;
      if (!this.danas) {
        if (this.filters.period == 2) {
          this.searchMode.month = true;
        } else {
          this.searchMode.month = false;
        }
        this.emptyOveralls();
        this.cashflowData = [];
        let from;
        let to;
        let balanceOd = null;
        let balanceDo = null;
        if (this.filters.period == 3) {
          from =
            this.filters.year +
            this.months.filter((x) => x.id == this.filters.month)[0]["from"];
          to =
            this.filters.year +
            this.months.filter((x) => x.id == this.filters.month)[0]["to"];
          balanceOd = from;
          let casted_to = new Date(to);
          casted_to.setDate(casted_to.getDate() + 1);
          balanceDo = casted_to.toISOString().split("T")[0];
        }
        if (this.filters.period == 2) {
          from = this.years.filter((x) => x.id == this.filters.year)[0]["from"];
          to = this.years.filter((x) => x.id == this.filters.year)[0]["to"];
          balanceOd = from;
          let casted_to = new Date(to);
          casted_to.setDate(casted_to.getDate() + 1);
          balanceDo = casted_to.toISOString().split("T")[0];
        }

        this.loadTable = true;
        axios
          .post("http://10.0.90.23:8000/api/Cashflow", {
            period: this.filters.period,
            month: this.filters.month,
            year: this.filters.year,
            method: this.filters.method,
            novi: this.filters.year == 2022 ? true : false,
            from,
            to,
            balanceOd,
            balanceDo,
          })
          .then((response) => {
            if (this.isEmptyResponse(response.data.data)) {
              this.cashflowData = [];
            } else {
              if (this.filters.year == 2022) {
                this.cashflowData = this.formatV2Data(response.data.data);
              } else {
                this.cashflowData = this.formatData(response.data.data);
              }
            }
            this.loadTable = false;
            this.initial = false;
            this.goFull();
            this.determineTableHeight(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post("http://10.0.90.23:8000/api/CashflowToday", {})
          .then((response) => {
            let podaci = response.data.data[0];
            podaci["execution_time"] = podaci["execution_time"]
              .slice(11)
              .slice(0, 8);
            podaci["diff_sum"] =
              parseFloat(podaci["deposit_sum_all"]) -
              parseFloat(podaci["withdraw_sum_all"]);
            podaci["diff_margin"] =
              parseFloat(podaci["diff_sum"]) /
              parseFloat(podaci["deposit_sum_all"]);
            this.danasPodaci = podaci;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    addFebruary() {
      if (this.months.filter((x) => x.id == 2).length > 0) {
        if (this.months.filter((x) => x.id == 2)[0].to.endsWith("-")) {
          this.months.filter((x) => x.id == 2)[0].to =
            this.months.filter((x) => x.id == 2)[0].to + this.getLastDayOfFeb();
        }
      }
    },
    getLastDayOfFeb() {
      var d = new Date(this.filters.year, 2, 0);
      return d.getDate();
    },
    isEmptyResponse(response) {
      if (!response) {
        this.emptyOveralls();
        return true;
      }
      if (this.filters.year == 2022) {
        if (response.data.length == 0 || response.balances.length == 0) {
          this.emptyOveralls();
          return true;
        }
      } else {
        if (this.filters.period == 2) {
          if (response.mainData.length == 0) {
            this.emptyOveralls();
            return true;
          }
        }
        if (this.filters.period == 3) {
          if (response.mainData.length == 0) {
            this.emptyOveralls();
            return true;
          }
        }
      }
    },
    convertToDatum(datum) {
      this.searchMode.month ? false : (datum = datum + "T00:00:00");
      var mesec =
        this.meseci[
          this.searchMode.month ? datum - 1 : new Date(datum).getMonth()
        ];
      var dan = new Date(datum).getDate();
      return this.searchMode.month ? mesec : dan + ". " + mesec;
    },
    convertToMargin(value) {
      if (!value) return 0;
      return (value * 100).toFixed(2) + "%";
    },
    convertToCurrency(value, zeros = true, test = false) {
      if(value==="None") return 0;
      if (!value) return 0;
      if (value == "/") {
        return value;
      }
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      if (zeros) {
        return formatter.format(value).replace("$", "");
      } else {
        return formatter
          .format(value)
          .replace("$", "")
          .substring(0, formatter.format(value).replace("$", "").length - 3);
      }
    },
  },
  created() {
    let actualMonth = new Date().getMonth() + 1;
    this.months = this.months.filter((x) => x.id <= actualMonth);
    this.filters.month = this.months[actualMonth-1].id;
    this.danas = true;
    axios
      .post("http://10.0.90.23:8000/api/CashflowToday", {
        yesterday: false,
        novi: false,
      })
      .then((response) => {
        let podaci = response.data.data[0];
        podaci["execution_time"] = podaci["execution_time"]
          .slice(11)
          .slice(0, 8);
        podaci["diff_sum"] =
          parseFloat(podaci["deposit_sum_all"]) -
          parseFloat(podaci["withdraw_sum_all"]);
        podaci["diff_margin"] =
          parseFloat(podaci["diff_sum"]) /
          parseFloat(podaci["deposit_sum_all"]);
        this.danasPodaci = podaci;
      })
      .catch((error) => {
        console.log(error);
      });
    // for (let i = 0; i < this.months; i++) {
    //   if (i < 9) {
    //     this.months[i]["disabled"] = true;
    //   }
    // }
  },
};
</script>
<style scoped>
.mt30 {
  margin-top: 30px !important;
}
.mt15 {
  margin-top: 15px !important;
}
.btn-group-vertical {
  margin-top: -114px !important;
}
#report2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}

#report2::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

#report2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #fff;
  background-image: -webkit-gradient(
    linear,
    40% 0%,
    75% 84%,
    from(#4d9c41),
    to(#19911d),
    color-stop(0.6, #54de5d)
  );
}

table > * {
  font-size: 14px;
}
.bb {
  border-bottom: 4px solid rgba(0, 0, 0, 0.52);
}
.crvena {
  color: red;
}
#quick {
  width: 100% !important;
  margin: 0 auto;
  font-size: 15px !important;
  text-align: center;
  color: white;
  margin-bottom: 15px;
}
#quick td {
  padding: 7px;
}
.quick_title {
  text-align: left;
}
.quick_value {
  text-align: right;
  font-weight: bold;
}

.card-header {
  margin-left: 10px !important;
  margin-right: 10px !important;
}
.sakriven {
  display: none;
}
.lh {
  line-height: 20px !important;
}
.w0 {
  width: 0% !important;
}
.udeo {
  font-size: 13px !important;
  font-style: italic !important;
}
.refreshBtn {
  color: white !important;
  background: #3a6957;
  border-radius: 20px;
  font-size: 16px !important;
  padding: 8px !important;
  margin-right: 25px;
  margin-left: 25px;
}
h5 {
  font-size: 13px;
  font-weight: 400;
}
article {
  width: 100% !important;
  padding: 0px;
}

.mainData .card:nth-child(1) {
  border: none !important;
}
#report2 {
  font-family: Arial, Helvetica, sans-serif !important;
  /* margin-top: 22px; */
}
.desno {
  text-align: right !important;
}

.centriraj {
  text-align: center !important;
}

#report2 .mainHeader:nth-child(2),
#report2 .mainHeader:nth-child(3),
#report2 .mainHeader:nth-child(4),
#report2 .mainHeader:nth-child(5),
#report2 .mainHeader:nth-child(6),
#report2 .mainHeader:nth-child(7),
#report2 .mainHeader:nth-child(8),
#report2 .mainHeader:nth-child(9),
#report2 .mainHeader:nth-child(10),
#report2 .mainHeader:nth-child(11) {
  background: #ffffff;
  border-bottom: 4px solid #63af6c;
  padding-top: -1px !important;
  /* border-top:1px solid #519259; */
}
#report2 .mainHeader:nth-child(17),
#report2 .mainHeader:nth-child(14),
#report2 .mainHeader:nth-child(15),
#report2 .mainHeader:nth-child(12),
#report2 .mainHeader:nth-child(13),
#report2 .mainHeader:nth-child(16) {
  background: #fff;
  border-bottom: 4px solid #f0bb62;
  /* border-top:1px solid #F0BB62; */
}

.mainHeader {
  text-align: center !important;
  font-size: 13px;
}
article:last-child {
  height: 90px !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0px !important;
  padding-right: 5px !important;
}
.today {
  display: flex !important;
  justify-content: space-between;
  margin: 0px auto;
  flex-wrap: wrap;
  width: 100%;
}
.report3 tbody td {
  color: black !important;
  font-size: 17px;
  text-align: center;
}
.report3 thead th {
  text-align: center;
}
.report3 {
  background-color: rgb(240, 240, 240);
  font-size: 15px;
  line-height: 40px;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
}

.report3 .card-title {
  margin-bottom: -1px;
  padding-bottom: 0px;
}
.col-md-3 {
  padding: 1px;
  flex: 0 0 22%;
  max-width: 26%;
}

.row {
  flex: 0 0 auto;
}

.card {
  padding-bottom: 0px !important;
  margin-bottom: 4px !important;
}

.report3 {
  border: none !important;
}

.btn-primary,
.btn-primary:hover,
.btn-primary:focus,
.btn-primary::after {
  background: #3a6957 !important;
  border: none;
  outline: none !important;
  box-shadow: none !important;
  width: 100%;
  margin: 0px auto !important;
  align-items: center;
  color: white;
  text-transform: uppercase;
}
.report3 .card-body {
  padding: 0px !important;
  margin: 5px !important;
}
#balanceToggle.table thead tr th {
  line-height: 20px !important;
  width: 85px;
}
.table thead tr th {
  width: 100px;
}
.desktop #balanceToggle tbody tr td:nth-child(3),
#balanceToggle tbody tr td:nth-child(5) {
  color: rgb(221, 20, 20) !important;
}
.mainTable {
  /* margin-top: 30px !important; */
}
.fixHeader {
  display: none;
}

@media only screen and (max-width: 668px) {
  #report2 {
    margin-top: auto !important;
  }
  #report2 /deep/ table {
    border-collapse: separate !important;
  }
  #depositToggle tbody tr:not(:first-child) {
    height: 50px !important;
  }
  #withdrawToggle tbody tr:not(:first-child) {
    height: 60px !important;
  }
  .report3 .card-title {
    margin-bottom: -2px;
    padding-bottom: 0px;
    margin-left: -15px;
    margin-right: -15px;
    margin-top: -15px;
  }
  .card {
    border-radius: 0px !important;
    margin-bottom: 10px !important;
  }
  .mainTable {
    /* margin-top: 30px !important; */
  }
  /* .btn.btn-primary.not-collapsed{
        display: none;
      } */
  .table > thead > tr > th {
    color: black !important;
  }

  #promoToggle {
    width: 90% !important;
  }
  /* #collapse-promo .table tr th:nth-child(1),
  #collapse-promo .table tr th:nth-child(2) {
    width: 100% !important;
    word-wrap: break-word;
  } */

  .centriraj {
    position: sticky !important;
    left: 0;
    z-index: 1;
    background: white;
    border-right: 1px solid rgba(43, 0, 0, 0.12);
  }
  #report2 td,
  #report2 th {
    margin: 0;
    white-space: nowrap;
    margin-top: 0px;
  }
  #report2 {
    width: 100%;
    overflow-x: scroll;
    overflow-y: visible;
  }

  .mainTable {
    position: relative;
  }
  .desktopOnly {
    display: none;
  }
  .fixHeader {
    display: table-row-group;
    position: sticky;
    top: 0px;
    overflow: auto !important;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    background: white;
    z-index: 999;
  }
  .v-data-table__wrapper {
    overflow: unset;
  }
  .absolute {
    /* width:50px;
     left: 20; */
    position: sticky;
    left: 0;
    background: #474747 !important;
    color: white !important;
    /* border-right: 3px solid rgba(0,0,0,.12)!important; */
    margin-left: 0px !important;
    width: 54px !important;
    z-index: 10;
  }
  .stiki {
    position: sticky;
    left: 0;
    background: white !important;
    z-index: 10;
    border-right: 2px solid rgba(0, 0, 0, 0.42);
  }
  /* .mainTable table{
  height: 800px!important;
} */
  .card {
    border: none;
    margin-top: 5px;
  }
  .report3 tbody td {
    color: black !important;
    font-size: 15px;
    text-align: center;
    padding: 0px !important;
  }
  .report3 thead tr td {
    display: inline-block;
  }
  .report3.col-md-6.desktop {
    display: none !important;
  }
  .report3.col-md-6.phone tbody {
    border: none;
  }
  .report3.col-md-6.phone thead tr th {
    padding-bottom: 0px !important;
  }
  #balanceToggle tbody tr .red {
    color: rgb(221, 20, 20) !important;
  }
  .row + .row {
    margin-top: 0px !important;
  }
  .table thead tr th {
    font-style: italic !important;
  }
  .report3.card.col-md-6.phone #promoToggle tr th {
    /* margin-left:-10px!important;
    margin:0px auto; */
    width: 60%;
  }
  .report3 tbody tr td:nth-of-type(1) {
    padding-left: 0px !important;
  }
  .report3 tbody tr td:nth-of-type(2) {
    padding-left: 0px !important;
  }
  #depositToggle tbody tr:nth-of-type(1) {
    background: #f1f3f3;
  }
  #withdrawToggle tbody tr:nth-of-type(1) {
    background: #f1f3f3;
  }
  #overall > * {
    font-size: 11px !important;
  }
  .desno > * {
    font-size: 12px !important;
  }
  .mainHeader {
    font-size: 11px !important;
    padding-right: 22px !important;
    padding-left: 29px;
  }

  #report2 .mainHeader:nth-child(7) {
    border-right: 1px solid black;
  }
  #report2 .mainHeader:nth-child(12),
  #report2 .mainHeader:nth-child(10) {
    border-left: 1px solid black;
  }
  #report2 .mainHeader:nth-child(2) {
    border-left: 1px solid black;
  }
  #report2 .mainHeader:nth-child(4),
  #report2 .mainHeader:nth-child(15) {
    border-right: 1px solid black;
  }
  #report2 table td + td {
    border-left: 1px solid black;
  }
  #report2 table {
    border-bottom: 1px solid black;
  }
  #report2 .mainHeader:nth-child(2),
  #report2 .mainHeader:nth-child(3),
  #report2 .mainHeader:nth-child(4),
  #report2 .mainHeader:nth-child(5),
  #report2 .mainHeader:nth-child(6),
  #report2 .mainHeader:nth-child(7),
  #report2 .mainHeader:nth-child(8),
  #report2 .mainHeader:nth-child(9),
  #report2 .mainHeader:nth-child(10),
  #report2 .mainHeader:nth-child(11) {
    background: #ffffff;
    border-bottom: 4px solid #63af6c;
    padding-top: -1px !important;
    /* border-top:1px solid #519259; */
  }
  #report2 .mainHeader:nth-child(17),
  #report2 .mainHeader:nth-child(14),
  #report2 .mainHeader:nth-child(15),
  #report2 .mainHeader:nth-child(12),
  #report2 .mainHeader:nth-child(13),
  #report2 .mainHeader:nth-child(16) {
    background: #fff;
    border-bottom: 4px solid #f0bb62;
    /* border-top:1px solid #F0BB62; */
  }

  #report2 tbody tr td {
    padding: 13px 5px !important;
    border-left: thin solid rgba(0, 0, 0, 0.12);
  }
  #report2 table tr th {
    font-size: 12 !important;
  }
  .desno > *:first-of-type {
    border-right: 2px solid #cfcfcf;
    width: 53px !important;
  }
  .weekend {
    /* background: rgb(204, 204, 204); */
    border-right: 2px solid #61c958 !important;
    /* background: linear-gradient(75deg, rgb(241, 241, 241), rgb(194, 245, 220)90%); */
    padding-left: 5px !important;
  }
}

@media screen and (min-width: 768px) {
  #report2 table {
    border-top: 1px solid black;
    font-size: 12px;
  }
  #report2 .mainHeader:nth-child(7) {
    border-right: 1px solid black;
  }
  #report2 .mainHeader:nth-child(12),
  #report2 .mainHeader:nth-child(10) {
    border-left: 1px solid black;
  }
  #report2 .mainHeader:nth-child(2) {
    border-left: 1px solid black;
  }
  #report2 .mainHeader:nth-child(4),
  #report2 .mainHeader:nth-child(15) {
    border-right: 1px solid black;
  }
  #report2 table td + td {
    border-left: 1px solid black;
  }
  #report2 table {
    border-bottom: 1px solid black;
  }

  .desetka {
    flex: 0 0 83.3333333333% !important;
    max-width: 83.3333333333% !important;
  }

  table th {
    font-weight: normal;
    color: rgba(0, 0, 0, 0.7) !important;
  }
  .card.report3 {
    flex: 0 0 32.3333333333%;
    width: 32%;
  }
  .card.report3.col-md-6 {
    flex: 0 0 49.3333333333%;
    width: 49%;
  }
  .report3.col-md-6.phone {
    display: none !important;
  }
}

#overall th {
  padding-right: 5px !important;
}
#overall th:first-child {
  margin: 0px;
  /* margin-top: -1px; */
  box-sizing: border-box;
  margin-top: -2px;
}

/* 	
	th {
     border: 1px solid #ccc; 
    margin-bottom:60px;
  }
.mainHeader{
    position: relative;
    top:-750px;
    left:20px;
    margin:0px;
    width:50%;
  }


  
	td { 
		border: none;
		border-bottom: 1px solid #eee; 
		position: relative;
		padding-left: 50%; 
    width:100%;
	}
	 */
</style>

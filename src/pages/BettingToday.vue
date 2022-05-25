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
    <div v-bind:class="{ sakriven: danas, 'col-md-2': !danas }" id="top">
      <div class="card">
        <span class="report-title">Betting Today Report</span>
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
                  <v-btn depressed class="btn btn-light"> Reset</v-btn>

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
        'col-md-12': danas,
        'col-md-10': !danas,
        mainTable: true,
        desetka: danas ? false : true,
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
        style="text-align: center; font-size: 20px; font-style: italic"
      >
        Sports Betting Every 3 Minutes
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
          <td class="quick_title">Users</td>
          <td class="quick_value">
            {{ convertToCurrency(danasPodaci.turnover.overall_users, false) }}
          </td>
        </tr>
        <tr>
          <td class="quick_title quick_double">Turnover/Active</td>
          <td
            class="quick_value"
            v-bind:class="{ crvena: danasPodaci.diff_sum < 0 }"
          >
            {{
              convertToCurrency(danasPodaci.turnover.overall_sum_bet, false)
            }}
            /
            {{
              convertToCurrency(
                danasPodaci.activeTurnover.overall_sum_bet,
                false
              )
            }}
          </td>
        </tr>
        <tr>
          <td class="quick_title">GGR</td>
          <td class="quick_value">
            {{ convertToCurrency(danasPodaci.grossRevenue.overall_ggr, false) }}
          </td>
        </tr>
        <tr>
          <td class="quick_title">Today GGR</td>
          <td class="quick_value">
            {{
              convertToCurrency(
                danasPodaci.grossRevenue.overall_today_ggr,
                false
              )
            }}
          </td>
        </tr>
      </table>
      <div v-if="danas" class="today row">
        <!-- turnover -->
        <div class="card report3 col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-turn
              variant="primary"
              v-on:click="expandPanel(0)"
              >Turnover</b-button
            >
            <b-collapse id="collapse-turn" v-model="stanja[0]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="turnoverToggle" class="table">
                    <thead>
                      <tr>
                        <th>Slip&nbsp;Type</th>
                        <th>Users</th>
                        <th>#Bet</th>
                        <th>∑Bet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-right" style="font-weight: bold">
                          Overall
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.overall_users,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.overall_bet_num,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.overall_sum_bet,
                              false
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Prematch</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.prematch_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.prematch_users /
                                  danasPodaci.turnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.prematch_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.prematch_bet_num /
                                  danasPodaci.turnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.prematch_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.prematch_sum_bet /
                                  danasPodaci.turnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Live</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.live_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.live_users /
                                  danasPodaci.turnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.live_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.live_bet_num /
                                  danasPodaci.turnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.live_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.live_sum_bet /
                                  danasPodaci.turnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Mix</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.mix_users,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.mix_users /
                                  danasPodaci.turnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.mix_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.mix_bet_num /
                                  danasPodaci.turnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.mix_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.mix_sum_bet /
                                  danasPodaci.turnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="text-left w0">Antepost</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.antepost_users,
                              false
                            )
                          }}<br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.antepost_users /
                                  danasPodaci.turnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.antepost_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.antepost_bet_num /
                                  danasPodaci.turnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.turnover.antepost_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.turnover.antepost_sum_bet /
                                  danasPodaci.turnover.overall_sum_bet) *
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
        <!-- active turnover -->
        <div class="card report3 col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-active
              variant="primary"
              v-on:click="expandPanel(1)"
              >Active Turnover</b-button
            >
            <b-collapse id="collapse-active" v-model="stanja[1]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="activeTurnoverToggle" class="table">
                    <thead>
                      <tr>
                        <th>Slip&nbsp;Type</th>
                        <th>Users</th>
                        <th>#Bet</th>
                        <th>∑Bet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-right" style="font-weight: bold">
                          Overall
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.overall_users,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.overall_bet_num,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.overall_sum_bet,
                              false
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Today</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.today_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.today_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.today_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.today_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.today_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.today_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="text-left w0">Yesterday</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.yesterday_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.yesterday_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.yesterday_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.yesterday_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.yesterday_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.yesterday_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr class="section-separator">
                        <td class="text-left w0">2+ days</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.twoplus_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.twoplus_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.twoplus_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.twoplus_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.twoplus_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.twoplus_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Prematch</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.prematch_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.prematch_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.prematch_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.prematch_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.prematch_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.prematch_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Live</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.live_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.live_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.live_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.live_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.live_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.live_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Mix</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.mix_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.mix_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.mix_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.mix_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.mix_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.mix_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Antepost</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.antepost_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.antepost_users /
                                  danasPodaci.activeTurnover.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.antepost_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.antepost_bet_num /
                                  danasPodaci.activeTurnover.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.activeTurnover.antepost_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.activeTurnover.antepost_sum_bet /
                                  danasPodaci.activeTurnover.overall_sum_bet) *
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

        <!-- winnings -->
        <div class="card report3 col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-win
              variant="primary"
              v-on:click="expandPanel(2)"
              >Winnings</b-button
            >
            <b-collapse id="collapse-win" v-model="stanja[2]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="winningsToggle" class="table">
                    <thead>
                      <tr>
                        <th>Slip&nbsp;Type</th>
                        <th>Users</th>
                        <th>#Win</th>
                        <th>∑Win</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-right" style="font-weight: bold">
                          Overall
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.overall_users,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.overall_bet_num,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.overall_sum_bet,
                              false
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Prematch</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.prematch_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.prematch_users /
                                  danasPodaci.winnings.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.prematch_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.prematch_bet_num /
                                  danasPodaci.winnings.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.prematch_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.prematch_sum_bet /
                                  danasPodaci.winnings.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Live</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.live_users,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.live_users /
                                  danasPodaci.winnings.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.live_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.live_bet_num /
                                  danasPodaci.winnings.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.live_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.live_sum_bet /
                                  danasPodaci.winnings.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Mix</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.mix_users,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.mix_users /
                                  danasPodaci.winnings.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.mix_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.mix_bet_num /
                                  danasPodaci.winnings.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.mix_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.mix_sum_bet /
                                  danasPodaci.winnings.overall_sum_bet) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="text-left w0">Antepost</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.antepost_users,
                              false
                            )
                          }}<br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.antepost_users /
                                  danasPodaci.winnings.overall_users) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.antepost_bet_num,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.antepost_bet_num /
                                  danasPodaci.winnings.overall_bet_num) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.winnings.antepost_sum_bet,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.winnings.antepost_sum_bet /
                                  danasPodaci.winnings.overall_sum_bet) *
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

        <div class="card report3 grossRevenue col-md-4">
          <div class="card-title row">
            <b-button
              v-b-toggle.collapse-gross
              variant="primary"
              v-on:click="expandPanel(3)"
              >Gross Revenue</b-button
            >
            <b-collapse id="collapse-gross" v-model="stanja[3]" class="mt-2">
              <b-card>
                <div class="card-body">
                  <table id="grossToggle" class="table">
                    <thead>
                      <tr>
                        <th>Slip&nbsp;Type</th>
                        <th>GGR</th>
                        <th>Mrg</th>
                        <th>Today&nbsp;GRR</th>
                        <th>Today&nbsp;Mrg</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 2px solid black">
                        <td class="text-left" style="font-weight: bold">
                          Overall
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.overall_ggr,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.overall_mrg
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.overall_today_ggr,
                              false
                            )
                          }}
                        </td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.overall_today_mrg
                            )
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Prematch</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.prematch_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.prematch_ggr /
                                  danasPodaci.grossRevenue.overall_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.prematch_mrg
                            )
                          }}<br />
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.prematch_today_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.prematch_today_ggr /
                                  danasPodaci.grossRevenue.overall_today_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.prematch_today_mrg
                            )
                          }}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Live</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.live_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.live_ggr /
                                  danasPodaci.grossRevenue.overall_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{ convertToMargin(danasPodaci.grossRevenue.live_mrg)
                          }}<br />
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.live_today_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.live_today_ggr /
                                  danasPodaci.grossRevenue.overall_today_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.live_today_mrg
                            )
                          }}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left w0">Mix</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.mix_ggr,
                              false
                            )
                          }}<br />
                          <span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.mix_ggr /
                                  danasPodaci.grossRevenue.overall_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{ convertToMargin(danasPodaci.grossRevenue.mix_mrg)
                          }}<br />
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.mix_today_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.mix_today_ggr /
                                  danasPodaci.grossRevenue.overall_today_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.mix_today_mrg
                            )
                          }}
                          <br />
                        </td>
                      </tr>

                      <tr>
                        <td class="text-left w0">Antepost</td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.antepost_ggr,
                              false
                            )
                          }}<br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.antepost_ggr /
                                  danasPodaci.grossRevenue.overall_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.antepost_mrg
                            )
                          }}
                          <br />
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToCurrency(
                              danasPodaci.grossRevenue.antepost_today_ggr,
                              false
                            )
                          }}
                          <br /><span class="udeo"
                            >({{
                              (
                                (danasPodaci.grossRevenue.antepost_today_ggr /
                                  danasPodaci.grossRevenue.overall_today_ggr) *
                                100
                              ).toFixed(2)
                            }}%)</span
                          >
                        </td>
                        <td class="text-right lh">
                          {{
                            convertToMargin(
                              danasPodaci.grossRevenue.antepost_today_mrg
                            )
                          }}
                          <br />
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
      </div>

      <v-data-table
        id="report2"
        :height="firstSearch ? '610' : 'auto'"
        v-if="!danas"
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
      <!-- <div id="nesto" style="color: white; text-align: center">
        <button>
          <a href="#top"
            ><img src="@/assets/arrow-up.png" alt="back" width="34px"
          /></a>
        </button>
      </div> -->
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
const axios = require("axios").default;
//15:26
export default {
  name: "bettingToday",
  data() {
    return {
      allClosed: true,
      stanja: [false, false, false, false, false, false, false],
      firstSearch: false,
      today: true,
      danasPodaci: {
        execution_time: "",
        turnover: {
          overall_users: 0,
          overall_bet_num: 0,
          overall_sum_bet: 0,
          prematch_users: 0,
          prematch_bet_num: 0,
          prematch_sum_bet: 0,
          live_users: 0,
          live_bet_num: 0,
          live_sum_bet: 0,
          mix_users: 0,
          mix_bet_num: 0,
          mix_sum_bet: 0,
          antepost_users: 0,
          antepost_bet_num: 0,
          antepost_sum_bet: 0,
        },
        activeTurnover: {
          overall_users: 0,
          overall_bet_num: 0,
          overall_sum_bet: 0,
          today_users: 0,
          today_bet_num: 0,
          today_sum_bet: 0,
          yesterday_users: 0,
          yesterday_bet_num: 0,
          yesterday_sum_bet: 0,
          twoplus_users: 0,
          twoplus_bet_num: 0,
          twoplus_sum_bet: 0,
          prematch_users: 0,
          prematch_bet_num: 0,
          prematch_sum_bet: 0,
          live_users: 0,
          live_bet_num: 0,
          live_sum_bet: 0,
          mix_users: 0,
          mix_bet_num: 0,
          mix_sum_bet: 0,
          antepost_users: 0,
          antepost_bet_num: 0,
          antepost_sum_bet: 0,
        },
        winnings: {
          overall_users: 0,
          overall_bet_num: 0,
          overall_sum_bet: 0,
          prematch_users: 0,
          prematch_bet_num: 0,
          prematch_sum_bet: 0,
          live_users: 0,
          live_bet_num: 0,
          live_sum_bet: 0,
          mix_users: 0,
          mix_bet_num: 0,
          mix_sum_bet: 0,
          antepost_users: 0,
          antepost_bet_num: 0,
          antepost_sum_bet: 0,
        },
        grossRevenue: {
          overall_ggr: 0,
          overall_mrg: 0,
          overall_today_ggr: 0,
          overall_today_mrg: 0,
          prematch_ggr: 0,
          prematch_mrg: 0,
          prematch_today_ggr: 0,
          prematch_today_mrg: 0,
          live_ggr: 0,
          live_mrg: 0,
          live_today_ggr: 0,
          live_today_mrg: 0,
          mix_ggr: 0,
          mix_mrg: 0,
          mix_today_ggr: 0,
          mix_today_mrg: 0,
          antepost_ggr: 0,
          antepost_mrg: 0,
          antepost_today_ggr: 0,
          antepost_today_mrg: 0,
        },
      },
      danas: false,
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
        month: 9,
        year: 2021,
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
      months: [
        // {
        //   id: 0,
        //   title: "All",
        //   from: "-01-01",
        //   to: "-12-31",
        // },
        {
          id: 1,
          from: "-01-01",
          to: "-01-31",
          title: "January",
        },
        {
          from: "-02-01",
          to: "-02-" + this.getLastDayOfMonth(1), //1 - februar
          id: 2,
          title: "February",
        },
        {
          from: "-03-01",
          to: "-03-31",
          id: 3,
          title: "March",
        },
        {
          from: "-04-01",
          to: "-04-30",
          id: 4,
          title: "April",
        },
        {
          from: "-05-01",
          to: "-05-31",
          id: 5,
          title: "May",
        },
        {
          from: "-06-01",
          to: "-06-30",
          id: 6,
          title: "June",
        },
        {
          from: "-07-01",
          to: "-07-31",
          id: 7,
          title: "July",
        },
        {
          from: "-08-01",
          to: "-08-31",
          id: 8,
          title: "August",
        },
        {
          from: "-09-01",
          to: "-09-30",
          id: 9,
          title: "September",
        },
        {
          from: "-10-01",
          to: "-10-31",
          id: 10,
          title: "October",
        },
        {
          from: "-11-01",
          to: "-11-30",
          id: 11,
          title: "November",
        },
        {
          from: "-12-01",
          to: "-12-31",
          id: 12,
          title: "December",
        },
      ],
      years: [
        {
          id: 2021,
          title: "2021",
          from: "2021-01-01",
          to: "2021-12-31",
        },
        {
          id: 2020,
          title: "2020",
          from: "2020-01-01",
          to: "2020-12-31",
        },
        {
          id: 2019,
          title: "2019",
          from: "2019-01-01",
          to: "2019-12-31",
        },
        {
          id: 2018,
          title: "2018",
          from: "2018-01-01",
          to: "2018-12-31",
        },
        {
          id: 2017,
          title: "2017",
          from: "2017-01-01",
          to: "2017-12-31",
        },
        {
          id: 2016,
          title: "2016",
          from: "2016-01-01",
          to: "2016-12-31",
        },
      ],
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
        .post("http://10.0.90.23:8000/api/BettingToday", {
          yesterday: yesterday,
        })
        .then((response) => {
          if (response.data.data.length > 0) {
            let podaci = this.mapPodaci(response.data.data[0]);
            podaci["execution_time"] = podaci["execution_time"]
              .slice(11)
              .slice(0, 8);
            this.danasPodaci = podaci;
          }
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
    getLastDayOfMonth(month) {
      //0 - januar
      var d = new Date(new Date().getFullYear(), month + 1, 0);
      return d.getDate();
    },
    onDateSelected: function (daterange) {
      this.selectedDate = daterange;
    },
    filterByPeriod(criteria) {
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
      this.filters.year = criteria;
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
            from,
            to,
            balanceOd,
            balanceDo,
          })
          .then((response) => {
            if (this.isEmptyResponse(response.data.data)) {
              this.cashflowData = [];
            } else {
              this.cashflowData = this.formatData(response.data.data);
            }
            this.loadTable = false;
            this.initial = false;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .post("http://10.0.90.23:8000/api/BettingToday", {})
          .then((response) => {
            let podaci = this.mapPodaci(response.data.data[0]);
            podaci["execution_time"] = podaci["execution_time"]
              .slice(11)
              .slice(0, 8);
            this.danasPodaci = podaci;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    isEmptyResponse(response) {
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
    },
    convertToDatum(datum) {
      var mesec = this.meseci[new Date(datum).getMonth()];
      var dan = new Date(datum).getDate();
      return this.searchMode.month ? mesec : dan + ". " + mesec;
    },
    convertToMargin(value) {
      if (!value) return 0;
      return (value * 100).toFixed(2) + "%";
    },
    convertToCurrency(value, zeros = true, test = false) {
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
    expand(item) {
      if (!item.value) {
        this.selectedUserData = {};
      } else {
        // this.getUserData(item.item.id);
      }
    },
    getUserData(id) {
      this.loadingUserData = true;
      axios
        .post("http://10.0.90.23:8000/api/UserReport3", {
          tip: 2,
          from: "'" + this.date + " 08:00:00.000'",
          to: "'" + this.date2 + " 08:00:00.000'",
          userId: "'" + id + "'",
        })
        .then((response) => {
          this.loadingUserData = false;
          let data = response.data.tiket[0];
          this.selectedUserData = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mapPodaci(data) {
      let obj = {
        execution_time: data.execution_time,
        turnover: {
          overall_users: data.turnover_overall_users,
          overall_bet_num: data.turnover_overall_num_bet,
          overall_sum_bet: data.turnover_overall_sum_bet,
          prematch_users: data.turnover_prematch_users,
          prematch_bet_num: data.turnover_prematch_num_bet,
          prematch_sum_bet: data.turnover_prematch_sum_bet,
          live_users: data.turnover_live_users,
          live_bet_num: data.turnover_live_num_bet,
          live_sum_bet: data.turnover_live_sum_bet,
          mix_users: data.turnover_mixed_users,
          mix_bet_num: data.turnover_mixed_num_bet,
          mix_sum_bet: data.turnover_mixed_sum_bet,
          antepost_users: data.turnover_outright_users,
          antepost_bet_num: data.turnover_outright_num_bet,
          antepost_sum_bet: data.turnover_outright_sum_bet,
        },
        activeTurnover: {
          overall_users: data.active_turnover_overall_users,
          overall_bet_num: data.active_turnover_overall_num_bet,
          overall_sum_bet: data.active_turnover_overall_sum_bet,
          today_users: data.active_turnover_users_today,
          today_bet_num: data.active_turnover_num_bet_today,
          today_sum_bet: data.active_turnover_sum_bet_today,
          yesterday_users: data.active_turnover_users_yesterday,
          yesterday_bet_num: data.active_turnover_num_bet_yesterday,
          yesterday_sum_bet: data.active_turnover_sum_bet_yesterday,
          twoplus_users: data.active_turnover_users_two_plus,
          twoplus_bet_num: data.active_turnover_num_bet_two_plus,
          twoplus_sum_bet: data.active_turnover_sum_bet_two_plus,
          prematch_users: data.active_turnover_users_prematch,
          prematch_bet_num: data.active_turnover_num_bet_prematch,
          prematch_sum_bet: data.active_turnover_sum_bet_prematch,
          live_users: data.active_turnover_users_live,
          live_bet_num: data.active_turnover_num_bet_live,
          live_sum_bet: data.active_turnover_sum_bet_live,
          mix_users: data.active_turnover_users_mixed,
          mix_bet_num: data.active_turnover_num_bet_mixed,
          mix_sum_bet: data.active_turnover_sum_bet_mixed,
          antepost_users: data.active_turnover_users_outright,
          antepost_bet_num: data.active_turnover_num_bet_outright,
          antepost_sum_bet: data.active_turnover_sum_bet_outright,
        },
        winnings: {
          overall_users: data.winnings_overall_users,
          overall_bet_num: data.winnings_overall_num_bet,
          overall_sum_bet: data.winnings_overall_sum_bet,
          prematch_users: data.winnings_users_prematch,
          prematch_bet_num: data.winnings_num_bet_prematch,
          prematch_sum_bet: data.winnings_sum_bet_prematch,
          live_users: data.winnings_users_live,
          live_bet_num: data.winnings_num_bet_live,
          live_sum_bet: data.winnings_sum_bet_live,
          mix_users: data.winnings_users_mixed,
          mix_bet_num: data.winnings_num_bet_mixed,
          mix_sum_bet: data.winnings_sum_bet_mixed,
          antepost_users: data.winnings_users_outright,
          antepost_bet_num: data.winnings_num_bet_outright,
          antepost_sum_bet: data.winnings_sum_bet_outright,
        },
        grossRevenue: {
          overall_ggr:
            data.turnover_overall_sum_bet - data.winnings_overall_sum_bet,
          overall_mrg:
            (data.turnover_overall_sum_bet - data.winnings_overall_sum_bet) /
            data.turnover_overall_sum_bet,
          overall_today_ggr: data.turnover_overall_sum_bet - data.today_win,
          overall_today_mrg:
            (data.turnover_overall_sum_bet - data.today_win) /
            data.turnover_overall_sum_bet,
          prematch_ggr:
            data.turnover_prematch_sum_bet - data.winnings_sum_bet_prematch,
          prematch_mrg:
            (data.turnover_prematch_sum_bet - data.winnings_sum_bet_prematch) /
            data.turnover_prematch_sum_bet,
          prematch_today_ggr:
            data.turnover_prematch_sum_bet - data.today_win_prematch,
          prematch_today_mrg:
            (data.turnover_prematch_sum_bet - data.today_win_prematch) /
            data.turnover_prematch_sum_bet,
          live_ggr: data.turnover_live_sum_bet - data.winnings_sum_bet_live,
          live_mrg:
            (data.turnover_live_sum_bet - data.winnings_sum_bet_live) /
            data.turnover_live_sum_bet,
          live_today_ggr: data.turnover_live_sum_bet - data.today_win_live,
          live_today_mrg:
            (data.turnover_live_sum_bet - data.today_win_live) /
            data.turnover_live_sum_bet,
          mix_ggr: data.turnover_mixed_sum_bet - data.winnings_sum_bet_mixed,
          mix_mrg:
            (data.turnover_mixed_sum_bet - data.winnings_sum_bet_mixed) /
            data.turnover_mixed_sum_bet,
          mix_today_ggr: data.turnover_mixed_sum_bet - data.today_win_mixed,
          mix_today_mrg:
            (data.turnover_mixed_sum_bet - data.today_win_mixed) /
            data.turnover_mixed_sum_bet,
          antepost_ggr:
            data.turnover_outright_sum_bet - data.winnings_sum_bet_outright,
          antepost_mrg:
            (data.turnover_outright_sum_bet - data.winnings_sum_bet_outright) /
            data.turnover_outright_sum_bet,
          antepost_today_ggr:
            data.turnover_outright_sum_bet - data.today_win_outright,
          antepost_today_mrg:
            (data.turnover_outright_sum_bet - data.today_win_outright) /
            data.turnover_outright_sum_bet,
        },
      };

      return obj;
    },
  },
  created() {
    this.danas = true;
    axios
      .post("http://10.0.90.23:8000/api/BettingToday", { yesterday: false })
      .then((response) => {
        let podaci = this.mapPodaci(response.data.data[0]);

        podaci["execution_time"] = podaci["execution_time"]
          .slice(11)
          .slice(0, 8);
        this.danasPodaci = podaci;
      })
      .catch((error) => {
        console.log(error);
      });
    for (let i = 0; i < this.months; i++) {
      if (i < 9) {
        this.months[i]["disabled"] = true;
      }
    }
  },
};
</script>
<style scoped>
.grossRevenue tbody td[data-v-43863926] {
  color: black !important;
  font-size: 12px !important;
  text-align: center;
  padding: 0px !important;
}
.section-separator {
  border-bottom: 2px solid black;
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
  .v-data-table tbody::-webkit-scrollbar {
    width: 40px;
    background-color: #4f4f4f;
  }

  .v-data-table tbody::-webkit-scrollbar-button:vertical:increment {
    height: 40px;
    background-image: url(/Images/Scrollbar/decrement.png);
    background-size: 39px 30px;
    background-repeat: no-repeat;
  }

  .v-data-table tbody::-webkit-scrollbar-button:vertical:decrement {
    height: 40px;
    background: #63af6c;
    background-size: 39px 30px;
    background-repeat: no-repeat;
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
    margin-top: 30px !important;
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
    overflow-y: scroll;
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
    overflow-y: hidden;

    /* width:50px;
     left: 20; */
    position: sticky;
    left: 0;
    background: #474747 !important;
    color: white !important;
    /* border-right: 3px solid rgba(0,0,0,.12)!important; */
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
  /* box-sizing: border-box; */
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

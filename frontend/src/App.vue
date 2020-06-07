<template>
  <v-app id="inspire">
    <v-app-bar app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">베트남 증권 검색기</span>
      </v-toolbar-title>
      <v-text-field justify="end" flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="종목 티커 입력" class="hidden-sm-and-down" v-model="searchItem" @keyup.enter="onClickSearch"></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-layout justify-center style="margin-top: 50px">
        <div ref="contentChart" style="width:90%; height:300px;"></div>
      </v-layout>
      <v-layout justify-end style="margin-top: 10px">
        <v-flex lg2>
          <span>(단위: 1,000,000,000 VND)</span>
        </v-flex>
      </v-layout>
      <v-layout mt-2 justify-center>
        <v-flex lg11>
          <v-data-table :single-select="true" @click:row="onClickIncomeState" dense :items-per-page="20" :hide-default-footer="true" :headers="incomeStateTableHeader" :items="incomeStateTableData" item-key="item" class="elevation-1"></v-data-table>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import echarts from "echarts";

export default {
  data: () => ({
    searchItem: "MCH",
    incomeStateTableHeader: [],
    incomeStateTableData: [],
    chart: null,
    selectedRow: null
  }),
  created() {

  },
  mounted() {
    const that = this;
    this.chart = echarts.init(this.$refs.contentChart);
    window.onresize = function() {
      that.chart.resize();
    };

    this.onClickSearch();
  },
  methods: {
    onClickSearch() {
      if (this.searchItem === "") {
        return;
      }
      this.selectedRow = null;
      this.$http.get(`/api/company?ticker=${this.searchItem}`).then(resp => {
        if (resp.data === "") {
          alert('해당 종목을 검색할 수 없습니다.\r\n티커를 확인해주세요');
          return;
        }
        let incomeStateResults = resp.data;
        this.createIncomeState(incomeStateResults);
      });
    },
    createIncomeState(incomeStateResults) {
      let rawDataArr = incomeStateResults.split("\n");
      let years = [{
        text: "항목",
        value: "item",
        sortable: false,
        filterable: false,
        align: 'start'
      }];
      let datas = [{
        item: "순 매출액"
      },
      {
        item: "매출 원가"
      },
      {
        item: "매출 총 이익"
      },
      {
        item: "금융 소득"
      },
      {
        item: "재정 비용"
      },
      {
        item: "이자 비용"
      },
      {
        item: "판매 비용"
      },
      {
        item: "일반 및 관리 비용"
      },
      {
        item: "영업 이익/손실"
      },
      {
        item: "관련 회사의 순이익"
      },
      {
        item: "기타 수입/비용"
      },
      {
        item: "순이익/세전 손실"
      },
      {
        item: "당기 법인세"
      },
      {
        item: "이연 법인세"
      },
      {
        item: "세금 후 손익"
      },
      {
        item: "소수 주주 지분"
      },
      {
        item: "모회사 이익"
      }];
      let currentYear = null;

      for (let i = 0; i < rawDataArr.length; i++) {
        if (i % 18 == 0) {
          currentYear = rawDataArr[i];
          years.push({
            text: rawDataArr[i],
            value: rawDataArr[i],
            sortable: false,
            filterable: false,
            align: 'center'
          });
        } else {
          if (rawDataArr[i] !== "-") {
            let stringBeforeRefine = rawDataArr[i].split(",");
            datas[(i % 18) - 1][currentYear] = stringBeforeRefine[0].split(".").join(",");
          } else {
            datas[(i % 18) - 1][currentYear] = "-"
          }
        }
      }

      this.incomeStateTableHeader = years;
      this.incomeStateTableData = datas;

      if (!this.selectedRow) {
        this.onClickIncomeState(datas[0]);
      }
    },
    onClickIncomeState(item) {
      this.selectedRow = item;
      // console.log(item);
      // this.chart = echarts.init(this.$refs.contentChart);
      const title = item.item;
      let xAxis = [];
      let dataset = [];
      Object.keys(item).forEach(elem => {
        if (elem !== "item") {
          xAxis.push(elem);
        }
      });
      for (let i = 0; i < xAxis.length; i++) {
        if (item[xAxis[i]] === "-") {
          dataset.push(0);
        } else {
          dataset.push(item[xAxis[i]].split(",").join(""));
        }

      }

      let chartOptions = {
        title: {
          text: title
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: xAxis
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: dataset
        }]
      };
      this.chart.setOption(chartOptions);
    }
  }
};
</script>
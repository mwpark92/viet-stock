<template>
  <v-app id="inspire">
    <v-app-bar app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">베트남 증권 검색기</span>
      </v-toolbar-title>
      <v-text-field
        justify="end"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="종목 티커 입력"
        class="hidden-sm-and-down"
        v-model="searchItem"
        @keyup.enter="onClickSearch"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">contents</v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    searchItem: ""
  }),
  methods: {
    onClickSearch() {
      if (this.searchItem === "") {
        return;
      }
      this.$http.get(`/api/company?ticker=${this.searchItem}`).then(resp => {
        console.log(resp);
      });
    }
  }
};
</script>
<template>
  <div class="text-xs-center mt-3" style="width: 100%;">
    <v-pagination v-model="page" :length="count" style="box-shadow: none;" color="#3ba776"></v-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1
    };
  },
  props: ["allAuctionsLength"],
  computed: {
    count() {
      return Math.ceil(this.allAuctionsLength / 10);
    },
    currentPage() {
      return this.$store.state.generalStore.currentPage;
    }
  },
  watch: {
    page(e) {
      this.$store.commit("generalStore/setCurrentPage", e);
      this.$emit("changePage", e * 10 - 10);
    },
    currentPage(e) {
      return (this.page = e);
    }
  }
};
</script>

<style scoped>
</style>
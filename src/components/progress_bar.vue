<template>
  <v-progress-linear
    slot="extension"
    color="#3ba776"
    class="ma-0"
    height="2"
    :indeterminate="true"
    v-if="loading"
  ></v-progress-linear>
</template>
<script>
export default {
  computed: {
    loading() {
      return this.$store.state.generalStore.loading;
    }
  }
};
</script>
<style scoped>
</style>
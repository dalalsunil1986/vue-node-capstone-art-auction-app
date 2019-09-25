<template>
  <div>
    <v-rating
      v-model="rating"
      :full-icon="fullIcon"
      :empty-icon="emptyIcon"
      color="orange"
      style="margin-left: -2px;"
      background-color="black"
      dense
      size="11"
      readonly
    ></v-rating>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fullIcon: "fiber_manual_record",
      emptyIcon: "fiber_manual_record"
    };
  },
  props: ["rating"]
};
</script>
<style scoped>
</style>
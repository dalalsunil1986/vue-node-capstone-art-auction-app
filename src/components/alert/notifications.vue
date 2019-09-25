<template>
  <v-alert
    @input="onClose"
    :value="true"
    dismissible
    :color="color"
    class="mb-3 p-2 pl-3"
    style="border-radius: 3px"
  >{{ text }}</v-alert>
</template>
<script>
export default {
  methods: {
    onClose() {
      this.$store.dispatch("alert/clear");
      this.$emit("dismissed");
    }
  },
  computed: {
    text() {
      return this.$store.state.alert.message;
    },
    color() {
      return this.$store.state.alert.type;
    }
  }
};
</script>

<style scoped>
</style>
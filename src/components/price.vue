<template>
  <span style="font-size: 18px; position: absolute; top: 4px;">
    <small>$</small>
    {{ price }}
  </span>
</template>
<script>
export default {
  props: ["price"],
  methods: {}
};
</script>
<style scoped>
</style>

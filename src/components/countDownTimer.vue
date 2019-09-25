<template>
  <span style="font-size: 18px">
    <i class="material-icons mr-1" style="font-size: 23px; position: relative; top: 5px">history</i>
    {{ timeVar }}
  </span>
</template>
<script>
export default {
  data() {
    return {
      timeVar: null
    };
  },
  props: ["time"],
  methods: {
    updateTimer() {
      let now = new Date().getTime();
      let distance = this.time - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0) {
        return (this.timeVar = "Expired");
      }
      return (this.timeVar = `${days} days | ${hours}h ${minutes}m ${seconds}s`);
    }
  },
  created: function() {
    this.updateTimer();
    setInterval(this.updateTimer, 1000);
  }
};
</script>
<style scoped>
</style>

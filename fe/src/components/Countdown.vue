<template>
  <span class="alt">
    <template v-if="showDays">
      {{days}} {{$t('countdown.days')}}
    </template>
    {{countdown}}
  </span>
</template>

<script>
export default {
  props: ['date', 'onEnd'],
  data() {
    return {
      interval: null,
      days: null,
      countdown: '',
      showDays: false
    }
  },
  created() {
    const calc = () => {
      let result = getTimeRemaining(this.date);
      this.days = result.days;
      this.showDays = result.days > 1;
      this.countdown = `${pad(this.showDays ? result.hours : result.hoursAll)}:${pad(result.minutes)}:${pad(result.seconds)}`;
      if(result.time <= 0) {
        clearInterval(this.interval);
        if(this.onEnd) {
          this.onEnd();
        }
      }
    };
    calc();
    this.interval = setInterval(() => {
      calc();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.interval);
  }
}

function getTimeRemaining(date) {
  var t = new Date(date).getTime() - new Date().getTime();
  if(t <= 0) {
    return {
      time: 0,
      days: 0,
      hours: 0,
      hoursAll: 0,
      minutes: 0,
      seconds: 0
    }
  }
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hoursAll = Math.floor((t / (1000 * 60 * 60)));
  let hours = hoursAll % 24;
  let days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    time: t,
    days,
    hours,
    hoursAll,
    minutes,
    seconds
  };
}

function pad(n) {
  if(n <= 9) {
    return '0' + n;
  }
  return n;
}

</script>

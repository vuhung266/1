<template>
 <div class="item">
    <div class="outer-container">
        <div class="inner-container">
          <h1>Not Fancy Countdown Timer</h1>
          <div class="countdown">
            <h2>
              {{ timeLeft }}
            </h2>
            <h3>Countdown ends at <span>{{ endTime }}</span></h3>
          </div>

          <ul class="columns is-mobile is-centered">
            <li v-for="(time, index) in times" :key="index" class="column time">
              <a v-on:click.prevent="setTime(time.sec)" :class="[
                    'button',
                    'is-link',
                    {'is-active': time.sec === selectedTime && endTime !== 0 }
                  ]">
                  {{ time.display }}
                </a>
            </li>
          </ul>
        </div>
      </div>
	</div>
</template>


<script>
var intervalTimer;
export default {
  data: function() {
  return {
    
    selectedTime: 0,
    timeLeft: '00:00',
    endTime: '0',
    times: [
      {
        sec: 3,
        display: '3s'
      },
      {
        sec: 60,
        display: ' 1m'
      },
      {
        sec: 1800,
        display: '30m'
      }
    ]
  };
},
  methods: {
    setTime(seconds) {
      clearInterval(intervalTimer);
      this.timer(seconds);
    },
    timer(seconds) {
      const now = Date.now();
      const end = now + seconds * 1000;
      this.displayTimeLeft(seconds);

      this.selectedTime = seconds;
      // this.initialTime = seconds;
      this.displayEndTime(end);
      this.countdown(end);
    },
    countdown(end) {
      // this.initialTime = this.selectedTime;
      intervalTimer = setInterval(() => {
        const secondsLeft = Math.round((end - Date.now()) / 1000);

        if(secondsLeft === 0) {
          this.endTime = 0;
        }

        if(secondsLeft < 0) {
          clearInterval(intervalTimer);
          return;
        }
        this.displayTimeLeft(secondsLeft)
      }, 1000);
    },
    displayTimeLeft(secondsLeft) {
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      this.timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
    },
    displayEndTime(timestamp) {
      const end = new Date(timestamp);
      const hour = end.getHours();
      const minutes = end.getMinutes();

      this.endTime = `${hourConvert(hour)}:${zeroPadded(minutes)}`
    },
  }
}
function zeroPadded(num) {
  // 4 --> 04
  return num < 10 ? `0${num}` : num;
}

function hourConvert(hour) {
  // 15 --> 3
  return (hour % 12) || 12;
}
</script>


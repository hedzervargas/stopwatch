class Stopwatch {
  //   constructor(time, laps, startStopBtn, lapResetBtn) {
  constructor(minutes, seconds, centiSeconds, laps, startStopBtn, lapResetBtn) {
    // this.time = time;
    this.minutes = minutes;
    this.seconds = seconds;
    this.centiSeconds = centiSeconds;
    this.laps = laps;
    this.startStopBtn = startStopBtn;
    this.lapResetBtn = lapResetBtn;
    this.reset();
  }
  updateDisplay() {
    this.minutesPassed = makeStringLengthTwo(this.minutesPassed);
    this.secondsPassed = makeStringLengthTwo(this.secondsPassed);
    this.centiSecondsPassed = makeStringLengthTwo(this.centiSecondsPassed);
    // this.time.textContent = `${this.minutesPassed}:${this.secondsPassed},${this.centiSecondsPassed}`;
    this.minutes.textContent = this.minutesPassed;
    this.seconds.textContent = this.secondsPassed;
    this.centiSeconds.textContent = this.centiSecondsPassed;
    this.laps.innerHTML = this.lapsArr
      .map((i) => {
        return `<div class="lap ${
          i.lapNumber === this.highestLap.lapNumber ? "last-lap" : ""
        }">
            <p class="lap-number">${i.lapNumber ? "Lap " + i.lapNumber : ""}</p>
            <p class="lap-time">${i.lapTime}</p>
          </div>
          <div class="line"></div>`;
      })
      .join("");
  }
  reset() {
    this.msPassed = 444444;
    this.mutableMsPassed = 0;
    this.minutesPassed = 0;
    this.secondsPassed = 0;
    this.centiSecondsPassed = 0;
    this.isRunning = false;
    this.lapsArr = [
      { lapNumber: "", lapTime: "" },
      { lapNumber: "", lapTime: "" },
      { lapNumber: "", lapTime: "" },
      { lapNumber: "", lapTime: "" },
      { lapNumber: "", lapTime: "" },
    ];
    this.highestLap = { lapNumber: "", index: "" };
    this.laps.style.overflowY = "visible";
    this.laps.style.paddingRight = "0";

    this.updateDisplay();
  }
  startStop() {
    if (!this.isRunning) {
      let startingTime = new Date().getTime() - this.msPassed;
      // interval function
      const myInterval = setInterval(() => {
        const now = new Date().getTime();
        this.msPassed = now - startingTime;
        this.mutableMsPassed = this.msPassed;
        this.minutesPassed = 0;
        this.secondsPassed = 0;
        this.centiSecondsPassed = 0;
        while (this.mutableMsPassed > 60000) {
          this.minutesPassed++;
          this.mutableMsPassed -= 60000;
        }
        while (this.mutableMsPassed > 1000) {
          this.secondsPassed++;
          this.mutableMsPassed -= 1000;
        }
        while (this.mutableMsPassed > 10) {
          this.centiSecondsPassed++;
          this.mutableMsPassed -= 10;
        }
        this.updateDisplay();
        if (!this.isRunning) clearInterval(myInterval);

        if (
          this.minutesPassed == 99 &&
          this.secondsPassed == 59 &&
          this.centiSecondsPassed == 99
        ) {
          clearInterval(myInterval);
          this.startStop();
        }
      }, 1);
      this.isRunning = true;
      this.startStopBtn.textContent = "Stop";
      this.lapResetBtn.textContent = "Lap";
    } else {
      this.isRunning = false;
      this.startStopBtn.textContent = "Start";
      this.lapResetBtn.textContent = "Reset";
    }
  }
  lapReset() {
    if (this.isRunning) {
      this.lapsArr.forEach((item, index) => {
        if (item.lapNumber > this.highestLap.lapNumber) {
          this.highestLap.lapNumber = item.lapNumber;
          this.highestLap.index = index;
        }
      });
      const currentLapNumber = this.lapsArr[0].lapNumber
        ? this.highestLap.lapNumber + 1
        : 1;
      this.highestLap.lapNumber
        ? this.lapsArr.splice(this.highestLap.index + 1, 0, {
            lapNumber: currentLapNumber,
            // lapTime: this.time.textContent,
            lapTime: `${this.minutesPassed}:${this.secondsPassed},${this.centiSecondsPassed}`,
          })
        : this.lapsArr.unshift({
            lapNumber: currentLapNumber,
            // lapTime: this.time.textContent,
            lapTime: `${this.minutesPassed}:${this.secondsPassed},${this.centiSecondsPassed}`,
          });
      if (
        this.lapsArr.length > 5 &&
        !this.lapsArr[this.lapsArr.length - 1].lapNumber
      ) {
        this.lapsArr.pop();
      }
      this.updateDisplay();
      if (this.laps.children.length > 10) {
        this.laps.style.overflowY = "scroll";
        this.laps.style.paddingRight = "3px";
      }
      document.querySelector(".last-lap").scrollIntoView();
      //   console.log(lastlap);
    } else {
      this.reset();
    }
  }
}

// function //
function makeStringLengthTwo(number) {
  let string = number.toString();
  while (string.length < 2) {
    string = "0" + string;
  }
  return string;
}

// const time = document.querySelector(".time");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const centiSeconds = document.querySelector(".centi-seconds");
const startStopBtn = document.querySelector(".start-btn");
const lapResetBtn = document.querySelector(".lap-btn");
const laps = document.querySelector(".laps");

// const stopwatch = new Stopwatch(time, laps, startStopBtn, lapResetBtn);
const stopwatch = new Stopwatch(
  minutes,
  seconds,
  centiSeconds,
  laps,
  startStopBtn,
  lapResetBtn
);

startStopBtn.addEventListener("click", () => {
  stopwatch.startStop();
});

lapResetBtn.addEventListener("click", () => {
  stopwatch.lapReset();
});

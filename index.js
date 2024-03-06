const format = function (value, prefix = "") {
  const v = Math.round(value);
  return prefix + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

Vue.component("kr-chart", {
  props: ["id", "data"],
  data: function () {
    const vm = this;
    return {
      chart: null,
      total: 0,
      options: {
        series: [],
        chart: {
          type: "bar",
          stacked: true,
          stackType: "100%",
          height: "400px",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            barHeight: "100%",
            dataLabels: {
              hideOverflowingLabels: false,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        stroke: {
          width: 1,
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "15px",
            colors: ["#00ACC1", "#FFB300", "#1D57D8", "#66bb6a"],
          },
          background: {
            enabled: true,
            borderRadius: 2,
            padding: 4,
            borderWidth: 1,
          },
          formatter: function (val) {
            const percent = val / 100;
            return format(vm.data.total * percent, "$");
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        colors: ["#00ACC1", "#FFB300", "#1D57D8", "#66bb6a"],
        fill: {
          type: ['solid', 'solid', 'solid', 'pattern'],
          pattern: {
            style: 'slantedLines',
            width: 6,
            height: 6,
            strokeWidth: 1
          }
        },
        xaxis: {
          categories: ["A"],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
      },
    };
  },
  template: `<div :id="id"></div>`,
  methods: {
    render() {
      const chartElement = document.querySelector(`#${this.id}`);
      chartElement.innerHTML = "";
      this.options.series = this.data.series;
      this.chart = new ApexCharts(chartElement, this.options);
      this.chart.render();
    },
  },
});

Vue.component("kr-label", {
  props: ["label", "hint"],
  template: `<p class="mb-2 text-body-1 font-weight-medium">
      {{label}}
      <v-tooltip v-if="hint" top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn x-small icon v-bind="attrs" v-on="on">
            <v-icon color="dark lighten-1">fa-info-circle</v-icon>
          </v-btn>
        </template>
        <span v-html="hint"></span>
      </v-tooltip>
    </p>`,
});

// Vue.component("kr-slider", {
//   data: function () {
//     return {
//       value: 0,
//     };
//   },
//   props: [
//     "default",
//     "max",
//     "min",
//     "label",
//     "tagAppend",
//     "tagPrepend",
//     "hint",
//     "description",
//     "step"
//   ],
//   filters: {
//     format,
//   },
//   methods: {
//     onChange: function (event) {
//       this.value = event.target.value;
//       this.$emit("change", event.target.value);
//     },
//   },
//   mounted() {
//     this.value = this.default;
//     this.$emit("change", this.default);
//   },
//   computed: {
//     tagStyle() {
//       const maxCount = this.max.toString().length;
//       const tagAppendCount = (this.tagAppend || "").length;
//       const tagPrependCount = (this.tagPrepend || "").length;
//       const total = maxCount + tagAppendCount + tagPrependCount;
//       return {
//         width: total * 10 + "px",
//       };
//     },
//   },
//   template: `<div class="mb-10">
//     <kr-label :hint="hint" :label="label"></kr-label>
//     <p v-if="description" class="mb-2 text-body-2">{{ description }} </p>
//     <div class="range-slider">
//       <input @input="onChange" class="range-slider__range" type="range" :value="value" :min="min" :max="max" :step="step">
//       <span :style="tagStyle" class="range-slider__value">
//         {{ tagPrepend || '' }}{{ (value || 0) | format}}{{ tagAppend || '' }}
//       </span>
//     </div>
//     </div>`,
// });

Vue.component("vc-slider", {
  data: function () {
    return {
      value: 0,
    };
  },
  props: [
    "default",
    "max",
    "min",
    "label",
    "tagAppend",
    "tagPrepend",
    "hint",
    "description",
    "step", // Optional: explicitly define the step size
  ],
  filters: {
    format,
  },
  methods: {
    onChange: function (event) {
      // Ensure the input value stays within the valid range
      const newValue = Math.max(
        this.min,
        Math.min(this.max, event.target.value)
      );
      this.value = newValue;
      this.$emit("change", newValue);
    },
    decrementValue: function () {
      if (this.value > this.min) {
        // Explicitly use the defined step size or default to 1
        const decrementAmount = this.step || 100;
        this.value = Math.max(this.min, this.value - decrementAmount);
        this.$emit("change", this.value);
      }
    },
    incrementValue: function () {
      if (this.value < this.max) {
        // Explicitly use the defined step size or default to 1
        const incrementAmount = this.step || 100;
        this.value = Math.min(this.max, this.value + incrementAmount);
        this.$emit("change", this.value);
      }
    },
  },
  mounted() {
    // Ensure the initial value is valid and within the range
    this.value = Math.max(this.min, Math.min(this.max, this.default));
    this.$emit("change", this.value);
  },
  computed: {
    tagStyle() {
      const maxCount = this.max.toString().length;
      const tagAppendCount = (this.tagAppend || "").length;
      const tagPrependCount = (this.tagPrepend || "").length;
      const total = maxCount + tagAppendCount + tagPrependCount;
      return {
        width: total * 10 + "px",
      };
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <p v-if="description" class="mb-2 text-body-2">{{ description }} </p>
    <div class="range-slider">
      <button class="decrement-btn" @click="decrementValue">-</button>
      <input @input="onChange" class="range-slider__range" type="range" :value="value" :min="min" :max="max" :step="step">
      <button class="increment-btn" @click="incrementValue">+</button>
      <span :style="tagStyle" class="range-slider__value">
        {{ tagPrepend || '$' }}{{ (value || 0) | format}}{{ tagAppend || '' }}
      </span>
    </div>
  </div>`,
});


Vue.component("kr-slider", {
  data: function () {
    return {
      value: 0,
    };
  },
  props: [
    "default",
    "max",
    "min",
    "label",
    "tagAppend",
    "tagPrepend",
    "hint",
    "description",
    "step",
  ],
  filters: {
    format,
  },
  methods: {
    onChange: function (event) {
      this.value = event.target.value;
      this.$emit("change", event.target.value);
    },
    decrementValue: function () {
      if (this.value > this.min) {
        this.value -= this.step || 1;
        this.$emit("change", this.value);
      }
    },
    incrementValue: function () {
      if (this.value < this.max) {
        this.value++;
        this.$emit("change", this.value);
      }
    },
  },
  mounted() {
    this.value = this.default;
    this.$emit("change", this.default);
  },
  computed: {
    tagStyle() {
      const maxCount = this.max.toString().length;
      const tagAppendCount = (this.tagAppend || "").length;
      const tagPrependCount = (this.tagPrepend || "").length;
      const total = maxCount + tagAppendCount + tagPrependCount;
      return {
        width: total * 10 + "px",
      };
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <p v-if="description" class="mb-2 text-body-2">{{ description }} </p>
    <div class="range-slider">
      <button class="decrement-btn" @click="decrementValue">-</button>
      <input @input="onChange" class="range-slider__range" type="range" :value="value" :min="min" :max="max" :step="step">
      <button class="increment-btn" @click="incrementValue">+</button>
      <span :style="tagStyle" class="range-slider__value">
        {{ tagPrepend || '' }}{{ (value || 0) | format}}{{ tagAppend || '' }}
      </span>
    </div>
    </div>`,
});


Vue.component("kr-hours-counter", {
  data: function () {
    return {
      hoursPerDay: 8,
      daysPerWeek: 5,
      weeksPerYear: 52,
    };
  },
  props: ["label", "hint"],
  methods: {
    onChange() {
      this.$emit("change", this.totalInHours);
    },
  },
  mounted() {
    this.onChange();
  },
  computed: {
    totalInHours() {
      return this.daysPerWeek * this.hoursPerDay * this.weeksPerYear;
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <br>
    <v-row>
      <v-col class="py-0" >
        <v-text-field @change="onChange" v-model="hoursPerDay" color="dark" type="number" suffix="hours/day" single-line solo dense></v-text-field>
      </v-col>
      <v-col class="py-0" >
        <v-text-field @change="onChange" v-model="daysPerWeek" color="dark" type="number" suffix="days/week" single-line solo dense></v-text-field>
      </v-col>
    </v-row>
    </div>`,
});
Vue.component("vc-sc", {
  data: function () {
    return {
      totalSupportCalls: 5000,
    };
  },
  props: ["label", "hint"],
  methods: {
    incrementValue() {
      this.totalSupportCalls += 5000;
      this.onChange();
    },
    onChange() {
      this.$emit("change", this.totalSupportCalls);
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <div class="">
      <v-row>
        <v-col class="py-0">
          <v-text-field @input="onChange" class="mt-4 p-1" v-model="totalSupportCalls" color="dark" type="number" suffix="support calls" single-line solo dense></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-btn @click="incrementValue" class="mt-5 p-5" color="primary">Increment +5k</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>`,
});

Vue.component("vc-schats", {
  data: function () {
    return {
      totalMonthlyChats: 2000,
    };
  },
  props: ["label", "hint"],
  methods: {
    incrementValue() {
      this.totalMonthlyChats += 2000;
      this.onChange();
    },
    onChange() {
      this.$emit("change", this.totalMonthlyChats);
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <div class="">
      <v-row>
        <v-col class="py-0">
          <v-text-field @input="onChange" class="mt-4 p-1" v-model="totalMonthlyChats" color="dark" type="number" suffix="support chats" single-line solo dense></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-btn @click="incrementValue" class="mt-5 p-5" color="primary">Increment +2k</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>`,
});
Vue.component("vc-location", {
  data: function () {
    return {
      totalMonthlyLocations: 5, // Default value set to 5
    };
  },
  props: ["label", "hint"],
  methods: {
    incrementValue() {
      this.totalMonthlyLocations += 5;
      this.onChange();
    },
    onChange() {
      // Ensure the value is not 0, if it is, set it to 1
      if (this.totalMonthlyLocations === 0) {
        this.totalMonthlyLocations = 1;
      }
      this.$emit("change", this.totalMonthlyLocations);
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <div class="">
      <v-row>
        <v-col class="py-0">
          <v-text-field @input="onChange" class="mt-4 p-1" v-model="totalMonthlyLocations" color="dark" type="number" suffix="locations" single-line solo dense></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-btn @click="incrementValue" class="mt-5 p-5" color="primary">Increment +5</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>`,
});


Vue.component("vc-scnacalls", {
  data: function () {
    return {
      monthlyNotAttendedCalls: 1000,
    };
  },
  props: ["label", "hint"],
  methods: {
    incrementValue() {
      this.monthlyNotAttendedCalls += 1000;
      this.onChange();
    },
    onChange() {
      this.$emit("change", this.monthlyNotAttendedCalls);
    },
  },
  template: `<div class="mb-10">
    <kr-label :hint="hint" :label="label"></kr-label>
    <div class="">
      <v-row>
        <v-col class="py-0">
          <v-text-field @input="onChange" class="mt-4 p-1" v-model="monthlyNotAttendedCalls" color="dark" type="number" suffix=" notattendcalls" single-line solo dense></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-btn @click="incrementValue" class="mt-5 p-5" color="primary">Increment +1k</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>`,
});



new Vue({
  el: "#app",
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: "#1D57D8",
        },
      },
    },
    icons: {
      iconfont: "fas",
    },
  }),
  watch: {
    cost: {
      handler: _.debounce(
        function () {
          this.$refs["chart-without-bot"].render();
          this.$refs["chart-with-bot"].render();
        },
        500,
        {
          leading: false,
        }
      ),
    },
  },
  data: function () {
    return {
      LivechatNo: 0,
      AvailableliveChat: 0,
      CompensationAvg: 0,
      ChatLengthavg: 0,
      NoofActivechat: 0,
      ChatGrowthexp: 0,
      AutomationRate: 0
    };
  },
  filters: {
    format,
  },
  computed: {
    ChatGrowthexpPercent() {
      const ChatGrowthexp =
        parseInt(this.ChatGrowthexp) / 100;
      return 1.0 + ChatGrowthexp;
    },
    Chatlimit() {
      const ChatLengthavg = parseInt(this.ChatLengthavg);
      const NoofActivechat = parseInt(
        this.NoofActivechat
      );
      const AvailableliveChat = parseInt(this.AvailableliveChat);
      const activeAgent = parseInt(this.LivechatNo);
      const chatHours =
        (60 / ChatLengthavg) * NoofActivechat;

      const current = chatHours * activeAgent * AvailableliveChat;
      const future = this.ChatGrowthexpPercent * current;
      return {
        current,
        future,
      };
    },
    AgentforFuture() {
      const LivechatNo = parseInt(this.LivechatNo);
      const total = Math.ceil(
        LivechatNo * this.ChatGrowthexpPercent
      );
      const addition = total - LivechatNo;
      return {
        total,
        addition,
      };
    },
    cost() {
      let chatbotRate = 0.014;
      const chatbotCost = 50000 + (3000 * 12);
      const AutomationRate = 1 - this.AutomationRate / 100;
      const LivechatNo = parseInt(this.LivechatNo);
      const additionalChats =
        this.Chatlimit.future - this.Chatlimit.current;
      const CompensationAvg = parseInt(
        this.CompensationAvg
      );

      const withoutBotLabourCost =
        this.AgentforFuture.total * CompensationAvg;
      const withoutBotSystemCost = this.AgentforFuture.total * 1308;
      const withoutBotTotalCost = withoutBotLabourCost + withoutBotSystemCost;

      if (additionalChats >= 5000000) {
        chatbotRate = 0.006;
      } else if (additionalChats >= 2000000) {
        chatbotRate = 0.007;
      } else if (additionalChats >= 1000000) {
        chatbotRate = 0.008;
      } else if (additionalChats >= 500000) {
        chatbotRate = 0.009;
      } else if (additionalChats >= 200000) {
        chatbotRate = 0.01;
      } else if (additionalChats >= 100000) {
        chatbotRate = 0.011;
      } else if (additionalChats >= 50000) {
        chatbotRate = 0.012;
      }
      const additionalChatsCost = additionalChats * chatbotRate;
      const withBotCost = chatbotCost + additionalChatsCost;
      const withBotLabourCost = LivechatNo * CompensationAvg * AutomationRate;
      const withBotLiveChatCost = 12 * (160 * LivechatNo) + 2000
      const withBotTotalCost = withBotCost + withBotLabourCost + withBotLiveChatCost;

      const saved = withoutBotTotalCost - withBotTotalCost;
      const roiInOneYear = ((saved - withBotCost) / withBotCost) * 100;
      const paybackPeriod = (withBotCost / saved) * 365 / 30;
      return {
        roiInOneYear,
        paybackPeriod,
        withoutBot: {
          total: withoutBotTotalCost,
          series: [
            {
              name: "Labor cost",
              data: [(withoutBotLabourCost / withoutBotTotalCost) * 100],
            },
            {
              name: "Live chat cost",
              data: [
                ((withoutBotTotalCost - withoutBotLabourCost) /
                  withoutBotTotalCost) *
                100,
              ],
            },
          ],
        },
        withBot: {
          total: withBotTotalCost,
          series: [
            {
              name: "Labor cost",
              data: [(withBotLabourCost / withoutBotTotalCost) * 100],
            },
            {
              name: "Live chat cost",
              data: [(withBotLiveChatCost / withoutBotTotalCost) * 100],
            },
            {
              name: "Chatbot cost",
              data: [(withBotCost / withoutBotTotalCost) * 100],
            },
            {
              name: "Savings",
              data: [(withoutBotTotalCost - withBotTotalCost) / withoutBotTotalCost * 100],
            },
          ],
        },
      };
    },
  },
});

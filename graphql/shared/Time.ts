import { ms, sec } from "./UnixTime";

const toSec = (num: number) => Math.floor(num / 1000);

/**
 * A UnixSecond Native Date Object
 * @example
    const time = Time.fromMS(Date.now());
    console.log(time.value); // Unix Time Seconds (Our Standard) since 1970
    console.log(time.toString()); // toLocaleTimeString
    console.log(time.time); // Unix time reset every midnight
    console.log(new Time(1597659498, "UTC"));
    console.log(Time.parseTime("3:30 AM").timeString());
    console.log(Time.parseDate("10/24/2020").dateString());
    console.log(Time.parseDate("10 - 24 - 2020").dateString());
    console.log(
      Time.parseDateTime("8/17/2020, 3:40:04 AM")
        .changeTZ("Central")
        .changeTZ("UTC")
        .timeString()
    );
    console.log(Time.parseDateTime("2020-02-27 00:00:00.000").toString());
    console.log(
      Time.thisHour().addMS("2 hours").subtractMS("5 minutes").toString()
    );
    console.log(Time.thisDay().ms);
    console.log(Time.parseTime("noon").internalDate.getUTCHours());
    console.log(Time.thisHour().internalDate.toLocaleTimeString());
    console.log(Time.parseTime("3:30pm").fromTZ("Central").timeString());
 */
export class Time {
  private unixTime: number;
  constructor(
    unixTime: number,
    private tz: "Central" | "Eastern" | "Western" | "UTC" = "UTC"
  ) {
    const numberLength = (unixTime + "").length;
    if (numberLength === 10) {
      // SEC
      this.unixTime = unixTime;
    }
    if (numberLength === 13) {
      // MS
      this.unixTime = Math.floor(unixTime / 1000);
    }
    if (numberLength === 16) {
      // MicroS
      this.unixTime = Math.floor(unixTime / 1000000);
    }
    switch (this.tz) {
      case "Central":
        this.unixTime += toSec(ms(`5 hours`) as number);
        break;
      case "Eastern":
        this.unixTime += toSec(ms(`4 hours`) as number);
        break;
      case "Western":
        this.unixTime += toSec(ms(`7 hours`) as number);
        break;
      case "UTC":
      default:
        break;
    }
    this.tz = "UTC";
  }

  /**
   * Gets the JS Date Object from internal
   */
  get internalDate() {
    return new Date(this.ms);
  }

  /**
   *
   */
  set internalDate(date: Date) {
    this.ms = date.valueOf();
  }

  get value() {
    return this.unixTime;
  }

  set value(time: number) {
    this.unixTime = time;
  }

  get time() {
    return this.unixTime % Math.floor((ms("1 day") as number) / 1000);
  }

  get unixDate() {
    return this.unixTime % Math.floor((ms("1 day") as number) / 1000);
  }

  get ms() {
    const ms = this.unixTime * 1000;
    return ms;
  }

  static unit(
    unit: "second" | "minute" | "hour" | "day" | "week" | "month" | "year",
    size: "ms" | "second"
  ) {
    return size === "ms"
      ? (ms(`1 ${unit}`) as number)
      : Math.floor((ms(`1 ${unit}`) as number) / 1000);
  }

  addMS(_ms: number | string) {
    if (typeof _ms === "string") {
      this.ms += ms(_ms) as number;
    } else {
      this.ms += _ms;
    }
    return this;
  }

  multiplyMS(_ms: number | string) {
    if (typeof _ms === "string") {
      this.ms *= ms(_ms) as number;
    } else {
      this.ms *= _ms;
    }
    return this;
  }

  divideMS(_ms: number | string) {
    if (typeof _ms === "string") {
      this.ms /= ms(_ms) as number;
    } else {
      this.ms /= _ms;
    }
    return this;
  }

  subtractMS(_ms: number | string) {
    if (typeof _ms === "string") {
      this.ms -= ms(_ms) as number;
    } else {
      this.ms -= _ms;
    }
    return this;
  }

  set ms(input: number) {
    this.unixTime = Math.floor(input / 1000);
  }

  changeTZ(newTZ: "Central" | "Eastern" | "Western" | "UTC") {
    let change = 0;
    switch (this.tz) {
      case "Central":
        change -= 5;
        break;
      case "Eastern":
        change -= 4;
        break;
      case "Western":
        change -= 7;
        break;
      case "UTC":
      default:
        change -= 0;
        break;
    }
    switch (newTZ) {
      case "Central":
        change += 5;
        break;
      case "Eastern":
        change += 4;
        break;
      case "Western":
        change += 7;
        break;
      case "UTC":
      default:
        change += 0;
        break;
    }

    const changeInMS = this.ms - (ms(`${change} hours`) as number);
    this.ms = changeInMS;
    this.tz = newTZ;
    return this;
  }

  toString(): string {
    return this.internalDate.toLocaleString();
  }

  timeString(): string {
    return this.internalDate.toLocaleTimeString();
  }

  dateString(): string {
    return this.internalDate.toDateString();
  }

  /**
   *
   * - It includes a space between time and time of day or NOT
   * - am or pm can be lowerCase or Uppercase
   * @param time
   * @example Time.parseTime('3:30AM')
   */
  static parseTime(time: string) {
    let total = 0;
    if (time.toLowerCase() === "noon") {
      total += ms("12 hours") as number;
    } else if (time.toLowerCase() === "midnight") {
      total = 0;
    } else {
      const withoutSpaces = time.replace(/ /g, "");
      const [hour, minute] = withoutSpaces.split(/\D+/g);
      const checkAMOrPM = (str: string) =>
        time.toLowerCase().includes(str.toLowerCase());
      if (checkAMOrPM("pm")) {
        total += ms("12 hours") as number;
      }
      // console.log(ms(`${hour} hours`));
      total += ms(`${hour} hours`) as number;
      total += ms(`${minute} minutes`) as number;
    }
    // console.log(total);
    const unixDay = Math.floor(Date.now() / (ms("24 hours") as number));
    const day = unixDay * (ms("1 day") as number);
    const toReturn = Time.fromMS(day + total);
    return toReturn;
  }

  static parseDate(
    time: string,
    options: {
      monthFirst: boolean;
      yearFirst: boolean;
    } = {
      monthFirst: true,
      yearFirst: false,
    }
  ) {
    let [day, month, year] = [...time.split(/\D+/g)];
    if (options.monthFirst) {
      [month, day, year] = [...time.split(/\D+/g)];
    } else if (options.yearFirst) {
      [year, day, month] = [...time.split(/\D+/g)];
    } else {
      [day, month, year] = [...time.split(/\D+/g)];
    }
    const dayNumber = Number.parseInt(day);
    const monthNumber = Number.parseInt(month);
    const yearNumber =
      year.length === 2 ? Number.parseInt(`20${year}`) : Number.parseInt(year);
    // console.log(dayNumber, monthNumber, yearNumber);
    const total = Math.floor(
      Date.UTC(yearNumber, monthNumber - 1, dayNumber, 0, 0, 0, 0) / 1000
    );
    return new Time(total);
  }

  fromTZ(tz: "Central" | "Eastern" | "Western" | "UTC") {
    return new Time(this.value, tz);
  }

  static addTimeToDate(time: Time, date: Time) {
    const timeStr = time.changeTZ("UTC").toString().split(", ")[1];
    const dateStr = date.changeTZ("UTC").toString().split(", ")[0];
    return Time.parseDateTime(`${dateStr}, ${timeStr}`);
  }

  static parseDateTime(time: string) {
    const _time = decodeURI(time + "")
      .replace(/\%3A/g, ":")
      .replace(/\%20/g, " ");
    const dateTime = Date.parse(_time);
    const sec = Math.floor(dateTime / 1000);
    return new Time(sec);
  }

  static fromMS(time: number) {
    const sec = Math.floor(time / 1000);
    return new Time(sec);
  }

  static now() {
    return Time.fromMS(Date.now());
  }

  static thisHour() {
    const now = Date.now();
    return Time.fromMS(
      Math.floor(now / (ms("1 hour") as number)) * (ms("1 hour") as number)
    );
  }

  static thisDay() {
    const now = Date.now();
    return Time.fromMS(
      Math.floor(now / (ms("1 day") as number)) * (ms("1 day") as number)
    );
  }
}

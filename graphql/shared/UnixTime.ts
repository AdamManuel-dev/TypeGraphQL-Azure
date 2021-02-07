/**
 * SHOUTOUT TO Vercel
 * https://raw.githubusercontent.com/vercel/ms/master/index.js
 */

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

export function ms(val: string | number | any[], options?: { long?: any }) {
  options = options || {};
  var type = typeof val;
  if (type === "string" && (val as string).length > 0) {
    return parse(val as string);
  } else if (type === "number" && isFinite(val as number)) {
    return options.long ? fmtLong(val as number) : fmtShort(val as number);
  }
  throw new Error(
    "val is not a non-empty string or a valid number. val=" +
      JSON.stringify(val)
  );
}

export function sec(val: string | number | any[], options?: { long?: any }) {
  options = options || {};
  var type = typeof val;
  if (type === "string" && (val as string).length > 0) {
    return parse(`${val}000`);
  } else if (type === "number" && isFinite(val as number)) {
    return options.long
      ? fmtLong((val as number) * 1000)
      : fmtShort((val as number) * 1000);
  }
  throw new Error(
    "val is not a non-empty string or a valid number. val=" +
      JSON.stringify(val)
  );
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str: string): number | undefined {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || "ms").toLowerCase();
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms: number): string {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + "s";
  }
  return ms + "ms";
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms: number): string {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, "second");
  }
  return ms + " ms";
}

/**
 * Pluralization helper.
 */

function plural(ms: number, msAbs: number, n: number, name: string) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
}

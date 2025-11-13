if (typeof ProgressEvent === "undefined") {
  global.ProgressEvent = function () {} as typeof ProgressEvent;
}
if (typeof Event === "undefined") {
  global.Event = function () {} as typeof Event;
}
if (typeof CustomEvent === "undefined") {
  global.CustomEvent = function () {} as typeof CustomEvent;
}

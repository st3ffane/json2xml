require("jsdom-global")();
require("mocha");

before(() => {
  global.DOMParser = window.DOMParser;
});

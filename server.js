const server = require("live-server");

const options = {
  file: "404.html",
  mount: [['/webc-app-tester', './']],
};

server.start(options);
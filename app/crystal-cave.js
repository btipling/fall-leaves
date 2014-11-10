if (Meteor.isClient) {
  var C_WIDTH = 1300,
    C_HEIGHT = 700;

  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.game.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  function genBG() {
    var c = $("#canvas-bg");
    c.height(C_HEIGHT);
    c.width(C_WIDTH);
    Session.set("counter",Session.get("counter") + 1);
    generateBG(c.get(0), C_WIDTH, C_HEIGHT);
    requestAnimationFrame(genBG);
  }

  Template.game.events({
  });
  Meteor.startup(function () {
    genBG();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

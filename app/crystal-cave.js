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

  function genBG(baseImage) {
    var c = $("#canvas-bg");
    c.height(C_HEIGHT);
    c.width(C_WIDTH);
    Session.set("counter",Session.get("counter") + 1);
    generateBG(c.get(0), C_WIDTH, C_HEIGHT, baseImage);
    requestAnimationFrame(genBG.bind(null, baseImage));
  }

  function drawBaseBG() {
    var baseImage = new Image(),
      c = $("#canvas-bg").get(0), context;
    context = c.getContext("2d");
    baseImage.src = "fall_bg.jpg";
    baseImage.onload = function(){
      genBG(baseImage);
    }
  }

  Template.game.events({
  });
  Meteor.startup(function () {
    drawBaseBG();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

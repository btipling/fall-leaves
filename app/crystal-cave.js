if (Meteor.isClient) {
  var C_WIDTH = 1300,
    C_HEIGHT = 700, c, cd;

  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.game.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  function genBG(swan, bg) {
    Session.set("counter",Session.get("counter") + 1);
    generateBG(cd, C_WIDTH, C_HEIGHT, swan, bg);
    requestAnimationFrame(genBG.bind(null, swan, bg));
  }

  function drawBaseBG() {
    var baseImage = new Image(), context;
    c = $("#canvas-bg");
    cd = c.get(0);
    c.height(C_HEIGHT);
    c.width(C_WIDTH);
    context = cd.getContext("2d");
    baseImage.src = "fall_bg.jpg";
    baseImage.onload = function(){
      drawSwan(baseImage);
    }
  }

  function drawSwan(bg) {
    var swan = new Image();
    swan.src = "swan.png";
    swan.onload = function(){
      genBG(swan, bg);
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

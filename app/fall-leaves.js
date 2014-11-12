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

  function resizeCanvas() {
    var w, h;
    w = document.body.clientWidth * .9;
    h = document.body.clientHeight * .9;
    console.log("resizing", w, h);
    if (w > 1300) {
      w = 1300;
    }
    if (h > 700) {
      h = 700;
    }
    if (w > h) {
      C_HEIGHT = h;
      C_WIDTH = h * (13/7);
    } else {
      C_HEIGHT = w * (7/13);
      C_WIDTH = w;
    }
    cd.height = C_HEIGHT;
    cd.width = C_WIDTH;
  }

  function drawBaseBG() {
    var baseImage = new Image(), context;
    c = $("#canvas-bg");
    cd = c.get(0);
    resizeCanvas();
    console.log("the fuck", C_WIDTH, C_HEIGHT);
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
    window.onresize = resizeCanvas;
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

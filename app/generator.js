var colors = [
  "f05d00",
  "d64c05",
  "f91700",
  "d00000",
  "fae365",
  "e07e00",
  "d8a14b",
  "af6710",
  "9d682d",
  "240718",
  "61160a",
  "5c0700",
  "5c0700",
];

var shapes = [
];

var breeze;

var MAX_SHAPES = 10;
var currentMax = MAX_SHAPES;
var swanX = null;

generateBG = function (canvas, width, height, swan, bg) {
  var i, context = canvas.getContext("2d"), coords, shouldRotate, rotSpeed,
      genBreeze = false;
  if (swanX === null || swanX < 0) {
    swanX = .9;
  }
  if (!breeze && rand(0, 100) === 0) {
    breeze = rand(100, 200);
    genBreeze = true;
  } else if (breeze) {
    currentMax = MAX_SHAPES + breeze;
    breeze -= 1;
    swanX -= 0.00002;
  } else {
    swanX -= 0.00004;
  }
  context.imageSmoothingEnabled = true;
  context.lineWidth = 0.9;
  context.clearRect(0, 0, width, height);
  context.drawImage(bg, 0, 0, width, height);
  context.drawImage(swan, width*swanX, height*.935, width*0.0384, height*0.1);
  if (shapes.length < currentMax) {
    if (rand(0, 2) === 0) {
      shapes.push(generateShape(-30, rand(0, height)));
    } else {
      shapes.push(generateShape(rand(0, width), -30));
    }
  }
  shouldRotate = (Session.get("counter") % 2) === 0;
  for (i = 0; i < shapes.length; i++) {
    if (genBreeze) {
      shapes[i].xMoveModifier = rand(0, 2);
      shapes[i].yMoveModifier = rand(0, 2) * -1;
    } else if (breeze && breeze < 10) {
      if (rand(0, 1)) {
        shapes[i].yMoveModifier = 0;
      }
    }
    moveDown(shapes[i]);
    if (shouldRotate) {
      rotSpeed = shapes[i].rotationSpeed;
      rotSpeed = breeze ? rotSpeed * 2 : rotSpeed;
      rotateTriangle(rotSpeed * shapes[i].rotationDirection, shapes[i]);
    }
    drawTriangle(context, shapes[i]);
  }
  shapes = shapes.filter(function (shape) {
    if (shape.center[1] > height + 500) {
      return false;
    }
    return shape.center[0] <= width + 500;
  });
}

function moveDown(shape) {
  var i, len, xMov = shape.xMov + shape.xMoveModifier,
      yMov = shape.yMov + shape.yMoveModifier;
  for (i - 0, len = shape.coords.length; i < len; i++) {
    shape.coords[i][0] += xMov;
    shape.coords[i][1] += yMov;
  }
  shape.center[0] += xMov;
  shape.center[1] += yMov;
}

function drawTriangle(context, shape) {
  context.beginPath();
  context.fillStyle = "#" + colors[shape.color];
  shape.coords.forEach(function(coords, index) {
    if (!index) {
      context.moveTo(coords[0], coords[1]);
    } else {
      context.lineTo(coords[0], coords[1]);
    }
  });
  context.lineTo(shape.coords[0][0], shape.coords[0][1]);
  context.fill();
}

function generateShape(x, y) {
  //generate shape:
  var sideA, sideB, sideC, m, coords, angle, shape = {};

  coords = [[x,y]];
  shape.coords = coords;

  shape.color = rand(0, colors.length-1);

  sideA = rand(10, 50);
  shape.sideA = sideA;

  sideB = rand(10, 50);
  shape.sideB = sideB;

  sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
  shape.sideC = sideC;

  angle = rand(30, 90);
  shape.angle = angle;
  m = Math.tan(angle);
  shape.m = m;

  coords.push([x + sideA, y]);
  coords.push([
      Math.round(x + (sideB/(Math.sqrt(1 + Math.pow(m,2))))),
      Math.round(y + ((sideB*m)/(Math.sqrt(1 + Math.pow(m,2))))),
  ]);

  shape.center = [
    (coords[0][0] + coords[1][0] + coords[2][0])/3,
    (coords[1][1] + coords[1][1] + coords[2][1])/3,
  ];
  shape.rotation = rand(0, 360);
  shape.rotationSpeed = rand(1, 10)/100;
  shape.rotationDirection = rand(1, 0) ? 1 : -1;
  shape.xMov = rand(1, 3);
  shape.xMoveModifier = 0;
  shape.yMov = rand(2, 4);
  shape.yMoveModifier = 0;
  return shape;
}



function rotateTriangle(rotation, shape) {
  var mx, my, cosRot = Math.cos(rotation),
      sinRot = Math.sin(rotation);
  cx = shape.center[0];
  cy = shape.center[1];
  //apply change for origin to a,b,c to move them.
  shape.coords.forEach(function (coords, i) {
    var x, y;
    // centering coords:
    x = coords[0] - cx;
    y = coords[1] - cy;
    coords[0] = (x * cosRot - y * sinRot) + cx;
    coords[1] = (y * cosRot + x * sinRot) + cy;
  });
}

/**
 * @param {number} max
 * @param {number} min
 * @return {number}
 */
function rand (max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

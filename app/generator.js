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

generateBG = function (canvas, width, height, baseImage) {
  var i, context = canvas.getContext("2d"), coords, shouldRotate;
  context.imageSmoothingEnabled = true;
  context.lineWidth = 0.9;
  context.clearRect(0, 0, width, height);
  context.drawImage(baseImage, 0, 0);
  if (rand(0, 2) === 0) {
    shapes.push(generateShape(-30, rand(0, height)));
  } else {
    shapes.push(generateShape(rand(0, width), -30));
  }
  shouldRotate = (Session.get("counter") % 2) === 0;
  for (i = 0; i < shapes.length; i++) {
    moveDown(shapes[i]);
    if (shouldRotate) {
      rotateTriangle(shapes[i].rotationSpeed * shapes[i].rotationDirection, shapes[i]);
    }
    drawTriangle(context, shapes[i]);
  }
  shapes = shapes.filter(function (shape) {
    if (shape.center[1] > height + 50) {
      return false;
    }
    return shape.center[0] <= width + 50;
  });
}

function moveDown(shape) {
  shape.coords.forEach(function (coords) {
    coords[0] += 1;
    coords[1] += 1;
  });
  shape.center[0] += 1;
  shape.center[1] += 1;
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

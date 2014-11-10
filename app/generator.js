var colors = [
  "f5a8fa",
  "f8d1fa",
  "faa8ac",
  "fad1d4",
  "f5faa8",
  "f8fad1",
  "b1faa8",
  "b9cbff",
  "b8ebff",
];

var triangles = [
];

generateBG = function (canvas, width, height) {
  var i, context = canvas.getContext("2d"), coords, shouldRotate;
  context.imageSmoothingEnabled = true;
  context.lineWidth = 0.9;
  context.clearRect(0, 0, width, height);
  if (rand(0, 2) === 0) {
    triangles.push(generateTriangle(-30, rand(0, height)));
  } else {
    triangles.push(generateTriangle(rand(0, width), -30));
  }
  shouldRotate = (Session.get("counter") % 2) === 0;
  console.log("shouldRotate", shouldRotate);
  for (i = 0; i < triangles.length; i++) {
    moveDown(triangles[i]);
    if (shouldRotate) {
      rotateTriangle(triangles[i].rotationSpeed * triangles[i].rotationDirection, triangles[i]);
    }
    drawTriangle(context, triangles[i]);
  }
  triangles = triangles.filter(function (triangle) {
    if (triangle.center[1] > height + 50) {
      return false;
    }
    return triangle.center[0] <= width + 50;
  });
  console.log("num triangles", triangles.length);
}

function moveDown(triangle) {
  triangle.coords.forEach(function (coords) {
    coords[0] += 1;
    coords[1] += 1;
  });
  triangle.center[0] += 1;
  triangle.center[1] += 1;
}

function drawTriangle(context, triangle) {
  context.beginPath();
  context.fillStyle = "#" + colors[triangle.color];
  context.moveTo(triangle.coords[0][0], triangle.coords[0][1]);
  context.lineTo(triangle.coords[1][0], triangle.coords[1][1]);
  context.lineTo(triangle.coords[2][0], triangle.coords[2][1]);
  context.lineTo(triangle.coords[0][0], triangle.coords[0][1]);
  context.fill();
}

function generateTriangle(x, y) {
  //generate triangle:
  var sideA, sideB, sideC, m, coords, angle, triangle = {};
  coords = [[x,y]];
  triangle.coords = coords;
  triangle.color = rand(0, colors.length-1);
  sideA = rand(10, 50);
  triangle.sideA = sideA;
  sideB = rand(10, 50);
  triangle.sideB = sideB;
  sideC = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
  triangle.sideC = sideC;
  angle = rand(30, 90);
  triangle.angle = angle;
  coords.push([x + sideA, y]);
  m = Math.tan(angle);
  triangle.m = m;
  coords.push([
      Math.round(x + (sideB/(Math.sqrt(1 + Math.pow(m,2))))),
      Math.round(y + ((sideB*m)/(Math.sqrt(1 + Math.pow(m,2))))),
  ]);
  triangle.center = [
    (coords[0][0] + coords[1][0] + coords[2][0])/3,
    (coords[1][1] + coords[1][1] + coords[2][1])/3,
  ];
  triangle.rotation = rand(0, 360);
  triangle.rotationSpeed = rand(1, 10)/100;
  triangle.rotationDirection = rand(1, 0) ? 1 : -1;
  return triangle;
}



function rotateTriangle(rotation, triangle) {
  var mx, my, cosRot = Math.cos(rotation),
      sinRot = Math.sin(rotation);
  cx = triangle.center[0];
  cy = triangle.center[1];
  //apply change for origin to a,b,c to move them.
  triangle.coords.forEach(function (coords, i) {
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

var gameState = 0;
var canvas;
var database;
var isDrawing = false;
var currentPath = [];
var drawing = [];
var dB_drawing = [];
var picture123;
var score = 0;
var timer = 30;   

function preload (){
    image1 = loadImage('Images/image1.jpeg');
    image2 = loadImage('Images/image2.jpeg');
    image3 = loadImage('Images/image3.jpeg');
    image4 = loadImage('Images/image4.jpeg');
    image5 = loadImage('Images/image5.jpeg');
    image6 = loadImage('Images/image6.jpeg');
}

function setup() {
    form = new Form();
    canvas = createCanvas(displayWidth, displayHeight - 300);
    //canvas.parent("canvascontainer");
    database = firebase.database();

    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);

    var saveButton = select('#saveButton');
    saveButton.size(198, 50);
    saveButton.mousePressed(saveDrawing);
    var clearButton = select('#clearButton');
    clearButton.size(198, 50);
    clearButton.mousePressed(clearDrawing);
    picture123 = createSprite(200,200);
    picture123.addImage(image1);
    picture123.scale = 0.5;
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath() {
    isDrawing = false;
    //dBref.push(drawing);
}

function draw() {
    background("cyan");
    drawSprites();
    timer = timer -0.05;
    textSize(30);
    fill("red");
    text("Timer : "+timer, displayWidth - 157, displayHeight - 850)
    form.display();
    if (isDrawing) {
        var point = {
            x: mouseX,
            y: mouseY
        };
        currentPath.push(point);
    }
    stroke(25, 34, 234);
    strokeWeight(4);
    noFill();
    for (var i = 0; i < drawing.length; i++) {
        var path = drawing[i];
        beginShape();
        for (var j = 0; j < path.length; j++) {
            vertex(path[j].x, path[j].y);
        }
        endShape();
    }

    //Reading from database
    readData();
    stroke(255, 0, 0);
    strokeWeight(4);
    noFill();

    for (var i = 0; i < dB_drawing.length; i++) {
         var path = dB_drawing[i];
         beginShape();
         for (var j = 0; j < path.length; j++) {
             vertex(path[j].x, path[j].y);
         }
         endShape();
    }
}

function readData() {
    database.ref('MonaLisa/Session1/drawing/').on('child_added', function(data) {
        dB_drawing.push(data.val());
        console.log(dB_drawing);
    })
}

function saveDrawing() {
    var dBref = database.ref('MonaLisa');
    var data = {
        name: 'JSH',
        drawing: drawing,
        //    color: [120, 18, 234],

    };
    //dBref.push(data);
    dBref.set({
        "Session1": data
    })
}

//clear all data in database
function clearDrawing() {
    dB_drawing = [];
    var dBref = database.ref('MonaLisa');
    dBref.remove();
}
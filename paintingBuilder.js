const FREQUENCE = 1;
const STOP_TIME = 5;
const N_SHAPES  = 300;

var stage        = new PIXI.Container();
var counter      = 0;
var previousTime = new Date().getTime();
var shapes 		 = [];
var appearing 	 = true;
var stopCounter;

var renderer = PIXI.autoDetectRenderer(960, 640, { backgroundColor : 0, antialias:true});
document.body.appendChild(renderer.view);

requestAnimationFrame(gameLoop);


function gameLoop() {
	var lNewTime   = new Date().getTime();
	var lDeltaTime = (lNewTime - previousTime) / 1000;
	
	requestAnimationFrame(gameLoop);
	renderer.render(stage);
	
	doActionPainting(lDeltaTime);
	doActionFade(lDeltaTime);
	
	previousTime = lNewTime;
}


function doActionFade(pDeltaTime){
	for (var i = shapes.length -1; i > -1; i--){
		var lShape = shapes[i];
		lShape.timeCounter += pDeltaTime;
		lShape.alpha = Math.lerp(lShape.startAlpha, lShape.targetedAlpha, lShape.timeCounter / lShape.targetedTime);
		
		if (lShape.targetedAlpha == 0 && lShape.alpha == 0){
			stage.removeChild(lShape);
			shapes.splice(i, 1);
		}
	}
}


function doActionPainting(pDeltaTime){
	counter++;
	
	if (!(counter % FREQUENCE)){
		if (appearing){
			doActionAppear();
		} else {
			if (stopCounter < STOP_TIME){
				stopCounter += pDeltaTime;
				return;
			}
			
			doActionDisappear();		
		}
	}
}


function doActionAppear(){
	if (shapes.length < N_SHAPES){
		createRandomShape();
	} else {
		var lShapes = shapes.filter(function(pShape){
			return pShape.targetedAlpha != pShape.alpha;
		});
		
		if (lShapes.length == 0){
			appearing 	= false;
			stopCounter = 0;
			counter 	= 0;
		}
	}
}


function doActionDisappear(){
	var lShapes = shapes.filter(function(pShape){
		return pShape.targetedAlpha;
	});
	
	if (lShapes.length){
		var lShape 			 = lShapes[Math.floor(Math.random() * lShapes.length)];
		lShape.timeCounter   = 0;
		lShape.startAlpha 	 = lShape.alpha;
		lShape.targetedAlpha = 0;
	}
	
	if (shapes.length == 0){
		shapes 	  = [];
		appearing = true;
		counter   = 0;
	}	
}


function createSquareAt(pX, pY, pWidth, pHeight, pColor){
	var lRect = new PIXI.Graphics();

	lRect.beginFill(pColor);
	lRect.drawRect(-pWidth/2, -pHeight/2, pWidth, pHeight);
	lRect.endFill();

	lRect.x = pX;
	lRect.y = pY;

	stage.addChild(lRect);
	
	return lRect;
}


function createCircleAt(pX, pY, pRadius, pColor){
	var lCircle = new PIXI.Graphics();

	lCircle.beginFill(pColor);
	lCircle.drawCircle(0, 0, pRadius);
	lCircle.endFill();

	lCircle.x = pX;
	lCircle.y = pY;

	stage.addChild(lCircle);
	
	return lCircle;
}


function createRandomShape(){
	var lShape; 
		
	if (Math.random() < 0.5){
		lShape = createSquareAt(Math.random() * stage.width , Math.random() * stage.height, Math.random() * 200 + 10, Math.random() * 200 + 10, 0xFFFFFF * Math.random());
	}
	else {
		lShape = createCircleAt(Math.random() * stage.width, Math.random() * stage.height, Math.random() * 50 + 10, 0xFFFFFF * Math.random());
	}
	
	lShape.targetedAlpha = Math.random();
	lShape.timeCounter   = 0;
	lShape.targetedTime  = Math.random() * 2 + 0.5;
	lShape.startAlpha 	 = 0;
	lShape.alpha 		 = 0;
	
	shapes.push(lShape);
}
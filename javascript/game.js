var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0xf5fcf7});
var stage = new PIXI.Container();

var start_screen = new PIXI.Container();
var game_screen = new PIXI.Container();
var end_screen = new PIXI.Container();


stage.addChild(start_screen);
var menu = true;


PIXI.sound.add("caughtBug", "sounds/bug_catch.mp3");


PIXI.loader
	.add("spritesheet/sprites.json")
	.load(ready);


// declares textures and variables for sprites

var start_text = PIXI.Texture.fromImage("images/Start.png");
var start = new PIXI.Sprite(start_text);

var instructions_text = PIXI.Texture.fromImage("images/instructions.png");
var instructions = new PIXI.Sprite(instructions_text);

var bird;
var bug;

var bug_count = 0;
gameport.appendChild(renderer.view);

var instructions;


// for a 400 x 400 grid with 10 spaces each way, each square should be 40 pixels
// need to place in the middle of those squares, so start off with 40 * square_number + 20

game_map = [10][10];
// squares are numbered 0-9
// squares the bird can go in are 1-8
current_x_square = 4;
current_y_square = 4;
current_location_x = 180;
current_location_y = 180;

bug_x = 0;
bug_y = 0;



// if resources are loaded, this runs
function ready()
{
	
	var sheet = PIXI.loader.resources["spritesheet/sprites.json"];
	
	bird = new PIXI.Sprite(sheet.textures["bird-100px-copy.png"]);
	bug =  new PIXI.Sprite(sheet.textures["beetle.png"]);


	bird.anchor.x = 0.5;
	bird.anchor.y = 0.5;

	bird.position.x = 200;
	bird.position.y = 200;

	bird.scale.x = 0.65;
	bird.scale.y = 0.65;


	game_screen.addChild(bird);


	bug.anchor.x = 0.5;
	bug.anchor.y = 0.5;

	bug.scale.x = 1;
	bug.scale.y = 1;
	
	displayStartScreen();
}


// displays start menu
function displayStartScreen()
{
	start.anchor.x = 0;
	start.anchor.y = 0.5;
	start.position.x = 175;
	start.position.y = 175;
	
	start.scale.x = 0.5;
	start.scale.y = 0.5;
	
	
	instructions.anchor.x = 0;
	instructions.anchor.y = 0.5;
	instructions.position.x = 175;
	instructions.position.y = 225;
	
	instructions.scale.x = 0.5;
	instructions.scale.y = 0.5;
	
	
	stage.addChild(start_screen);
	start_screen.addChild(start);
	start_screen.addChild(instructions);
	
	bug.position.x = 150;
	bug.position.y = 175;
	
	start_screen.addChild(bug);
}

// displays credits
function displayEndScreen()
{
	var graphics_texture = PIXI.Texture.fromImage("images/graphics.png");
	var graphics = new PIXI.Sprite(graphics_texture);
	
	graphics.anchor.x = 0.5;
	graphics.anchor.y = 0.5;
	graphics.position.x = 200;
	graphics.position.y = 200;
	
	end_screen.addChild(graphics);
	
	stage.removeChild(game_screen);
	stage.addChild(end_screen);
}

// menu selection
function selectOption()
{
	if (menu == true)
	{
		if (bug.position.y == 175)
		{
			menu = false;
			stage.removeChild(start_screen);
			stage.addChild(game_screen);
			placeBug();
		}
		else if (bug.position.y == 225)
		{
			stage.removeChild(start_screen);
			
			instructions = new PIXI.Text("Catch 10 bugs by moving the bird \n" +
				"w = up, \na = left, \ns = down, \nd = right");
				
			stage.addChild(instructions);
		}
		else
		{
			stage.removeChild(instructions);
			stage.removeChild(game_screen);
			displayStartScreen();
		}
	}
}

// update bug variables
function tweenFinish(new_x, new_y)
{
	bug_x = new_x;
	bug_y = new_y;
}

// places the bug
function placeBug()
{	
	// randomly chooses a square between 1-8 (inclusive)
	// math.round rounds to the nearest integer
	bug_x_square = Math.round(((Math.random()) * 7) + 1);
	bug_y_square = Math.round(((Math.random()) * 7) + 1);
	
	
	bug_x = bug_x_square * 40 + 20;
	bug_y = bug_y_square * 40 + 20;
	
	bug.position.x = bug_x;
	bug.position.y = bug_y;
	
	game_screen.addChild(bug);
	
}

// checks if bug has been collected
function bugCollected()
{
	if ((bug_x == current_location_x) && (bug_y == current_location_y))
	{
		PIXI.sound.play("caughtBug");
		game_screen.removeChild(bug);
		bug_count += 1;
		placeBug();
	}
}


function moveDown(current_x, current_y)
{
	// checks to see if already in the bottom square
	// 340 is the center of the bottom square
	if (current_y < 340)
	{
		current_location_y = current_y + 40;
		current_y_square += 1;
		bird.position.y = current_location_y;
	}
}

function moveLeft(current_x, current_y)
{
	// changes bird direction
	bird.scale.x = 0.65;
	
	// checks to see if bird is is already in the far left square
	// 60 is the center of the last square the bird can go in
	if (current_x > 60)
	{
		current_location_x = current_x - 40;
		current_x_square -= 1;
		bird.position.x = current_location_x;
	}
}

function moveRight(current_x, current_y)
{
	// changes bird direction
	bird.scale.x = -0.65;
	
	// checks if bird is already in far right square
	// 340 is the center of the last right square the bird can go in
	if (current_x < 340)
	{
		current_location_x = current_x + 40;
		current_x_square += 1;
		bird.position.x = current_location_x;
	}
}

function moveUp(current_x, current_y)
{
	// checks to see if bird is already in the top square
	// 60 is the highest the bird can go (center of top square)
	if (current_y > 60)
	{
		current_location_y = current_y - 40;
		current_y_square -= 1;
		bird.position.y = current_location_y;
	}
}

function keyPress(key)
{
	// w = up
	if (key.keyCode == 87)
	{
		if (menu != true)
		{
			moveUp(current_location_x, current_location_y);
		}
		else
		{
			bug.position.y = 175;
		}
	}
	
	// a = left
	if (key.keyCode == 65)
	{
		moveLeft(current_location_x, current_location_y);
	}
	
	// s = down
	if (key.keyCode == 83)
	{
		if (menu != true)
		{
			moveDown(current_location_x, current_location_y);
		}
		else
		{
			bug.position.y = 225;
		}
	}
	
	// d = right
	if (key.keyCode == 68)
	{
		moveRight(current_location_x, current_location_y);
	}
	
	// enter
	if (key.keyCode == 13)
	{
		selectOption();
	}
}


document.addEventListener("keydown", keyPress);


setInterval(function(){
	if (bug_count >= 5)
	{
		bug_x_square = Math.round(((Math.random()) * 7) + 1);
		bug_y_square = Math.round(((Math.random()) * 7) + 1);
	
		new_bug_x = bug_x_square * 40 + 20;
		new_bug_y = bug_y_square * 40 + 20;
		
		createjs.Tween.get(bug).to({x: new_bug_x, y: new_bug_y}, 1000).call(tweenFinish, [new_bug_x, new_bug_y]);
	}
}, 3000);



function animate()
{
	requestAnimationFrame(animate);
	bugCollected();
	if (bug_count >= 10)
	{
		bug_count = 0;
		displayEndScreen();
	}
	renderer.render(stage);
}

animate();

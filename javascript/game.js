var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0xf5fcf7});
var stage = new PIXI.Container();
var bird_texture = PIXI.Texture.fromImage("images/bird-100px-copy.png");
var bird = new PIXI.Sprite(bird_texture);

var bug_texture = PIXI.Texture.fromImage("images/beetle.png");
var bug = new PIXI.Sprite(bug_texture);

gameport.appendChild(renderer.view);

bird.anchor.x = 0.5;
bird.anchor.y = 0.5;

bird.position.x = 200;
bird.position.y = 200;

bird.scale.x = 0.65;
bird.scale.y = 0.65;

stage.addChild(bird);


bug.anchor.x = 0.5;
bug.anchor.y = 0.5;

bug.scale.x = 1;
bug.scale.y = 1;


game_map = [10][10];
// squares are numbered 0-9
// squares the bird can go in are 1-8
current_x_square = 4;
current_y_square = 4;
current_location_x = 180;
current_location_y = 180;

bug_x = 0;
bug_y = 0;

// for a 400 x 400 grid with 10 spaces each way, each square should be 40 pixels
// need to place in the middle of those squares, so start off with 40 * square_number + 20?

// if needed could set the coordinates in the array for the x and y and get the coordinates from there



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
	
	//console.log(bug_x);
	//console.log(bug_y);
	
	stage.addChild(bug);
}

function bugCollected()
{
	if ((bug_x == current_location_x) && (bug_y == current_location_y))
	{
		stage.removeChild(bug);
		placeBug();
	}
}


function moveDown(current_x, current_y)
{
	// checks to see if already in top square
	// 340 is the center of the top square
	if (current_y < 340)
	{
		current_location_y = current_y + 40;
		current_y_square += 1;
		bird.position.y = current_location_y;
	}
}

function moveLeft(current_x, current_y)
{
	bird.scale.x = 0.65;
	
	if (current_x > 60)
	{
		current_location_x = current_x - 40;
		current_x_square -= 1;
		bird.position.x = current_location_x;
	}
}

function moveRight(current_x, current_y)
{
	bird.scale.x = -0.65;
	if (current_x < 340)
	{
		current_location_x = current_x + 40;
		current_x_square += 1;
		bird.position.x = current_location_x;
	}
}

function moveUp(current_x, current_y)
{
	//if (current_y > 20)
	if (current_y > 60)
	{
		current_location_y = current_y - 40;
		current_y_square -= 1;
		bird.position.y = current_location_y;
	}
}

function keyPress(key)
{
	if (key.keyCode == 87)
	{
		moveUp(current_location_x, current_location_y);
	}
	
	if (key.keyCode == 65)
	{
		moveLeft(current_location_x, current_location_y);
	}
	
	if (key.keyCode == 83)
	{
		moveDown(current_location_x, current_location_y);
	}
	
	if (key.keyCode == 68)
	{
		moveRight(current_location_x, current_location_y);
	}
}


document.addEventListener("keydown", keyPress);
placeBug();

function animate()
{
	requestAnimationFrame(animate);
	//bird.rotation += 0.1;
	bugCollected();
	renderer.render(stage);
}
animate();

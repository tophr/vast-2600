export default function sceneThief() {
	const traps = ["omen", "flamewall", "bomb", "monster"];
  
	for (const trap of traps) {
	  loadSprite(trap, `${trap}.png`);
	}
  
	scene("thiefScene", () => {
	  // loadSound("hit", "/examples/sounds/hit.mp3");
	  // loadSound("wooosh", "/examples/sounds/wooosh.mp3");
  
	  const SPEED_MIN = 40; //120;
	  const SPEED_MAX = 160; //640;
  
	  // add the player game object
	  const player = add([
		sprite("thief"),
		pos(40, 20),
		area({ scale: 0.5 }),
		anchor("center"),
	  ]);
  
	  // make the layer move by mouse
	  player.onUpdate(() => {
		player.pos = mousePos();
	  });
  
	  // game over if player eats a trap
	  player.onCollide("trap", () => {
		go("lose", score, "thief");
		// play("hit");
	  });
  
	  // move the obstacle every frame, destroy it if far outside of screen
	  onUpdate("obstacle", (obstacle) => {
		obstacle.move(-obstacle.speed, 0);
		if (obstacle.pos.x < -120) {
		  destroy(obstacle);
		}
	  });
  
	  onUpdate("coin", (coin) => {
		if (coin.pos.x <= 0) {
		  go("lose", score, "thief");
		  // play("hit");
		  addKaboom(coin.pos);
		}
	  });
  
	  // score counter
	  let score = 0;
  
	  const scoreLabel = add([
		text(score, {
		  font: "unscii",
		  size: 16,
		}),
		pos(12, 12),
	  ]);
  
	  // increment score if player eats a coin
	  player.onCollide("coin", (coin) => {
		addKaboom(player.pos, ({ scale: 0.25 }));
		score += 1;
		destroy(coin);
		scoreLabel.text = score;
		burp();
		shake(12);
	  });
  
	  // do this every 0.3 seconds
	  loop(0.3, () => {
		// spawn from right side of the screen
		const x = width() + 12;
		// spawn from a random y position
		const y = rand(0, height());
		// get a random speed
		const speed = rand(SPEED_MIN, SPEED_MAX);
		// 50% percent chance is coin
		const isCoin = chance(0.5);
		const spriteName = isCoin ? "coin" : choose(traps);
  
		add([
		  sprite(spriteName),
		  pos(x, y),
		  area({ scale: 0.5 }),
		  // scale(0.25),
		  anchor("center"),
		  "obstacle",
		  isCoin ? "coin" : "trap",
		  { speed: speed },
		]);
	  });
	});
  }
  
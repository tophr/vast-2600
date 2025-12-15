export default function sceneThief() {
  const traps = ["omen", "flamewall", "bomb", "monster"];

  // for (const trap of traps) {
  //   loadSprite(trap, `${trap}.png`);
  // }

  scene("thiefScene", () => {
    // loadSound("hit", "/examples/sounds/hit.mp3");
    // loadSound("wooosh", "/examples/sounds/wooosh.mp3");

    const SPEED_MIN = 40; //120;
    const SPEED_MAX = 160; //640;

		 // Text bubble
    const textbox = add([
      rect(width() - 180, 60, { radius: 10 }),
      anchor("center"),
      pos(center().x, height() - 100),
      outline(2),
      color(0, 0, 0),
      area(),
    ]);

    // Text
    const instructionText = add([
      pos(textbox.pos),
      text("Use arrow keys or WASD to move the thief to collect coins and avoid traps!", {
        font: "unscii",
        size: 8,
        width: width() - 180,
        align: "center",
      }),
      anchor("center"),
    ]);

		const startText = add([
      pos(center().x, textbox.pos.y + 60),
      text("Press SPACEBAR or ENTER to start", {
        font: "unscii",
        size: 8,
        // width: width() - 180,
        align: "center",
      }),
      anchor("center"),
    ]);

    // Make start text blink slowly
    startText.onUpdate(() => {
      startText.opacity = wave(0.3, 1, time() * 2);
    });

    // Game state
    let gameStarted = false;
    let gameStartTime = 0;

    // Dismiss instructions function
    function dismissInstructions() {
      if (!gameStarted) {
        gameStarted = true;
        gameStartTime = time();
        destroy(textbox);
        destroy(instructionText);
				destroy(startText);
      }
    }

    // Dismiss on key press
    onKeyPress("space", dismissInstructions);
    onKeyPress("enter", dismissInstructions);

    // Dismiss on click
    textbox.onClick(dismissInstructions);

    // add the player game object
    const player = add([
      sprite("thief"),
      pos(40, 20),
      area({ scale: 0.85 }),
      anchor("center"),
    ]);

    // Player movement - smooth keyboard and mouse controls
    const MOVE_SPEED = 200;
    const MOUSE_LERP_SPEED = 8; // Higher = faster mouse response
    let lastMousePos = mousePos();
    let targetPos = player.pos.clone();
    let usingMouse = false;

    player.onUpdate(() => {
      let keyPressed = false;
      const currentMousePos = mousePos();
      const deltaTime = dt();

      // Check for keyboard input first
      if (isKeyDown("left") || isKeyDown("a")) {
        player.move(-MOVE_SPEED, 0);
        keyPressed = true;
        usingMouse = false;
      }
      if (isKeyDown("right") || isKeyDown("d")) {
        player.move(MOVE_SPEED, 0);
        keyPressed = true;
        usingMouse = false;
      }
      if (isKeyDown("up") || isKeyDown("w")) {
        player.move(0, -MOVE_SPEED);
        keyPressed = true;
        usingMouse = false;
      }
      if (isKeyDown("down") || isKeyDown("s")) {
        player.move(0, MOVE_SPEED);
        keyPressed = true;
        usingMouse = false;
      }

      // Mouse movement detection
      const mouseMoved = lastMousePos.dist(currentMousePos) > 3;
      const mouseInBounds = currentMousePos.x >= 0 && currentMousePos.x <= width() &&
                           currentMousePos.y >= 0 && currentMousePos.y <= height();

      // Switch to mouse mode if mouse moved and no keys pressed
      if (!keyPressed && mouseMoved && mouseInBounds) {
        usingMouse = true;
        targetPos = currentMousePos.clone();
      }

      // Smooth mouse movement using lerp
      if (usingMouse && !keyPressed) {
        const distance = player.pos.dist(targetPos);
        if (distance > 2) {
          player.pos = player.pos.lerp(targetPos, MOUSE_LERP_SPEED * deltaTime);
        }
      }

      // Update last mouse position
      if (mouseMoved) {
        lastMousePos = currentMousePos.clone();
      }

      // Keep player within screen bounds
      player.pos.x = Math.max(0, Math.min(width(), player.pos.x));
      player.pos.y = Math.max(0, Math.min(height(), player.pos.y));
    });

    // game over if player eats a trap (only when game started)
    player.onCollide("trap", () => {
      if (gameStarted) {
        go("lose", score, "thief");
        addKaboom(player.pos, { scale: 0.5 });
        // play("hit");
      }
    });

    // move the obstacle every frame, destroy it if far outside of screen (only when game started)
    onUpdate("obstacle", (obstacle) => {
      if (gameStarted) {
        obstacle.move(-obstacle.speed, 0);
        if (obstacle.pos.x < -120) {
          destroy(obstacle);
        }
      }
    });

		// game over if coin goes off left side of screen
    // onUpdate("coin", (coin) => {
    //   if (coin.pos.x <= 0) {
    //     go("lose", score, "thief");
    //     // play("hit");
    //     addKaboom(coin.pos);
    //   }
    // });

    // score counter
    let score = 0;

    const scoreLabel = add([
      text(score, {
        font: "unscii",
        size: 16,
      }),
      pos(12, 12),
    ]);

    // increment score if player eats a coin (only when game started)
    player.onCollide("coin", (coin) => {
      if (gameStarted) {
        score += 1;
        destroy(coin);
        scoreLabel.text = score;
        burp();
        shake(6);
      }
    });

    // spawn obstacles every 0.3 seconds (only when game started)
    loop(0.3, () => {
      if (!gameStarted) return;

      // Calculate speed multiplier based on time elapsed (gradually increases)
      const elapsedTime = time() - gameStartTime;
      const speedMultiplier = 1 + (elapsedTime * 0.05); // 5% increase every second
      const currentSpeedMin = SPEED_MIN * speedMultiplier;
      const currentSpeedMax = SPEED_MAX * speedMultiplier;

      // spawn from right side of the screen
      const x = width() + 12;
      // spawn from a random y position
      const y = rand(0, height());
      // get a random speed (now increases over time)
      const speed = rand(currentSpeedMin, currentSpeedMax);
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

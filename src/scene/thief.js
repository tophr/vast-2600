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

    // game over if player eats a trap
    player.onCollide("trap", () => {
      go("lose", score, "thief");
      addKaboom(player.pos, { scale: 0.5 });
      // play("hit");
    });

    // move the obstacle every frame, destroy it if far outside of screen
    onUpdate("obstacle", (obstacle) => {
      obstacle.move(-obstacle.speed, 0);
      if (obstacle.pos.x < -120) {
        destroy(obstacle);
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

    // increment score if player eats a coin
    player.onCollide("coin", (coin) => {
      score += 1;
      destroy(coin);
      scoreLabel.text = score;
      burp();
      shake(6);
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

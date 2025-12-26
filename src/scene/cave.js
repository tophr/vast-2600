import { createInstructionSystem } from "../utils/instructions.js";

export default function sceneCave() {
  scene("caveScene", ({ levelIndex, score, lives }) => {
    const purple = [148, 41, 239];
    const lightpurple = [255, 180, 255];

    // Create instruction system only for first level
    const isGameStarted = levelIndex === 0 ? createInstructionSystem("Move left and right to collapse the cave and collect 5 crystals!", "Press SPACEBAR or ENTER to start") : () => true; // For subsequent levels, game starts immediately

    // Bg
    add([
      rect(width(), height()),
      pos(0, 0),
      // area(),
      // body({ isStatic: true }),
      color(purple),
    ]);

    // levels
    const LEVELS = [
      // [
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "                    ",
      //   "          .         ",
      //   "          @         ",
      // ],
      // [
      //   "xxxxxxxxxxxxxxxxxxxx",
      //   "xxxxx   xxx  xx xxxx",
      //   "xxxx     xx      xxx",
      //   "xxx       x       xx",
      //   "xx                 x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x                  x",
      //   "x         .        x",
      //   "x                  x",
      //   "x         @        x",
      // ],
      // [
      //   "xxxxxxxxxxxxxxxxxxxx",
      //   "xxxxxaaaaxxaaaxaxxxx",
      //   "xxdxddddddxddddddxxx",
      //   "xccccccccccccccccccx",
      //   "xbbbbbbbbbbbbbbbbbbx",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "xaaaaaaaaaaaaaaaaaax",
      //   "x         .        x",
      //   "x                  x",
      //   "x         @        x",
      // ],
      ["xxxxxxxxxxxxxxxxxxxx", "xxxxxxxxxxxxxxxxxxxx", "xxxxxaaaaxxaaaxaxxxx", "xxdxddddddxddddddxxx", "xxccccccccccccccccxx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xxa a a a a a a a xx", "xx                xx", "xx        .       xx", "x                  x", "x        @         x"],
    ];

    const level = addLevel(LEVELS[levelIndex], {
      tileWidth: 16,
      tileHeight: 8,
      tiles: {
        a: () => [
          // block
          rect(32, 16),
          color(0, 0, 0),
          area(),
          "block",
          {
            points: 1,
          },
        ],
        b: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          // area({ scale: 0.9 }),
          // "block",
          "wall",
          {
            points: 2,
          },
        ],
        c: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          // area({ scale: 0.9 }),
          // "block",
          "wall",
          {
            points: 4,
          },
        ],
        d: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          // area({ scale: 0.9 }),
          // "block",
          "wall",
          {
            points: 8,
          },
        ],
        x: () => [
          // wall - no collision area, handled by edge detection
          rect(16, 8),
          color(126, 35, 203),
          "wall",
        ],
        "@": () => [
          // paddle
          rect(32, 8),
          color(lightpurple),
          area(),
          anchor("center"),
          "paddle",
          {
            speed: 400,
          },
        ],
        ".": () => [
          // ball
          // color(WHITE),
          color(lightpurple),
          rect(4, 4),
          area(),
          anchor("center"),
          "ball",
          {
            hspeed: 100,
            vspeed: 50,
          },
        ],
      },
    });

    // player's paddle
    const paddle = level.get("paddle")[0];
    // console.log(paddle);

    // ball
    let speed = 120;

    // Paddle movement - keyboard takes priority, mouse as fallback
    let lastMouseX = mousePos().x;
    let usingKeyboard = false;

    let gameInitialized = false;

    // Game initialization function - called when instructions are dismissed
    function initializeGame() {
      onUpdate(() => {
        let keyPressed = false;

        // Check for keyboard input first
        if (isKeyDown("left") || isKeyDown("a")) {
          paddle.move(-paddle.speed, 0);
          keyPressed = true;
          usingKeyboard = true;
        }
        if (isKeyDown("right") || isKeyDown("d")) {
          paddle.move(paddle.speed, 0);
          keyPressed = true;
          usingKeyboard = true;
        }

        // If no keys pressed, use mouse position (with delay to prevent snapping)
        if (!keyPressed) {
          // Small delay before switching to mouse to prevent snapping
          if (usingKeyboard) {
            usingKeyboard = false;
            lastMouseX = mousePos().x; // Reset mouse tracking to current position
          } else {
            const currentMouseX = mousePos().x;
            const mouseMoved = Math.abs(currentMouseX - lastMouseX) > 5;

            if (mouseMoved && currentMouseX > 0 && currentMouseX < width()) {
              const paddleLeft = paddle.pos.x - 16;
              const paddleRight = paddle.pos.x + 16;

              if (currentMouseX < paddleLeft) {
                paddle.move(-paddle.speed, 0);
              } else if (currentMouseX > paddleRight) {
                paddle.move(paddle.speed, 0);
              }
            }
            lastMouseX = currentMouseX;
          }
        }

        // Keep paddle within screen bounds
        paddle.pos.x = Math.max(16, Math.min(width() - 16, paddle.pos.x));
      });

      // optimized ball movement - use simple position checks instead of worldArea()
      onUpdate("ball", (ball) => {
        // bounce off screen edges using simple position checks
        const edge = 36;
        if (ball.pos.x <= edge || ball.pos.x >= width() - edge) {
          ball.hspeed = -ball.hspeed;
          ball.pos.x = Math.max(edge, Math.min(width() - edge, ball.pos.x)); // keep in bounds
        }

        if (ball.pos.y <= edge) {
          ball.vspeed = -ball.vspeed;
          ball.pos.y = edge;
        }

        // fall off screen
        if (ball.pos.y > height()) {
          lives -= 1;
          if (lives <= 0) {
            go("lose", score, "cave");
          } else {
            ball.pos.x = width() / 2;
            ball.pos.y = height() - 32;
            ball.hspeed = Math.abs(ball.hspeed) * (Math.random() > 0.5 ? 1 : -1); // randomize direction
          }
        }

        // move
        ball.move(ball.hspeed, ball.vspeed);
      });

      // move ball, bounce it when touches vertical edges, respawn when touch horizontal edges
      // onUpdate("ball", (ball) => {
      //   ball.move(ball.vel.scale(speed));
      //   if (ball.pos.x < 0 || ball.pos.x > width()) {
      //     ball.vel.x = -ball.vel.x;
      //   }
      //   // fall off screen
      //   if (ball.pos.y < 0 || ball.pos.y > height()) {
      //     lives -= 1;
      //     if (lives <= 0) {
      //       go("lose", score, "cave");
      //     } else {
      //       ball.pos = center();
      //       ball.vel = Vec2.fromAngle(rand(-20, 20));
      //       speed = 130;
      //     }
      //   }
      // });

      // simplified paddle collision only
      let lastPaddleHit = 0;
      onCollide("ball", "paddle", (ball, paddle) => {
        // Paddle collision with angle based on hit position
        const hitPos = (ball.pos.x - paddle.pos.x) / 32; // -0.5 to 0.5
        ball.hspeed = hitPos * 150; // add horizontal component based on hit position
        ball.vspeed = -Math.abs(ball.vspeed); // always bounce up

        // Throttle sound to prevent audio bottleneck
        // if (time() - lastPaddleHit > 0.1) {
        //   play("powerup2");
        //   lastPaddleHit = time();
        // }
      });

      let lastBlockHit = 0;
      onCollide("ball", "block", (ball, block) => {
        // Simple vertical bounce for blocks
        ball.vspeed = -ball.vspeed;

        block.destroy();
        score += block.points;

        // Throttle explosion sound
        if (time() - lastBlockHit > 0.05) {
          // play("explosion");
          lastBlockHit = time();
        }

        // level end check (less frequent)
        if (Math.random() < 0.1) {
          // only check 10% of the time
          if (level.get("block").length === 0) {
            // next level
            if (levelIndex < LEVELS.length) {
              go("caveScene", {
                levelIndex: levelIndex + 1,
                score: score,
                lives: lives,
              });
            } else {
              // win
              go("win", score, "cave");
            }
          }
        }

        // powerups (reduced chance for performance)
        if (chance(0.1)) {
          // extra life
          add([
            sprite("crystal"),
            pos(block.pos),
            area({ scale: 0.6 }),
            anchor("center"),
            "powerup",
            {
              speed: 80,
              effect() {
                lives++;
              },
            },
          ]);
        }
      });

      // powerups
      let crystals = 0;
      onUpdate("powerup", (powerup) => {
        powerup.move(0, powerup.speed);
      });

      paddle.onCollide("powerup", (powerup) => {
        powerup.effect();
        powerup.destroy();
        crystals++;
        // play("powerup");
        if (crystals == 5) {
          go("win", "WIN!", "cave");
        }
      });

      // ui draw
      onDraw(() => {
        drawText({
          text: `SCORE: ${score}`,
          size: 8,
          pos: vec2(8, 8),
          font: "unscii",
          color: WHITE,
        });
        drawText({
          text: `LIVES: ${lives}`,
          size: 8,
          pos: vec2(width() - 8, 8),
          font: "unscii",
          anchor: "topright",
          align: "right",
          color: WHITE,
        });
        drawText({
          text: `CRYSTALS: ${crystals}`,
          size: 8,
          pos: vec2(width() / 2, 8),
          font: "unscii",
          anchor: "center",
          align: "center",
          color: WHITE,
        });
      });

      // play music
      // const music = play("music");
      // music.loop();
    }

    // Wait for instructions to be dismissed before initializing game
    onUpdate(() => {
      if (!gameInitialized && isGameStarted()) {
        gameInitialized = true;
        initializeGame();
      }
    });
  });
}

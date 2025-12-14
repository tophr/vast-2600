export default function sceneCave() {
  // sounds
  loadSound("blockbreak", "Explosion5.ogg");
  loadSound("paddlehit", "Powerup20.ogg");
  loadSound("powerup", "Powerup2.ogg");
  loadSound("ArcadeOddities", "Arcade-Oddities.mp3");

  scene("caveScene", ({ levelIndex, score, lives }) => {
    const purple = [148, 41, 239];
    const lightpurple = [255, 180, 255];

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
      [
        "xxxxxxxxxxxxxxxxxxxx",
        "xxxxxaaaaxxaaaxaxxxx",
        "xxdxddddddxddddddxxx",
        "xccccccccccccccccccx",
        "xbbbbbbbbbbbbbbbbbbx",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "xaaaaaaaaaaaaaaaaaax",
        "x         .        x",
        "x                  x",
        "x         @        x",
      ],
    ];

    const level = addLevel(LEVELS[levelIndex], {
      tileWidth: 16,
      tileHeight: 8,
      tiles: {
        a: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          area(),
          "block",
          "bouncy",
          {
            points: 1,
          },
        ],
        b: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          area(),
          "block",
          "bouncy",
          {
            points: 2,
          },
        ],
        c: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          area(),
          "block",
          "bouncy",
          {
            points: 4,
          },
        ],
        d: () => [
          // block
          rect(16, 8),
          color(0, 0, 0),
          area(),
          "block",
          "bouncy",
          {
            points: 8,
          },
        ],
        x: () => [
          // wall
          rect(16, 8),
          color(126, 35, 203),
          area(),
          // tile({ isObstacle: true }),
          // body({ isStatic: true }),
          "bouncy",
          "wall",
        ],
        "@": () => [
          // paddle
          rect(32, 8),
          color(lightpurple),
          area(),
          // body(),
          anchor("center"),
          "paddle",
          "bouncy",
          {
            speed: 400,
          },
        ],
        ".": () => [
          // ball
          color(WHITE),
          rect(4, 4),
          area(),
          body(),
          anchor("center"),
          "ball",
          {
            hspeed: 100,
            vspeed: 50,
            // vel: Vec2.fromAngle(rand(-20, 20)),
          },
        ],
      },
    });

    // player's paddle
    const paddle = level.get("paddle")[0];
    // console.log(paddle);

    // ball
    let speed = 120;

    // mouse controls
    onUpdate(() => {
      if (
        mousePos().x > 0 &&
        mousePos().x < width() &&
        mousePos().y > 0 &&
        mousePos().y < height()
      ) {
        const pp1x = paddle.worldArea()["pts"][0]["x"]; //paddle.worldArea().p1.x;
        const pp2x = paddle.worldArea()["pts"][1]["x"]; //paddle.worldArea().p2.x;
        if (mousePos().x < pp1x) {
          // left
          paddle.move(-paddle.speed, 0);
        } else if (mousePos().x > pp2x) {
          // right
          paddle.move(paddle.speed, 0);
        }
      }
    });

    // ball movement
    onUpdate("ball", (ball) => {
      // bounce off screen edges
      // console.log(ball.worldArea()['pts'][0]['x']);
      const p1x = ball.worldArea()["pts"][0]["x"]; // ball.worldArea().p1.x
      const p2x = ball.worldArea()["pts"][1]["x"]; // ball.worldArea().p2.x
      const p1y = ball.worldArea()["pts"][0]["y"]; // ball.worldArea().p1.y
      if (p1x < 16 || p2x > width() - 16) {
        ball.hspeed = -ball.hspeed;
      }

      if (p1y < 16) {
        ball.vspeed = -ball.vspeed;
      }

      // fall off screen
      if (ball.pos.y > height()) {
        lives -= 1;
        if (lives <= 0) {
          go("lose", score, "cave");
        } else {
          ball.pos.x = width() / 2;
          ball.pos.y = height() - 32;
        }
      }

      // move
      ball.move(ball.hspeed, ball.vspeed);
      // ball.move(ball.vel.scale(speed));
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

    // collisions
    onCollide("ball", "bouncy", (ball, bouncy) => {
      // speed += 10
      // ball.vel = Vec2.fromAngle(ball.pos.angle(bouncy.pos));

      ball.vspeed = -ball.vspeed;

      // if (bouncy.is("wall")) {
        // console.log("hit");
        // ball.hspeed = -ball.hspeed;
        // ball.vspeed = -ball.vspeed;
      //   speed += 10
      //   ball.vel = Vec2.fromAngle(ball.pos.angle(bouncy.pos))
      // } else {
      //   ball.vspeed = -ball.vspeed;
      // }

      if (bouncy.is("paddle")) {
        // play sound
        play("paddlehit");
      }
    });

    onCollide("ball", "block", (ball, block) => {
      block.destroy();
      score += block.points;
      play("blockbreak");

      // level end
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

      // powerups
      if (chance(0.05)) {
        // extra life
        add([
          sprite("crystal"),
          pos(block.pos),
          area(),
          anchor("center"),
          offscreen({ destroy: true }),
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
      play("powerup");
      if ( crystals == 5 ) {
         go("win", "WIN!", "cave");
      }
    });

    // ui
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
    const music = play("ArcadeOddities");
    // music.loop();
  });
}

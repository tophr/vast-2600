import { createInstructionSystem } from "../utils/instructions.js";

export default function sceneGoblin() {
  scene("goblinScene", ({levelIndex, score, lives}) => {
    const SPEED = 160;
    const ENEMY_SPEED = 160;
    const BULLET_SPEED = 400; //800;
    const purple = [148, 41, 239];

    // Create instruction system
    const isGameStarted = createInstructionSystem(
      "Smash 5 crystals and avoid getting slain by the knight or dragon!",
      "Press SPACEBAR or ENTER to start"
    );

    // character dialog data
    const characters = {
      a: {
        sprite: "dragon",
        msg: "Rawr! You've awoken me from my slumber!",
      },
      b: {
        sprite: "knight",
        msg: "Who are you? You can see me??",
      },
    };

    // level layouts
    const LEVELS = [
      [
        "====|=====",
        "=        =",
        "= $      =",
        "=     a  =",
        "=   @    =",
        "==========",
      ],
      [
        "----------",
        "-    $   -",
        "|        -",
        "-     b  -",
        "-   @    -",
        "----------",
      ],
    ];

    const level = addLevel(LEVELS[levelIndex], {
      tileWidth: 32,
      tileHeight: 32,
      pos: vec2(16, 16),
      tiles: {
        "=": () => [
          // sprite("grass"),
          area(),
          // scale(0.5),
          rect(32, 32),
          color(purple),
          outline(2),
          body({ isStatic: true }),
          anchor("center"),
        ],
        "-": () => [
          // sprite("steel"),
          area(),
          // scale(0.5),
          rect(32, 32),
          color(255, 180, 255),
          outline(2),
          body({ isStatic: true }),
          anchor("center"),
        ],
        $: () => [
          sprite("key"),
          area(),
          // scale(0.5),
          anchor("center"),
          "key"
        ],
        "@": () => [
          sprite("goblin"),
          area(),
          body(),
          anchor("center"),
          "player",
        ],
        "|": () => [
          sprite("dooroutline"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "door",
        ],
        "x": () => [
          sprite("ghosty"),
          area(),
          scale(0.5),
          anchor("center"),
          "opendoor",
        ],
      },
      // any() is a special function that gets called everytime there's a
      // symbole not defined above and is supposed to return what that symbol
      // means
      wildcardTile(ch) {
        const char = characters[ch];
        if (char) {
          return [
            sprite(char.sprite),
            area(),
            // body({ isStatic: true }),
            anchor("center"),
            // state("move", [ "idle", "attack", "move" ]),
            state("idle", [ "idle", "attack" ]),
            "character",
            { msg: char.msg },
          ];
        }
      },
    });

    // get the player game obj by tag
    const player = level.get("player")[0];

    function addDialog() {
      const h = 40;
      const pad = 16;
      const bg = add([
        pos(0, height() - h),
        rect(width(), h),
        color(0, 0, 0),
        z(100),
      ]);
      const txt = add([
        text("", {
          width: width(),
          font: "unscii",
          size: 8,
        }),
        pos(0 + pad, height() - h + pad),
        z(100),
      ]);
      bg.hidden = true;
      txt.hidden = true;
      return {
        say(t) {
          txt.text = t;
          bg.hidden = false;
          txt.hidden = false;
        },
        dismiss() {
          if (!this.active()) {
            return;
          }
          txt.text = "";
          bg.hidden = true;
          txt.hidden = true;
        },
        active() {
          return !bg.hidden;
        },
        destroy() {
          bg.destroy();
          txt.destroy();
        },
      };
    }

    let hasKey = false;
    let gameInitialized = false;
    const dialog = addDialog();

    // Game initialization function - called when instructions are dismissed
    function initializeGame() {
      player.onCollide("key", (key) => {
        destroy(key);
        hasKey = true;
      });

      player.onCollide("door", () => {
        if (hasKey) {
          if (levelIndex + 1 < LEVELS.length) {
            go("goblinScene", {
              levelIndex: levelIndex + 1,
              score: score,
              lives: lives,
            });
          } else {
            go("win", "YOU WIN", "goblin");
          }
        } else {
          dialog.say("you got no key!");
        }
      });

      player.onCollide("opendoor", () => {
        // if (levelIndex + 1 < LEVELS.length) {
          go("goblinScene", {
              levelIndex: levelIndex - 1,
              score: score,
              lives: lives,
            });
        // }
      });

      // talk on touch
      player.onCollide("character", (ch) => {
        dialog.say(ch.msg);
      });

      // Run the callback once every time we enter "idle" state.
      // Here we stay "idle" for 0.5 second, then enter "attack" state.
      const enemy = level.get("character")[0];

      if (enemy) {
        enemy.onStateEnter("idle", async () => {
          await wait(0.5);
          enemy.enterState("attack");
        });

        // When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
        enemy.onStateEnter("attack", async () => {
          // Don't do anything if player doesn't exist anymore
          if (player.exists()) {
            const dir = player.pos.sub(enemy.pos).unit();

            add([
              pos(enemy.pos),
              move(dir, BULLET_SPEED),
              rect(6, 6),
              area(),
              offscreen({ destroy: true }),
              anchor("center"),
              color(234, 80, 36),
              "bullet",
            ]);
          }
          await wait(1);
          enemy.enterState("idle");
        });

        enemy.onStateEnter("move", async () => {
          await wait(2);
          enemy.enterState("idle");
        });

        // Start the state machine by manually entering idle state
        enemy.enterState("idle");

        // Like .onUpdate() which runs every frame, but only runs when the current state is "move"
        // Here we move towards the player every frame if the current state is "move"
        enemy.onStateUpdate("move", () => {
          if (!player.exists()) return;
          const dir = player.pos.sub(enemy.pos).unit();
          enemy.move(dir.scale(ENEMY_SPEED));
        });
      }

      // Taking a bullet makes us disappear
      player.onCollide("bullet", (bullet) => {
        destroy(bullet)
        destroy(player)
        addKaboom(bullet.pos)
         // go("lose", score);
         go("lose", "YOU LOSE", "goblin");
      });

      const dirs = {
        left: LEFT,
        right: RIGHT,
        up: UP,
        down: DOWN,
        a: LEFT,
        d: RIGHT,
        w: UP,
        s: DOWN,
      };

      // Mouse navigation - move towards clicked position
      let targetPos = null;

      onMousePress(() => {
        dialog.dismiss();
        targetPos = mousePos();
      });

      // Move towards target position if one is set
      onUpdate(() => {
        if (targetPos && player.exists()) {
          const direction = targetPos.sub(player.pos);
          const distance = direction.len();

          // If we're close enough to the target, stop moving
          if (distance < 5) {
            targetPos = null;
          } else {
            // Move towards the target
            const moveVector = direction.unit().scale(SPEED);
            player.move(moveVector);
          }
        }
      });

      // Keyboard controls (existing)
      for (const dir in dirs) {
        onKeyPress(dir, () => {
          dialog.dismiss();
          // Clear mouse target when using keyboard
          targetPos = null;
        });
        onKeyDown(dir, () => {
          player.move(dirs[dir].scale(SPEED));
        });
      }
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

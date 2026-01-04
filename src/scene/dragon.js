import { createInstructionSystem } from "../utils/instructions.js";

export default function sceneDragon(floorHeight) {
  const purple = [148, 41, 239];

  scene("dragonScene", () => {
    // define gravity
    setGravity(1600);

    // Create instruction system
    const isGameStarted = createInstructionSystem("Press SPACEBAR to fly and escape the cave!", "Press SPACEBAR or ENTER to start");

    const CAVE_OPEN = 100; //65; //95
    const CAVE_MIN = 80; //50;
    const JUMP_FORCE = 300;
    const SPEED = 280;
    const CEILING = -30;

    let dragon = null;
    let score = 0;
    let scoreLabel = null;

    // Initialize all game mechanics when game starts
    function initializeGame() {
      if (dragon) return; // Already initialized

      // Create dragon with physics
      dragon = add([
        // sprite("dragon"),
        sprite("dragonflight", { anim: "fly" }),
        pos(width() / 4, 0),
        area(scale(0.75, 0.5)),
        anchor("center"),
        body(),
      ]);

      // dragon.flipX = true;

      // Create score display
      scoreLabel = add([
        text(score, {
          font: "unscii",
          size: 16,
        }),
        pos(12, 12),
        fixed(),
        z(100),
      ]);

      // Setup all game mechanics
      setupGameMechanics();
    }

    function setupGameMechanics() {
      // Death check
      onUpdate(() => {
        if (dragon && (dragon.pos.y >= height() || dragon.pos.y <= CEILING)) {
          go("lose", score, "dragon");
        }
      });

      // Dragon collision with caves
      dragon.onCollide("cave", () => {
        addKaboom(dragon.pos);
        wait(0.3, () => {
          go("lose", score, "dragon");
          // play("hit");
        });
      });

      // Cave scoring logic
      onUpdate("cave", (p) => {
        if (p.pos.x + p.width <= dragon.pos.x && p.passed === false) {
          addScore();
          p.passed = true;
        }
      });

      // Spawn caves every .75 sec
      loop(0.75, () => {
        spawnCave();
      });
    }

    // Jump controls - these check if game started and initialize if needed
    onKeyPress("enter", () => {
      if (isGameStarted()) {
        if (!dragon) initializeGame();
        dragon.jump(JUMP_FORCE);
        // play("wooosh");
      }
    });

    onKeyPress("space", () => {
      if (isGameStarted()) {
        if (!dragon) initializeGame();
        dragon.jump(JUMP_FORCE);
        // play("wooosh");
      }
    });

    onGamepadButtonPress("south", () => {
      if (isGameStarted()) {
        if (!dragon) initializeGame();
        dragon.jump(JUMP_FORCE);
        // play("wooosh");
      }
    });

    onClick(() => {
      if (isGameStarted()) {
        if (!dragon) initializeGame();
        dragon.jump(JUMP_FORCE);
        // play("wooosh");
      }
    });

    function spawnCave() {
      const h1 = rand(CAVE_MIN, height() - CAVE_MIN - CAVE_OPEN);
      const h2 = height() - h1 - CAVE_OPEN;
      const caveWidth = rand(32, 120); // cave width, was 32

      // Top cave
      add([
        pos(width(), 0),
        rect(caveWidth, h1),
        color(148, 41, 239),
        // outline(2),
        area(scale(0.8)),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "cave",
      ]);

      // Bottom cave
      add([
        pos(width(), h1 + CAVE_OPEN),
        rect(caveWidth, h2),
        color(148, 41, 239),
        // outline(2),
        area(),
        // area(scale(0.8)),
        // anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "cave",
        { passed: false },
      ]);

      // ceiling
      add([
        rect(width(), floorHeight),
        // outline(4),
        pos(0, 0),
        anchor("topleft"),
        area(),
        // body({ isStatic: true }),
        color(purple),
      ]);

      // floor
      add([
        rect(width(), floorHeight),
        // outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(purple),
      ]);
    }

    function addScore() {
      score++;
      if (scoreLabel) {
        scoreLabel.text = score;
      }
      // play("score");
    }
  });
}

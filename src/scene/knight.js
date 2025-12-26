import { createInstructionSystem } from "../utils/instructions.js";

export default function sceneKnight(floorHeight, jumpForce, speed) {
  const purple = [148, 41, 239];

  scene("knightScene", () => {
    // define gravity
    setGravity(1200);

    // Create instruction system
    const isGameStarted = createInstructionSystem(
      "Press SPACEBAR to jump and avoid obstacles to escape the cave!",
      "Press SPACEBAR or ENTER to start"
    );

    // add a game object to screen
    const player = add([
      // list of components
      sprite("knight"),
      pos(20, 10),
      area(),
      body(),
    ]);

    // floor
    add([
      rect(width(), floorHeight),
      outline(4),
      pos(0, height()),
      anchor("botleft"),
      area(),
      body({ isStatic: true }),
      color(purple),
    ]);

    function jump() {
      if (isGameStarted() && player.isGrounded()) {
        player.jump(jumpForce);
      }
    }

    // jump when user presses space (only when game started)
    onTouchStart(() => {
      if (isGameStarted()) jump();
    });
    onKeyPress("space", () => {
      if (isGameStarted()) jump();
    });
    onClick(() => {
      if (isGameStarted()) jump();
    });

    function spawnObstacle() {
      if (!isGameStarted()) {
        // Check again in a moment if game hasn't started
        wait(0.1, spawnObstacle);
        return;
      }

      // add obstacle obj
      add([
        rect(12, rand(8, 24)),
        area(),
        outline(1),
        pos(width(), height() - floorHeight),
        anchor("botleft"),
        color(255, 180, 255),
        move(LEFT, speed),
        "obstacle",
      ]);

      // wait a random amount of time to spawn next obstacle
      wait(rand(0.25, 1.25), spawnObstacle);
    }

    // start spawning obstacles
    spawnObstacle();

    // lose if player collides with any game obj with tag "obstacle" (only when game started)
    player.onCollide("obstacle", () => {
      if (isGameStarted()) {
        // go to "lose" scene and pass the score
        go("lose", score, "knight");
        burp();
        addKaboom(center());
      }
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
      text(score, {
        font: "unscii",
        size: 16,
      }),
      pos(12, 12),
    ]);

    // increment score every frame (only when game started)
    onUpdate(() => {
      if (isGameStarted()) {
        score++;
        scoreLabel.text = score;
      }
    });
  });
}

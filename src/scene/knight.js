export default function sceneKnight(floorHeight, jumpForce, speed) {
  const purple = [148, 41, 239];
  
  scene("knightScene", () => {
    // define gravity
    // gravity(1200);
    setGravity(1200);
    
    // Text bubble
    const textbox = add([
      rect(width() - 200, 60, { radius: 10 }),
      anchor("center"),
      pos(center().x, height() - 100),
      outline(2),
      color(0, 0, 0)
    ]);

    // Text
    const txtK = add([
      pos(textbox.pos),
      text("Press spacebar to avoid obstacles and escape the cave!", { 
        font: "unscii",
        size: 8,
        width: width() - 230, 
        align: "center",  
      }),
      anchor("center"),
      // color(0, 0, 0),
    ]);

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
      if (player.isGrounded()) {
        player.jump(jumpForce);
      }
    }

    // jump when user presses space
    onTouchStart(jump);
    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {
      // add tree obj
      add([
        rect(12, rand(8, 24)),
        area(),
        outline(1),
        pos(width(), height() - floorHeight),
        anchor("botleft"),
        color(255, 180, 255),
        move(LEFT, speed),
        "tree",
      ]);

      // wait a random amount of time to spawn next tree
      wait(rand(0.25, 1.25), spawnTree);
    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
      // go to "lose" scene and pass the score
      go("lose", score, "knight");
      burp();
      addKaboom(player.pos);
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

    // increment score every frame
    onUpdate(() => {
      score++;
      scoreLabel.text = score;
    });
  });
}

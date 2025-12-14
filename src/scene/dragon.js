export default function sceneDragon() {

  scene("dragonScene", () => {
    
  // define gravity
  setGravity(1600);
    
    const PIPE_OPEN = 65;
    const PIPE_MIN = 50;
    const JUMP_FORCE = 300;
    const SPEED = 280;
    const CEILING = -30;

    // a game object consists of a list of components and tags
    const dragon = add([
      sprite("dragon"),
      pos(width() / 4, 0),
      area(),
      body(),
    ]);
    
    dragon.flipX = true;

    // check for fall death
    dragon.onUpdate(() => {
      if (dragon.pos.y >= height() || dragon.pos.y <= CEILING) {
        // switch to "lose" scene
        go("lose", score, "dragon");
      }
    });

    // jump
    onKeyPress("space", () => {
      dragon.jump(JUMP_FORCE);
      // play("wooosh");
    });

    onGamepadButtonPress("south", () => {
      dragon.jump(JUMP_FORCE);
      // play("wooosh");
    });

    // mobile
    onClick(() => {
      dragon.jump(JUMP_FORCE);
      // play("wooosh");
    });

    function spawnPipe() {
      // calculate pipe positions
      const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN);
      const h2 = height() - h1 - PIPE_OPEN;

      add([
        pos(width(), 0),
        rect(32, h1),
        color(148, 41, 239),
        outline(2),
        area(),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        // give it tags to easier define behaviors see below
        "pipe",
      ]);

      add([
        pos(width(), h1 + PIPE_OPEN),
        rect(32, h2),
        color(148, 41, 239),
        outline(2),
        area(),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        // give it tags to easier define behaviors see below
        "pipe",
        // raw obj just assigns every field to the game obj
        { passed: false },
      ]);
    }

    // callback when dragon onCollide with objects with tag "pipe"
    dragon.onCollide("pipe", () => {
      go("lose", score, "dragon");
      // play("hit");
      addKaboom(dragon.pos);
    });

    // per frame event for all objects with tag 'pipe'
    onUpdate("pipe", (p) => {
      // check if dragon passed the pipe
      if (p.pos.x + p.width <= dragon.pos.x && p.passed === false) {
        addScore();
        p.passed = true;
      }
    });

    // spawn a pipe every 1 sec
    loop(.75, () => {
      spawnPipe();
    });

    let score = 0;

    // display score
    // const scoreLabel = add([
    //   text(score),
    //   anchor("center"),
    //   pos(width() / 2, 80),
    //   fixed(),
    //   z(100),
    // ]);
    
    const scoreLabel = add([
      text(score, {
        font: "unscii",
        size: 16,
      }),
      pos(12, 12),
      fixed(),
      z(100),
    ]);

    function addScore() {
      score++;
      scoreLabel.text = score;
      // play("score");
    }
  });
}

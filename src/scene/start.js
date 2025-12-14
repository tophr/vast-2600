export default function sceneStart() {
  scene("start", (initial) => {
    // let initial = true;
    setGravity(0);

    const title = add([
      sprite("title"),
      pos(center()),
      anchor("center"),
      opacity(0),
      scale(0.85),
    ]);

    const knight = add([sprite("knight"), pos(20, 10), area(), opacity(0), "char"]);

    const goblinPositions = [
      { x: 12, y: height() - 30 },
      { x: 34, y: height() - 20 },
      { x: 5, y: height() - 54 },
    ];

    const goblins = goblinPositions.map((position) =>
      add([
        sprite("goblin"),
        pos(position.x, position.y),
        anchor("botleft"),
        area(),
      opacity(0),
        "goblin",
        "char"
      ])
    );

    const thief = add([
      sprite("thief"),
      pos(width() - 55, 45),
      anchor("botright"),
      area(),
      opacity(0),
      "char"
    ]);

    const dragon = add([
      sprite("dragon"),
      pos(width() - 20, height()/2 + 10),
      anchor("botright"),
      area(),
      opacity(0),
      "char"
    ]);

    const cave = add([
      sprite("cave"),
      pos(width() - 12, height() - 20),
      anchor("botright"),
      area(),
      opacity(0),
      "char"
    ]);

    add([
      rect(width(), 10),
      area(),
      pos(0, height()),
      anchor("botleft"),
      color(148, 16, 0),
      opacity(0),
      "copyright"
    ]);

    const copyright = add([
      text("COPYRIGHT LEDER GAMES", {
        font: "unscii",
        size: 8,
      }),
      color(214, 82, 66),
      pos(width() / 2, height() - 1),
      anchor("bot"),
      opacity(0),
      "copyright"
    ]);

    // game start logic
    function characterSelect(charStr, char) {
      char.onHoverUpdate(() => {
        const t = time() * 10;
        char.color = rgb(
          wave(0, 255, t),
          wave(0, 255, t + 2),
          wave(0, 255, t + 4)
        );
      });
      char.onHoverEnd(() => {
        char.color = rgb(255, 255, 255);
      });
      char.onClick(() =>
        go(charStr + "Scene", {
          levelIndex: 0,
          score: 0,
          lives: 3,
        })
      );
    }
    
    // loading animation
    const chars = get("char");
    const copyrightBar = get("copyright");
    
    let timings;
    let duration = 2;
    
    if (initial === true) {
      timings = [0.5, 2.5, 4.5];
    } else {
      timings = [0, 0, 0];
      duration = 0.25;
    }
    
    console.log({initial});
    
    wait(timings[0], () => {
      tween(title.opacity, 1, duration, (p) => (title.opacity = p), easings.easeOut);
    });
    
    wait(timings[1], () => {
      chars.map((char) => tween(char.opacity, 1, duration, (p) => (char.opacity = p), easings.easeOut));
    });
    
    wait(timings[2], () => {
      copyrightBar.map((bar) => tween(bar.opacity, 1, duration, (p) => (bar.opacity = p), easings.easeOut));
    });
    
    // game start interactivity
    const charObj = { knight: knight, dragon: dragon, cave: cave, thief: thief };

    Object.keys(charObj).forEach((key) => {
      characterSelect(key, charObj[key]);
    });

    let goblinx = get("goblin");
    goblinx.map((goblin) => characterSelect("goblin", goblin));
  });
}

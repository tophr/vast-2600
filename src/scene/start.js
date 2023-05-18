export default function sceneStart() {
  scene("start", () => {
    setGravity(0);

    const title = add([
      sprite("title"),
      pos(center()),
      anchor("center"),
      opacity(0),
      scale(0.85),
    ]);

    wait(0.5, () => {
      // title.opacity = wave(0, 1, time(3));
      // tween(title.pos, mousePos(), 1, (p) => title.pos = p, easings.easeOutBounce)
      // ween(title.opacity, 1, 0, (p) => title.pos = p, easings.easeOutBounce)
      tween(title.opacity, 3, 1, (p) => (title.opacity = p), easings.easeOut);
    });

    const knight = add([sprite("knight"), pos(20, 10), area()]);

    const goblinPositions = [
      { x: 12, y: height() - 30 },
      { x: 34, y: height() - 20 },
      { x: 5, y: height() - 54 },
    ];

    const goblins = goblinPositions.map((position) =>
      add([sprite("goblin"), pos(position.x, position.y), anchor("botleft"), area(), "goblin"])
    );

    const thief = add([
      sprite("thief"),
      pos(width() - 55, 45),
      anchor("botright"),
      area()
    ]);

    const dragon = add([
      sprite("dragon"),
      pos(width() - 20, height() - 70),
      anchor("botright"),
      area()
    ]);

    const cave = add([
      sprite("cave"),
      pos(width() - 12, height() - 20),
      anchor("botright"),
      area()
    ]);

    add([
      rect(width(), 10),
      area(),
      pos(0, height()),
      anchor("botleft"),
      color(148, 16, 0),
    ]);

    const copyright = add([
      text("COPYRIGHT LEDER GAMES", {
        font: "unscii",
        size: 8,
      }),
      color(214, 82, 66),
      pos(width() / 2, height() - 1),
      anchor("bot"),
    ]);

    // wait(3, () => {
    // 	title.opacity(1);
    // });

    
    // game start logic
    function characterSelect(charStr, char) {
      // char.onHover(() => {
      //   char.opacity = 0.75
      //   // char.scale = 1.25
      // });
      // char.onHoverEnd(() => {
      //   char.opacity = 1
      //   // char.scale = 1
      // })
      char.onHoverUpdate(() => {
        const t = time() * 10
        char.color = rgb(
          wave(0, 255, t),
          wave(0, 255, t + 2),
          wave(0, 255, t + 4),
        )
      })
      // if (char == cave) {
      //   cave.onClick(() => go("caveScene", {
      //     levelIndex: 0,
      //     score: 0,
      //     lives: 3,
      //   }));
      // } else {
        char.onClick(() => go(charStr + "Scene", {
          levelIndex: 0,
          score: 0,
          lives: 3,
        }));
      // }
    }
    
    const chars = {"knight": knight, "dragon": dragon, "cave": cave, "thief": thief};
    
    Object.keys(chars).forEach((key) => {
      characterSelect(key, chars[key]);
    });
    
    let goblinx = get("goblin");
    goblinx.map((goblin) => characterSelect("goblin", goblin));
    
    // goblins[0].onClick(() => go("goblinScene", 0));
    
  });
}

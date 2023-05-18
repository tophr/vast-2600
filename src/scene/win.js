export default function sceneWin(){
  
  scene("win", (score, spriteArg) => {
    add([
      sprite(spriteArg),
      scale(2),
      pos(width() / 2, height() / 2 - 20),
      anchor("center"),
    ]);

    // display score
    add([
      text(score, {
        font: "unscii",
        size: 12,
      }),
      pos(width() / 2, height() / 2 + 20),
      scale(2),
      anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("enter", () => go("start"));
    onClick(() => go("start"));
  });
    
};

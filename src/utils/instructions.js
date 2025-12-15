// Reusable instruction system for game scenes
export function createInstructionSystem(instructions, controls = "Press SPACEBAR or ENTER to start") {
  // Text bubble
  const textbox = add([
    rect(width() - 180, 60, { radius: 10 }),
    anchor("center"),
    pos(center().x, height() - 100),
    outline(2),
    color(0, 0, 0),
    area(),
  ]);

  // Instruction text
  const instructionText = add([
    pos(textbox.pos),
    text(instructions, {
      font: "unscii",
      size: 8,
      width: width() - 200,
      align: "center",
    }),
    anchor("center"),
  ]);

  // Start text with blinking
  const startText = add([
    pos(center().x, textbox.pos.y + 60),
    text(controls, {
      font: "unscii",
      size: 8,
      align: "center",
    }),
    anchor("center"),
  ]);

  // Make start text blink slowly
  startText.onUpdate(() => {
    startText.opacity = wave(0.3, 1, time() * 2);
  });

  // Game state
  let gameStarted = false;

  // Dismiss instructions function
  function dismissInstructions() {
    if (!gameStarted) {
      gameStarted = true;
      destroy(textbox);
      destroy(instructionText);
      destroy(startText);
    }
  }

  // Dismiss on key press
  onKeyPress("space", dismissInstructions);
  onKeyPress("enter", dismissInstructions);

  // Dismiss on click
  textbox.onClick(dismissInstructions);

  // Return the game state checker
  return () => gameStarted;
}
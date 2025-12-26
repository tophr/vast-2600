// Reusable instruction system for game scenes
export function createInstructionSystem(instructions, controls = "Press SPACEBAR or ENTER to start") {
  // Create overlay background
  const selectOverlay = add([
    rect(width(), height()),
    color(0, 0, 0),
    opacity(0.6),
    pos(0, 0),
    z(99),
    "selectOverlay"
  ]);

  // Text bubble
  const textbox = add([
    rect(width() - 160, 60, { radius: 10 }),
    anchor("center"),
    pos(center().x, height() - 100),
    outline(2),
    color(0, 0, 0),
    area(),
    z(100),
  ]);

  // Instruction text
  const instructionText = add([
    pos(textbox.pos),
    text(instructions, {
      font: "unscii",
      size: 8,
      width: width() - 180,
      align: "center",
    }),
    anchor("center"),
    z(101),
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
    z(101),
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
      destroy(selectOverlay);
      destroy(textbox);
      destroy(instructionText);
      destroy(startText);
      console.log("Game Started!");
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
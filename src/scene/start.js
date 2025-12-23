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

    // Character select modal system
    let characterSelectOpen = false;
    let selectedCharacterIndex = 0;
    let selectOverlay = null;
    let selectCharacters = [];
    let selectionArrow = null;

    const characterOptions = [
      { name: "knight", sprite: "knight" },
      { name: "goblin", sprite: "goblin" },
      { name: "dragon", sprite: "dragon" },
      { name: "cave", sprite: "cave" },
      { name: "thief", sprite: "thief" }
    ];

    function openCharacterSelect() {
      if (characterSelectOpen) return;
      characterSelectOpen = true;

      // Create overlay background
      selectOverlay = add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.8),
        pos(0, 0),
        z(1000),
        "selectOverlay"
      ]);

      // Create character select box
      const boxWidth = 280;
      const boxHeight = 120;
      const boxX = width() / 2 - boxWidth / 2;
      const boxY = height() / 2 - boxHeight / 2;

      add([
        rect(boxWidth, boxHeight),
        color(60, 60, 60),
        outline(2),
        pos(boxX, boxY),
        z(1001),
        "selectOverlay"
      ]);

      // Add title
      add([
        text("SELECT CHARACTER", {
          font: "unscii",
          size: 12,
        }),
        color(255, 255, 255),
        pos(width() / 2, boxY + 20),
        anchor("center"),
        z(1002),
        "selectOverlay"
      ]);

      // Create character sprites in select screen
      const charSpacing = 45;
      const startX = width() / 2 - (characterOptions.length - 1) * charSpacing / 2;
      const charY = height() / 2 + 10;

      selectCharacters = characterOptions.map((char, index) => {
        const charSprite = add([
          sprite(char.sprite),
          pos(startX + index * charSpacing, charY),
          anchor("center"),
          scale(0.8),
          area(),
          z(1002),
          "selectOverlay"
        ]);

        // Add click handler
        charSprite.onClick(() => {
          selectedCharacterIndex = index;
          selectCharacter();
        });

        // Add hover effects
        charSprite.onHoverUpdate(() => {
          if (selectedCharacterIndex !== index) {
            const t = time() * 10;
            charSprite.color = rgb(
              wave(0, 255, t),
              wave(0, 255, t + 2),
              wave(0, 255, t + 4)
            );
          }
        });

        charSprite.onHoverEnd(() => {
          if (selectedCharacterIndex !== index) {
            charSprite.color = rgb(255, 255, 255);
          }
        });

        charSprite.onHover(() => {
          selectedCharacterIndex = index;
          updateCharacterSelection();
        });

        return { sprite: charSprite, name: char.name };
      });

      // Create selection arrow
      selectionArrow = add([
        text("^", {
          font: "unscii",
          size: 8,
        }),
        color(255, 255, 0),
        pos(0, 0),
        anchor("center"),
        z(1002),
        "selectOverlay"
      ]);

      updateCharacterSelection();
    }

    function closeCharacterSelect() {
      if (!characterSelectOpen) return;
      characterSelectOpen = false;

      // Remove all overlay elements
      get("selectOverlay").forEach(obj => obj.destroy());
      selectOverlay = null;
      selectCharacters = [];
      selectionArrow = null;
    }

    function updateCharacterSelection() {
      if (!characterSelectOpen) return;

      // Reset all character colors and scales
      selectCharacters.forEach((char, index) => {
        if (index !== selectedCharacterIndex) {
          char.sprite.color = rgb(255, 255, 255);
          // char.sprite.scale = vec2(0.8, 0.8);
        }
      });

      // Position arrow beneath selected character
      if (selectCharacters[selectedCharacterIndex] && selectionArrow) {
        selectionArrow.pos = vec2(
          selectCharacters[selectedCharacterIndex].sprite.pos.x,
          selectCharacters[selectedCharacterIndex].sprite.pos.y + 25
        );
      }
    }

    // Continuous animation for selected character
    onUpdate(() => {
      if (characterSelectOpen && selectCharacters[selectedCharacterIndex]) {
        const t = time() * 12;
        const pulse = wave(0.85, 1.0, t * 0.6);
        selectCharacters[selectedCharacterIndex].sprite.color = rgb(
          wave(150, 255, t),
          wave(150, 255, t + 2),
          wave(150, 255, t + 4)
        );
        // selectCharacters[selectedCharacterIndex].sprite.scale = vec2(0.8 * pulse, 0.8 * pulse);
      }
    });

    function selectCharacter() {
      if (!characterSelectOpen) return;

      const selectedChar = selectCharacters[selectedCharacterIndex];
      if (selectedChar) {
        closeCharacterSelect();
        go(selectedChar.name + "Scene", {
          levelIndex: 0,
          score: 0,
          lives: 3,
        });
      }
    }

    function navigateLeft() {
      if (!characterSelectOpen) return;
      selectedCharacterIndex = (selectedCharacterIndex - 1 + characterOptions.length) % characterOptions.length;
      updateCharacterSelection();
    }

    function navigateRight() {
      if (!characterSelectOpen) return;
      selectedCharacterIndex = (selectedCharacterIndex + 1) % characterOptions.length;
      updateCharacterSelection();
    }

    // loading animation
    const chars = get("char");
    const copyrightBar = get("copyright");

    let timings;
    let duration = 2;
    let skipped = false;

    if (initial === true) {
      timings = [0.5, 2.5, 4.5];
    } else {
      timings = [0, 0, 0];
      duration = 0.25;
    }

    // Skip animation on escape key
    onKeyPress("escape", () => {
      if (!skipped) {
        skipped = true;
        // Immediately show all elements
        title.opacity = 1;
        chars.forEach(char => char.opacity = 1);
        copyrightBar.forEach(bar => bar.opacity = 1);
      }
    });

    console.log({initial});

    wait(timings[0], () => {
      tween(title.opacity, 1, duration, (p) => (title.opacity = p), easings.easeOut);
    });

    wait(timings[1], () => {
      chars.map((char) => tween(char.opacity, 1, duration, (p) => (char.opacity = p), easings.easeOut));
    });

    wait(timings[2], () => {
      copyrightBar.map((bar) => tween(bar.opacity, 1, duration, (p) => (bar.opacity = p), easings.easeOut));

      // Set up character select after loading animation completes
      wait(duration, () => {
        // Click anywhere to open character select
        onClick(() => {
          openCharacterSelect();
        });

        // Keyboard controls for opening character select and navigation
        onKeyPress("enter", () => {
          if (characterSelectOpen) {
            selectCharacter();
          } else {
            openCharacterSelect();
          }
        });

        onKeyPress("space", () => {
          if (characterSelectOpen) {
            selectCharacter();
          } else {
            openCharacterSelect();
          }
        });

        // Navigation controls
        onKeyPress("left", navigateLeft);
        onKeyPress("right", navigateRight);
        onKeyPress("a", navigateLeft);
        onKeyPress("d", navigateRight);

        // Close character select with escape
        onKeyPress("escape", () => {
          if (characterSelectOpen) {
            closeCharacterSelect();
          }
        });
      });
    });
  });
}

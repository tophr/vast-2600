// import kaboom lib
// import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import sceneStart from "./scene/start.js";
import sceneKnight from "./scene/knight.js";
import sceneGoblin from "./scene/goblin.js";
import sceneDragon from "./scene/dragon.js";
import sceneCave from "./scene/cave.js";
import sceneThief from "./scene/thief.js";
import sceneLose from "./scene/lose.js";
import sceneWin from "./scene/win.js";

const FLOOR_HEIGHT = 12;
const JUMP_FORCE = 400;
const SPEED = 260;

const grey = [20, 20, 20];
const purple = [148, 41, 239];

// initialize context
kaboom({
  background: grey,
  width: 320, //768, //320,
  height: 192, //360, //192,
  scale: 3,
  // stretch: true,
  // letterbox: true,
});

loadRoot("https://cdn.glitch.global/bcb76e3d-7950-4d40-a1ce-81f364667239/");

loadShaderURL("crt", null, "crt.frag");

// usePostEffect("crt", {
//   u_flatness: 3,
// });

// load custom bitmap font, specifying the width and height of each character in the image
loadBitmapFont("unscii", "unscii_8x8.png", 8, 8);

// load assets
loadSprite("title", "title.png");
loadSprite("knight", "knight.png");
loadSprite("thief", "thief.png");
loadSprite("goblin", "goblin.png");
loadSprite("dragon", "dragon.png");
loadSprite("cave", "cave.png");

loadSprite("coin", "coin.png");
loadSprite("dragongem", "dragon-gem.png");
loadSprite("crystal", "crystal.png");
// loadSprite("omen", "omen.png");
// loadSprite("flamewall", "flamewall.png");
// loadSprite("bomb", "bomb.png");
// loadSprite("monster", "monster.png");

loadSprite("bag", "bag.png")
loadSprite("ghosty", "ghosty.png")
loadSprite("grass", "grass.png")
loadSprite("steel", "steel.png")
loadSprite("door", "door.png?v=2")
loadSprite("dooroutline", "door-outline.png?v=2")
loadSprite("key", "key.png?v=2")

// load scenes
sceneStart();
sceneKnight(FLOOR_HEIGHT, JUMP_FORCE, SPEED);
sceneGoblin();
sceneDragon();
sceneCave();
sceneThief();
sceneLose();
sceneWin();

go("start");

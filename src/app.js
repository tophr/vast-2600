// import kaplay lib
// import kaboom from "https://unpkg.com/kaplay@3000/dist/kaboom.mjs";
import kaplay from "https://unpkg.com/kaplay@3001/dist/kaplay.mjs"
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
kaplay({
  background: grey,
  width: 320, //768, //320,
  height: 192, //360, //192,
  scale: 3,
  stretch: true,
  // letterbox: true,
});

// Using local assets from the assets folder
const ASSET_BASE_URL = "./assets/";

loadShaderURL("crt", null, `${ASSET_BASE_URL}crt.frag`);

usePostEffect("crt", {
  u_flatness: 4,
});

// load custom bitmap font, specifying the width and height of each character in the image
loadBitmapFont("unscii", `${ASSET_BASE_URL}unscii_8x8.png`, 8, 8);

// load assets
loadSprite("title", `${ASSET_BASE_URL}title.png?v=2`);
loadSprite("knight", `${ASSET_BASE_URL}knight.png`);
loadSprite("thief", `${ASSET_BASE_URL}thief.png`);
loadSprite("goblin", `${ASSET_BASE_URL}goblin.png`);
loadSprite("dragon", `${ASSET_BASE_URL}dragon.png`);
loadSprite("cave", `${ASSET_BASE_URL}cave.png`);

loadSprite("coin", `${ASSET_BASE_URL}coin.png`);
loadSprite("dragongem", `${ASSET_BASE_URL}dragon-gem.png`);
loadSprite("crystal", `${ASSET_BASE_URL}crystal.png`);
loadSprite("omen", `${ASSET_BASE_URL}omen.png`);
loadSprite("flamewall", `${ASSET_BASE_URL}flamewall.png`);
loadSprite("bomb", `${ASSET_BASE_URL}bomb.png`);
loadSprite("monster", `${ASSET_BASE_URL}monster.png`);

loadSprite("bag", `${ASSET_BASE_URL}bag.png`);
loadSprite("ghosty", `${ASSET_BASE_URL}ghosty.png`);
loadSprite("grass", `${ASSET_BASE_URL}grass.png`);
loadSprite("steel", `${ASSET_BASE_URL}steel.png`);
loadSprite("door", `${ASSET_BASE_URL}door.png?v=2`);
loadSprite("dooroutline", `${ASSET_BASE_URL}door-outline.png?v=2`);
loadSprite("key", `${ASSET_BASE_URL}key.png?v=2`);

// load scenes
sceneStart();
sceneKnight(FLOOR_HEIGHT, JUMP_FORCE, SPEED);
sceneGoblin();
sceneDragon();
sceneCave();
sceneThief();
sceneLose();
sceneWin();

go("start", true);

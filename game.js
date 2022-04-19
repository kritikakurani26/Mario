import kaboom from "./node_modules/kaboom/dist/kaboom.mjs";
import { LEVELS } from "./levels/levelsDef";
import { createLevelsConfig } from "./levels/levelsConf";
// const kaboom = require("kaboom");

// kaboom({
//   background: [134, 135, 247],
//   width: 320,
//   height: 240,
//   scale: 2,
// });

kaboom({
  background: [134, 135, 247],
  fullscreen: true,
  global: true,
  scale: 1.5,
  debug: true,
});

loadRoot("sprites/");
loadAseprite("mario", "Mario.png", "Mario.json");
loadAseprite("enemies", "enemies.png", "enemies.json");
loadSprite("ground", "ground.png");
loadSprite("questionBox", "questionBox.png");
loadSprite("emptyBox", "emptyBox.png");
loadSprite("brick", "brick.png");
loadSprite("coin", "coin.png");
loadSprite("bigMushy", "bigMushy.png");
loadSprite("pipeTop", "pipeTop.png");
loadSprite("pipeBottom", "pipeBottom.png");
loadSprite("shrubbery", "shrubbery.png");
loadSprite("hill", "hill.png");
loadSprite("cloud", "cloud.png");
loadSprite("castle", "castle.png");

const SPEED = 120;
const levelConf = createLevelsConfig();

scene("game", () => {
  layers(["bg", "game", "ui"], "game");

  const gameLevel = addLevel(LEVELS[0], levelConf);

  // Add background elements
  let cloudX = 20;
  while (cloudX < 1000) {
    add([sprite("cloud"), pos(cloudX, 50), layer("bg")]);
    cloudX += 200;
  }
  //   add([sprite("cloud"), pos(20, 50), layer("bg")]);
  add([sprite("hill"), pos(32, 208), layer("bg"), origin("bot")]);
  add([sprite("shrubbery"), pos(200, 208), layer("bg"), origin("bot")]);

  // Add UI Layer
  //   add([
  //     text("Level " + 1, { size: 24 }),
  //     pos(vec2(160, 30)),
  //     color(255, 255, 255),
  //     origin("center"),
  //     layer("ui"),
  //     lifespan(1, { fade: 0.5 }),
  //   ]);

  //   const score = 0;
  //   const scoreLabel = add([
  //     text("Score: " + score, { size: 20 }),
  //     pos(500, 6),
  //     layer("ui"),
  //     { value: score },
  //   ]);

  // Add Mario
  const player = gameLevel.spawn("p", 1, 5);
  let canSquash = false;

  onKeyDown("right", () => {
    player.flipX(false);
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.flipX(true);
    if (toScreen(player.pos).x > 20) {
      player.move(-SPEED, 0);
    }
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump();
      canSquash = true;
    }
  });

  player.onUpdate(() => {
    // center camera to player
    const currCam = camPos();
    if (currCam.x < player.pos.x) {
      camPos(player.pos.x, currCam.y);
    }

    if (player.isAlive && player.isGrounded()) {
      canSquash = false;
    }
  });

  player.onCollide("badGuy", (baddy) => {
    if (baddy.isAlive === false || player.isAlive === false) {
      return;
    }
    if (canSquash) {
      // Mario has jumped on the bad guy:
      baddy.squash();
    } else {
      if (player.isBig) {
        player.smaller();
        baddy.changeDir();
      } else {
        killed();
      }
    }
  });

  player.onHeadbutt((obj) => {
    if (obj.is("questionBox")) {
      if (obj.is("coinBox")) {
        let coin = gameLevel.spawn("c", obj.gridPos.sub(0, 1));
        coin.bump();
      } else if (obj.is("mushyBox")) {
        gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      }
      var pos = obj.gridPos;
      destroy(obj);
      var box = gameLevel.spawn("!", pos);
      box.bump();
    }
  });

  player.onCollide("bigMushy", (mushy) => {
    destroy(mushy);
    player.bigger();
  });

  function killed() {
    if (player.isAlive === false) {
      return;
    }
    player.die();
    add([
      text("Game Over :(", { size: 24 }),
      pos(toWorld(vec2(160, 120))),
      color(255, 255, 255),
      origin("center"),
      layer("ui"),
    ]);
  }
});

go("game");

/* HELPER FUNCTIONS */

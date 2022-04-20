import kaboom from "./node_modules/kaboom/dist/kaboom.mjs";
import { LEVELS } from "./levels/levelsDef";
import { createLevelsConfig } from "./levels/levelsConf";
import loadAllSprites from "./utils/loadAllSprites.js";

kaboom({
  background: [134, 135, 247],
  fullscreen: true,
  global: true,
  scale: 1.5,
  debug: true,
});

loadAllSprites();

const SPEED = 120;
const levelConf = createLevelsConfig();

scene("game", (levelNumber = 0) => {
  layers(["bg", "game", "ui"], "game");

  const gameLevel = addLevel(LEVELS[levelNumber], levelConf);

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

  // #region Player key press functions

  onKeyDown("right", () => {
    if (player.isFrozen) return;
    player.flipX(false);
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    if (player.isFrozen) return;
    player.flipX(true);
    if (toScreen(player.pos).x > 20) {
      player.move(-SPEED, 0);
    }
  });

  onKeyPress("space", () => {
    if (player.isAlive && player.isGrounded()) {
      player.jump();
      canSquash = true;
    }
  });

  // #endregion

  // #region Player action functions

  player.onUpdate(() => {
    // center camera to player
    const currCam = camPos();
    if (currCam.x < player.pos.x) {
      camPos(player.pos.x, currCam.y);
    }

    if (player.isAlive && player.isGrounded()) {
      canSquash = false;
    }

    if (player.pos.y > height() - 16) {
      killed();
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

  player.onCollide("castle", (castle, side) => {
    player.freeze();
    add([
      text("Well Done!", { size: 24 }),
      pos(toWorld(vec2(160, 120))),
      color(255, 255, 255),
      origin("center"),
      layer("ui"),
    ]);
    wait(1, () => {
      let nextLevel = levelNumber + 1;

      if (nextLevel >= LEVELS.length) {
        nextLevel = 0;
      }
      go("game", nextLevel);
    });
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

  // #endregion
});

go("game");

/* HELPER FUNCTIONS */

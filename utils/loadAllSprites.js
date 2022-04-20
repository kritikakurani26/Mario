export default function loadAllSprites() {
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
}

class Gem {
  constructor() {
    this.shape = this.generateShape();
    this.color = this.generateColor();
  }
  
  generateColor() {
    return '#'+((Math.random()*16777215)<<0).toString(16);
  }
}
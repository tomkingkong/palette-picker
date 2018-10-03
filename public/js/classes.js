class Gem {
  constructor() {
    this.shape = this.generateShape();
    this.color = this.generateColor();
  }

  generateColor() {
    return '#'+((Math.random()*16777215)<<0).toString(16);
  }

  generateShape() {
    const shapes = [ 
      `DIAMOND`, 
      `CUT_DIAMOND`, 
      `TRIANGLE`, 
      `HEXAGON`, 
      `OCTAGON` 
    ]
    return shapes[(Math.random()*shapes.length-1)+0.5<<0];
  }
}
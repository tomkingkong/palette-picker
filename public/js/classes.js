class Gem {
  constructor() {
    this.shape = this.generateShape();
    this.color = this.generateColor();
  }

  generateColor() {
    return 'hsla(' + (Math.random() * 360) + ', 85%, 50%, 1)';
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
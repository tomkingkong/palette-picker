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

const generateGemClasses = (type, shape, color) => {
  switch(type) {
    case 'CUT_DIAMOND':{
      return (
        addGemRules(`.${shape}:after`, {
          'border-color': `${color} transparent transparent transparent`,
          content: ''
        }),
        addGemRules(`.${shape}`, {
          'border-color': `transparent transparent ${color} transparent`,
          content: ''
        }));}
    case 'DIAMOND':{
      return (
        addGemRules(`.${shape}:after`, {
          'border-top-color': `${color}`,
          content: ''
        }),
        addGemRules(`.${shape}`, {
          'border-bottom-color': `${color}`,
          content: ''
        }));}
    case 'TRIANGLE':{
      return (
        addGemRules(`.${shape}`, {
          'border-bottom': `100px solid ${color}`,
          content: ''
        }));}
    case 'HEXAGON':{
      return (
        addGemRules(`.${shape}`, {
          'background': `${color}`,
          content: ''
        }),
        addGemRules(`.${shape}:after`, {
          'border-top': `25px solid ${color}`,
          content: ''
        }),
        addGemRules(`.${shape}:before`, {
          'border-bottom': `25px solid ${color}`,
          content: ''
        }));}
    case 'OCTAGON':{
      return (
        addGemRules(`.${shape}`, {
          'background': `${color}`,
          content: ''
        }),
        addGemRules(`.${shape}:after`, {
          'border-top': `29px solid ${color}`,
          content: ''
        }),
        addGemRules(`.${shape}:before`, {
          'border-bottom': `29px solid ${color}`,
          content: ''
        }));}
    default:
      return;
  }
}

const addGemRules = ((style) => {
  const sheet = document.head.appendChild(style).sheet;
  return (selector, css) => {
    const propText = Object.keys(css)
    .map(prop => prop+':'+css[prop])
    .join(';');
    sheet.insertRule(`${selector}{ ${propText} }`, sheet.cssRules.length);
  }
})(document.createElement("style"));
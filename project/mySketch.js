let land;
let house;
let road;
let highlightTile;
let tiles = [];
let houses = [];

let game ={
  mapW: 30,
  mapH: 30,
  transX: 425,
  transY: 50,
  scale: 1
}
let mouse = {
  x: 0,
  y: 0
}
function preload() {
  land = loadImage("assets/land.png");
  house = loadImage("assets/house.png");
  highlightTile = loadImage("assets/highlightTile.png");
  road = loadImage("assets/road.png")
}

function setup() {
  createCanvas(900, 600);
  noSmooth();
  Tile.findPoints();

  tiles[0].full = Road;
  houses.push(new Road(0, 0))
  //tiles[game.mapW*game.mapH].full = Road;
  //houses.push(new Road(tiles[game.mapW*game.mapH].x, tiles[game.mapW*game.mapH].y))

}

function draw() {
  background(220);
  translate(game.transX, game.transY);
  scale(game.scale)
  //mouse
  mouse.x = (mouseX - game.transX)/game.scale
  mouse.y = (mouseY - game.transY)/game.scale

  for (let i in tiles) {
    tiles[i].show();
  }

  Building.place(Road);
  houses.sort((a, b) => a.y - b.y);
  for (let i in houses) {
    houses[i].show();
  }
}

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.full = false;
    this.highlight = false;
  }

  show() {
    image(land, this.x, this.y);
    if (this.highlight) {
      image(highlightTile, this.x, this.y);
    }
  }

  static findPoints() {
    for (let j = 0; j < game.mapW; j++) {
      for (let i = 0; i < game.mapH; i++) {
        tiles.push(new Tile(i * 14 - j * 14, i * 7 + j * 7));
      }
    }
  }
}

class Building {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static place(type) {
    for (let i in tiles) {
      if (
        findDistance(
          mouse.x,
          mouse.y,
          tiles[i].x + 15,
          tiles[i].y + 8
        ) < 7
      ) {
        tiles[i].highlight = true;
        //console.log(tiles[i].highlight)
        this.x = tiles[i].x;
        this.y = tiles[i].y;

        if (mouseIsPressed && tiles[i].full == false && Building.findRoad(tiles[i])) {
          houses.push(new type(this.x, this.y));
          tiles[i].full = type;
        }
      } else {
        tiles[i].highlight = false;
      }
    }
  }
  static findRoad(tile){
    let tileIndex;
    for(let i in tiles){
      if(tiles[i] == tile){
        tileIndex = parseInt(i)
      }
    }

    if(tiles[tileIndex+1].full == Road){
      return true;
    }
    if(tiles[tileIndex-1].full == Road){
      return true;
    }
    if(tiles[tileIndex-game.mapW].full == Road){
      return true;
    }
    if(tiles[tileIndex+game.mapW].full == Road){
      return true;
    }

    //return true;
  }

}

class House extends Building {
  constructor(x, y) {
    super(x, y);
  }

  show() {
    image(house, this.x + 5, this.y - 26);
  }
}

class Road extends Building{
  constructor(x, y){
    super(x, y)
  }
  show() {
    image(road, this.x, this.y);
  }

}

function findDistance(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

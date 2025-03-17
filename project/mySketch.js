let land;
let house;
let highlightTile;
let tiles = [];
let houses = [];

function preload() {
  land = loadImage("assets/land.png");
  house = loadImage("assets/house.png");
  highlightTile = loadImage("assets/highlightTile.png");
}

function setup() {
  createCanvas(900, 600);
  noSmooth();
  Tile.findPoints();
}

function draw() {
  background(220);
  translate(425, 100);

  for (let i in tiles) {
    tiles[i].show();
  }

  Building.place(House);
  houses.sort((a, b) => a.y - b.y);
  for (let i in houses) {
    houses[i].show(house);
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
    for (let j = 0; j < 30; j++) {
      for (let i = 0; i < 30; i++) {
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

  show(asset) {
    image(asset, this.x + 5, this.y - 26);
  }

  static place(type) {
    for (let i in tiles) {
      if (
        findDistance(
          mouseX - 425,
          mouseY - 100,
          tiles[i].x + 15,
          tiles[i].y + 8
        ) < 7
      ) {
        tiles[i].highlight = true;
        //console.log(tiles[i].highlight)
        this.x = tiles[i].x;
        this.y = tiles[i].y;

        if (mouseIsPressed && tiles[i].full == false) {
          houses.push(new type(this.x, this.y));
          tiles[i].full = true;
        }
      } else {
        tiles[i].highlight = false;
      }
    }
  }
}

class House extends Building {
  constructor(x, y) {
    super(x, y);
  }
}

class Road extends Building{
  constructor(x, y){
    this.x = x;
    this.y = y
  }

}

function findDistance(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

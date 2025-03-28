let land;
let house;
let road;
let factory;
let highlightTile;
let tiles = [];
let houses = [];
let displayHouses = [];
let smoke = [];
let actions = [];
let coin;

let player = {
  round: 1,
  money: 1000,
  pollution: 0,
  population: 0,

};
let owned = {
  roads: 0,
  houses: 0,
  factories: 0,
  trees: 0

}

let game = {
  mapW: 100,
  mapH: 100,
  transX: 475,
  transY: 50,
  scale: 1,
};

let prices = {
  house: 100,
  road: 10,
  factory: 1000
}

let mouse = {
  x: 0,
  y: 0,
};

let mode = 1;
function preload() {
  land = loadImage("assets/land.png");
  house = loadImage("assets/house.png");
  factory = loadImage("assets/factory.png");
  highlightTile = loadImage("assets/highlightTile.png");
  road = loadImage("assets/road.png");
  coin = loadImage("assets/coin.png");
}

function setup() {
  createCanvas(1000, 600);
  noSmooth();
  Tile.findPoints();

  tiles[0].full = Road;
  houses.push(new Road(0, 0));
  //tiles[game.mapW*game.mapH].full = Road;
  //houses.push(new Road(tiles[game.mapW*game.mapH].x, tiles[game.mapW*game.mapH].y))
}

function draw() {
  background(220);

  push()
  translate(game.transX, game.transY);
  scale(game.scale);
  //mouse
  mouse.x = (mouseX - game.transX) / game.scale;
  mouse.y = (mouseY - game.transY) / game.scale;

  move();

  for (let i in tiles) {
    tiles[i].show();
  }

  displayHouses = Array.from(houses);

  displayHouses.sort((a, b) => a.z - b.z);
  displayHouses.sort((a, b) => a.y - b.y);

  for (let i in displayHouses) {
    displayHouses[i].show();
  }

  for (let i in smoke) {
    smoke[i].show();
  }

  if (mode == 1) {
    if(player.money >= prices.road){
      Building.place(Road);
    }

  }
  if (mode == 2) {
    if(player.money >= prices.house){
      Building.place(House);
    }

  }
  if (mode == 3) {
    if(player.money >= prices.factory){
      Building2.place(Factory);
    }

  }

  pop()

  moneyTracker();
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
      if (findDistance(mouse.x, mouse.y, tiles[i].x + 15, tiles[i].y + 8) < 7) {
        tiles[i].highlight = true;
        //console.log(tiles[i].highlight)
        this.x = tiles[i].x;
        this.y = tiles[i].y;

        if (
          mouseIsPressed &&
          tiles[i].full == false &&
          Building.findRoad(tiles[i])
        ) {
          houses.push(new type(this.x, this.y));
          tiles[i].full = type;
          actions.push(i);
          if(type == Road){
            player.money -= prices.road
          }
          if(type == House){
            player.money -= prices.house
          }
        }
      } else {
        tiles[i].highlight = false;
      }
    }
  }

  static findRoad(tile) {
    let tileIndex;
    for (let i in tiles) {
      if (tiles[i] == tile) {
        tileIndex = parseInt(i);
      }
    }
    if (tileIndex == game.mapW - 1) {
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Bottom Left
      if (tiles[tileIndex + game.mapW].full == Road) {
        return true;
      }
    } else if (tileIndex == game.mapW * game.mapH - 1) {
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
    } else if (tileIndex == game.mapW * game.mapH - game.mapW) {
      //Bottom Right
      if (tiles[tileIndex + 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
    } else if (tileIndex > game.mapW * game.mapH - game.mapW) {
      //Bottom Right
      if (tiles[tileIndex + 1].full == Road) {
        return true;
      }
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
    } else if (tileIndex % game.mapW == 0) {
      //Bottom Right
      if (tiles[tileIndex + 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
      //Bottom Left
      if (tiles[tileIndex + game.mapW].full == Road) {
        return true;
      }
    } else if ((tileIndex + 1) % game.mapW == 0) {
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
      //Bottom Left
      if (tiles[tileIndex + game.mapW].full == Road) {
        return true;
      }
    } else if (tileIndex < game.mapW) {
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Bottom Left
      if (tiles[tileIndex + game.mapW].full == Road) {
        return true;
      }
      //Bottom Right
      if (tiles[tileIndex + 1].full == Road) {
        return true;
      }
    } else {
      //Bottom Right
      if (tiles[tileIndex + 1].full == Road) {
        return true;
      }
      //Top Left
      if (tiles[tileIndex - 1].full == Road) {
        return true;
      }
      //Top Right
      if (tiles[tileIndex - game.mapW].full == Road) {
        return true;
      }
      //Bottom Left
      if (tiles[tileIndex + game.mapW].full == Road) {
        return true;
      }
    }

    //return true;
  }
}

class House extends Building {
  constructor(x, y) {
    super(x, y);
    this.z = 1;
    this.type = "house";
  }

  show() {
    image(house, this.x + 5, this.y - 26);
  }
}

class Road extends Building {
  constructor(x, y) {
    super(x, y);
    this.z = 1;
    this.type = "road";
  }
  show() {
    image(road, this.x, this.y);
  }
}

class Building2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static place(type) {
    for (let i in tiles) {
      let ind = parseInt(i);
      if (findDistance(mouse.x, mouse.y, tiles[i].x + 15, tiles[i].y + 8) < 7) {
        tiles[i].highlight = true;
        //console.log(tiles[i].highlight)
        this.x = tiles[i].x;
        this.y = tiles[i].y;

        if (
          mouseIsPressed &&
          tiles[ind].full == false &&
          tiles[ind + 1].full == false &&
          tiles[ind + game.mapW].full == false &&
          tiles[ind + game.mapW + 1].full == false &&
          (Building.findRoad(tiles[ind]) ||
            Building.findRoad(tiles[ind + 1]) ||
            Building.findRoad(tiles[ind + game.mapW]) ||
            Building.findRoad(tiles[ind + game.mapW + 1]))
        ) {
          if (
            !(
              //i < game.mapW ||
              (
                i == game.mapW - 1 ||
                (i + 1) % game.mapW == 0 ||
                i > game.mapW * game.mapH - game.mapW
              )
              //i % 30 == 0
            )
          ) {
            houses.push(new type(this.x, this.y));
            smoke.push(new Smoke(this.x + 11, this.y - 20));
            tiles[ind].full = type;
            tiles[ind + 1].full = type;
            tiles[ind + game.mapW].full = type;
            tiles[ind + game.mapW + 1].full = type;
            actions.push(i)
            if(type == Factory){
              player.money -= prices.factory
          }
          }
        }
      } else {
        tiles[i].highlight = false;
      }
    }
  }
}

class Factory extends Building2 {
  constructor(x, y) {
    super(x, y);
    this.z = 2;
    this.type = "factory";
  }
  show() {
    image(factory, this.x - 9, this.y - 21);
  }
}

class Smoke {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.x1 = x;
    this.y1 = y;

    this.x2 = x;
    this.y2 = y;

    this.x3 = x;
    this.y3 = y;
  }

  show() {
    noStroke();
    fill("rgba(0,0,0,0.14)");
    circle(this.x1, this.y1, 10);
    circle(this.x2, this.y2, 10);
    circle(this.x3, this.y3, 10);
    this.y1 -= 0.25;
    this.x1 += 0.1;
    this.y2 -= 0.5;
    this.x2 += 0.25;
    this.y3 -= 1;
    this.x3 += 0.25;

    if (this.y1 < this.y - 30) {
      this.y1 = this.y;
      this.x1 = this.x;
    }
    if (this.y2 < this.y - 30) {
      this.y2 = this.y;
      this.x2 = this.x;
    }
    if (this.y3 < this.y - 30) {
      this.y3 = this.y;
      this.x3 = this.x;
    }
  }
}

function move() {
  if (keyIsDown(LEFT_ARROW)) {
    game.transX += 10 * (1 / game.scale);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    game.transX -= 10 * (1 / game.scale);
  }
  if (keyIsDown(UP_ARROW)) {
    game.transY += 5 * (1 / game.scale);
  }
  if (keyIsDown(DOWN_ARROW)) {
    game.transY -= 5 * (1 / game.scale);
  }
}

function keyPressed() {
  if (key === "1") {
    mode = 1;
  }
  if (key === "2") {
    mode = 2;
  }
  if (key === "3") {
    mode = 3;
  }

  if (key == "=") {
    game.scale *= 1 / 0.75;
  }
  if (key == "-") {
    game.scale *= 0.75;
  }
  if (key == "z") {
    let index = parseInt(actions[actions.length -1])
    if (houses.length > 1) {
      if (houses[houses.length - 1].type == "factory") {

        tiles[index].full = false;
        tiles[index + 1].full = false;
        tiles[index+game.mapW].full = false;
        tiles[index+game.mapW+1].full = false;
        smoke.pop()
        

      } else {
        tiles[actions[actions.length - 1]].full = false;
      }
      actions.pop();
      houses.pop();
    }
  }
  if (key === " "){
    takeTurn()
  }

  if (key === "h") {
    countPlaced()
    console.log(owned.houses)
    console.log(owned.roads)
    console.log(owned.factories)
  }
  

}

function findDistance(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

function moneyTracker() {
  fill("white")
  rect(900,20,60,30);
  fill("black")
  text(player.money, 905,40);
  image(coin, 850,21,);
}

function countPlaced(){
  owned.houses = 0;
  owned.roads = 0;
  owned.factories = 0;
  for (let i = 0; i < houses.length; i++) {
    if (houses[i].constructor.name === "House") {
      owned.houses++;
    }
    if (houses[i].constructor.name === "Road"){
      owned.roads++;
    }
    if (houses[i].constructor.name === "Factory"){
      owned.factories++;
    }
  }
}
function takeTurn(){
  countPlaced()
  player.money += owned.houses*10
  player.money += owned.factories*500
  player.round ++
}



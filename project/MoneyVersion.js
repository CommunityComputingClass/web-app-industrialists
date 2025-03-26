let money = 100;
let coin;
let houseCount = 30;
let factoryCount = 10;

function preload(){
  coin = loadImage("coin.png");
}

function setup() {
  createCanvas(1000, 600);
  background(220)
}

function draw(){
moneyTracker();

}

function moneyTracker() {
  rect(900,20,60,30);
  text(money, 905,40);
  image(coin, 850,21,);
}

function keyPressed(){
  if (key === " "){
    money = money + houseCount*5
    money = money + factoryCount*50
  }

}
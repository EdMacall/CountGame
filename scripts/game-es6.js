// logic for the Count Game

class NumberedBox extends createjs.Container
{
  constructor(game, number = 0)
  {
    super();

    this.game   = game;
    this.number = number;

    var movieclip = new lib.NumberedBox();
    movieclip.numberText.text = number;

    movieclip.numberText.font = "28px Oswald";
    movieclip.numberText.textBaseline = "alphabet";
    movieclip.numberText.x += 2;
    movieclip.numberText.y = 38;

    new createjs.ButtonHelper(movieclip, 0, 1, 2, false,
                              new lib.RestartButton(), 3);

    this.addChild(movieclip);

    this.setBounds(0, 0, 50, 50);

    // handle click / tap
    this.on('click', this.handleClick.bind(this));

    // random position
    /*
    movieclip.x = Math.random() * 200;
    movieclip.y = Math.random() * 200;
    */
  }

  handleClick()
  {
    this.game.handleClick(this);
    createjs.Sound.play("Jump");
  }
}

// This class controls the game data.
class GameData
{
  constructor()
  {
    this.amountOfBoxes = 20;
    this.resetData();
  }

  resetData()
  {
    this.currentNumber = 1;
  }

  nextNumber()
  {
    this.currentNumber += 1;
  }

  isRightNumber(number)
  {
    // console.log("The number is " + number + " and the currentNumber is " + this.currentNumber + ".")
    return (number === this.currentNumber);
  }

  isGameWin()
  {
    // TODO
    // return false;
    return (this.currentNumber > this.amountOfBoxes);
  }
}

class Game
{
  constructor()
  {
    console.log(`Welcome to the game.  Version ${this.version()}.`);

    this.loadSound();

    this.canvas = document.getElementById("game-canvas");
    this.stage = new createjs.Stage(this.canvas);

    this.stage.width  = this.canvas.width;
    this.stage.height = this.canvas.height;

    // window.debugStage = this.stage;

    this.stage.enableMouseOver();

    // enable tap on touch device
    createjs.Touch.enable(this.stage);

    // enable retina screen
    this.retinalize();

    createjs.Ticker.setFPS(60);

    // game related initialization
    this.gameData = new GameData();

    // keep re-drawing the stage.
    createjs.Ticker.on("tick", this.stage);

    this.restartGame();

    // testing code
    /*
    this.stage.addChild(new NumberedBox(88));
    */

    /*
    var circle = new createjs.Shape();
    circle.graphics.beginFill("yellow").drawCircle(0, 0, 40);
    circle.x = circle.y = 100;
    this.stage.addChild(circle);
     */
  }

  version()
  {
    return '1.0.0';
  }

  loadSound()
  {
    // createjs.FlashAudioPlugin.swfPath = "../src/soundjs/flashaudio";
    // createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
    // createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}
    createjs.Sound.registerSound("soundfx/jump7.aiff", "Jump");
    createjs.Sound.registerSound("soundfx/game-over.aiff", "Game Over");
    createjs.Sound.alternateExtensions = ["ogg", "wav"];
  }

  restartGame()
  {
    this.gameData.resetData();
    this.stage.removeAllChildren();

    // background
    this.stage.addChild(new lib.Background());

    this.generateMultipleBoxes(this.gameData.amountOfBoxes);
  }

  generateMultipleBoxes(amount = 10)
  {
    for(var i = amount; i > 0; i--)
    {
      var movieclip = new NumberedBox(this, i);
      this.stage.addChild(movieclip);

      // random position
      movieclip.x = Math.random() * (this.stage.width -
      movieclip.getBounds().width);
      movieclip.y = Math.random() * (this.stage.height -
      movieclip.getBounds().height);
    }
  }

  handleClick(numberedBox)
  {
    // var boolCrap = this.gameData.isRightNumber(numberedBox.number);
    // console.log("boolCrap is " + boolCrap + ".");
    if(this.gameData.isRightNumber(numberedBox.number))
    {
      this.stage.removeChild(numberedBox);
      this.gameData.nextNumber();

      // is game over?
      if(this.gameData.isGameWin())
      {
        createjs.Sound.play("Game Over");

        var gameOverView = new lib.GameOverView();
        this.stage.addChild(gameOverView);

        gameOverView.restartButton.on('click', (function(){
          createjs.Sound.play("Jump");

          this.restartGame();}).bind(this));
      }
    }
  }

  retinalize()
  {
    this.stage.width  = this.canvas.width;
    this.stage.height = this.canvas.height;

    let ratio = window.devicePixelRatio;
    if(ratio === undefined)
    {
      return;
    }

    this.canvas.setAttribute('width',  Math.round(this.stage.width  *  ratio));
    this.canvas.setAttribute('height', Math.round(this.stage.height  * ratio));

    this.stage.scaleX = this.stage.scaleY = ratio;

    // Set CSS style
    this.canvas.style.width  = this.stage.width  + "px";
    this.canvas.style.height = this.stage.height + "px";
  }
}

// start the game
var game = new Game();


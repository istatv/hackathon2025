import { Player } from '../../shared/entities/Player.ts'
import Rectangle = Phaser.GameObjects.Rectangle
import SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE
import TimeStep = Phaser.Core.TimeStep

export class PushButtonGame extends Phaser.Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text
    time_step_player1: Phaser.Core.TimeStep
    time_step_player2: Phaser.Core.TimeStep

    playerOne = new Player()
    playerTwo = new Player()

    private static AMOUNT_TO_INCREASE = 50
    private static MAX_WIDTH = 800
    private static REDUCTION_SPEED = 0.05

    private gameIsOver = true

    private countdownText: Phaser.GameObjects.Text
    private countdown = 5
    private countdownTimer: Phaser.Time.TimerEvent

    private rectangle_player1: Phaser.GameObjects.Rectangle
    private rectangle_player2: Phaser.GameObjects.Rectangle

    constructor() {
        super('PushButtonGame')
        this.playerOne.name = 'Player 1'
        this.playerTwo.name = 'Player 2'
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000)
        this.countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true,
        })
        this.add
            .text(
                50,
                50,
                this.playerOne.name + ', press space as fast as you can!',
                {}
            )
            .setOrigin(0, 0.5)

        this.add.text(
            50,
            150,
            this.playerTwo.name + ', press ctrl as fast as you can!',
            {}
        )
        this.countdownText = this.add.text(
            +this.game.config.width / 2 - 100,
            +this.game.config.height / 2 - 50,
            this.countdown.toString(),
            {
                fontSize: '100px',
                align: 'center',
                fixedWidth: 200,
            }
        )

        this.background = this.add.image(512, 384, 'background')
        this.background.setAlpha(0.5)

        this.rectangle_player1 = this.add.rectangle(100, 100, 0, 50, 0xff7448)
        this.rectangle_player2 = this.add.rectangle(100, 200, 0, 50, 0xff7335)

        this.time_step_player1 = new TimeStep(this.game, {
            smoothStep: true,
        })
        this.time_step_player2 = new TimeStep(this.game, {
            smoothStep: true,
        })
        this.time_step_player1.start((time, delta) =>
            this.reduceBar(delta, this.rectangle_player1)
        )
        this.time_step_player2.start((time, delta) =>
            this.reduceBar(delta, this.rectangle_player2)
        )

        this.input.keyboard?.on('keyup-SPACE', () => {
            this.buttonPush(
                this.rectangle_player1,
                this.playerOne,
                this.gameIsOver
            )
        })

        this.input.keyboard?.on('keyup-CTRL', () => {
            this.buttonPush(
                this.rectangle_player2,
                this.playerTwo,
                this.gameIsOver
            )
        })
    }

    reduceBar(delta, rectangle: Rectangle) {
        rectangle.width -= delta * PushButtonGame.REDUCTION_SPEED
        if (rectangle.width <= 0) {
            rectangle.width = 0
        }
    }

    buttonPush(rectangle: Rectangle, player: Player, gameIsOver = false) {
        if (!gameIsOver) {
            if (rectangle.width < PushButtonGame.MAX_WIDTH) {
                rectangle.width += PushButtonGame.AMOUNT_TO_INCREASE
            } else {
                this.gameWon(player)
            }
        }
    }

    gameWon(player: Player) {
        this.add.text(
            +this.game.config.width / 2 - 200,
            +this.game.config.height / 2 - 100,
            'Congratulations ' +
                player.name +
                ', you have won! \n\n Press enter to return to the city.',
            {
                align: 'center',
                fontSize: '40px',
                wordWrap: { width: 400 },
            }
        )
        this.time_step_player1.stop()
        this.time_step_player2.stop()
        this.gameIsOver = true
        this.backToLobby()
    }

    backToLobby() {
        this.input.keyboard?.on('keydown-ENTER', () => {
            this.scene.start('Lobby')
        })
    }

    updateCountdown() {
        this.countdown--

        this.countdownText.setText(this.countdown.toString())

        if (this.countdown <= 0) {
            this.countdownText.setText('Go!')
            if (this.countdown <= -1) {
                this.countdownTimer.remove()
                this.countdownText.destroy()
                this.gameIsOver = false
            }
        }
    }
}

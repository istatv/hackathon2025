import { Player } from '../../shared/entities/Player.ts'
import Rectangle = Phaser.GameObjects.Rectangle
import SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE
import TimeStep = Phaser.Core.TimeStep
import { EnergykidsGamecontrol } from "../../shared/EnergykidsGamecontrol"

export class PushButtonGame extends Phaser.Scene {
    public static readonly IDENTIFIER: string = 'PushButtonGame'
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text
    time_step_player1: Phaser.Core.TimeStep
    time_step_player2: Phaser.Core.TimeStep

    gamecontrol = EnergykidsGamecontrol.getInstance()
    private playerOne: Player
    private playerTwo: Player

    private static AMOUNT_TO_INCREASE = 150
    private static MAX_WIDTH = 800
    private static REDUCTION_SPEED = 0.05

    private gameIsOver = true

    private countdownText: Phaser.GameObjects.Text
    private countdown: number
    private countdownTimer: Phaser.Time.TimerEvent

    private rectangle_player1: Phaser.GameObjects.Rectangle
    private rectangle_player2: Phaser.GameObjects.Rectangle

    constructor() {
        super(PushButtonGame.IDENTIFIER)
        this.playerOne = this.gamecontrol.getPlayerAt(0)
        this.playerTwo = this.gamecontrol.getPlayerAt(1)
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000)
        this.countdown = 5
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
                this.playerOne.name + ', press [ SPACE ] repeatedly to win!',
                {}
            )
            .setOrigin(0, 0.5)

        this.add.text(
            50,
            150,
            this.playerTwo.name + ', press [ CTRL ] repeatedly to win!',
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
                ', you have won! \n\n Press [ ENTER ] to return to the city.',
            {
                align: 'center',
                fontSize: '40px',
                wordWrap: { width: 500 },
            }
        )
        this.time_step_player1.stop()
        this.time_step_player2.stop()
        this.gameIsOver = true
        player.addScore(50)
        this.backToLobby()
    }

    backToLobby() {
        this.input.keyboard?.on('keydown-ENTER', () => {
            this.scene.stop(PushButtonGame.IDENTIFIER)
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

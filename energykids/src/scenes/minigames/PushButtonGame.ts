import { Player } from '../../shared/entities/Player.ts'
import { EnergykidsGamecontrol } from '../../shared/EnergykidsGamecontrol'
import Rectangle = Phaser.GameObjects.Rectangle
import TimeStep = Phaser.Core.TimeStep
import Image = Phaser.GameObjects.Image

export class PushButtonGame extends Phaser.Scene {
    public static readonly IDENTIFIER: string = 'PushButtonGame'
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    time_step_player1: Phaser.Core.TimeStep
    time_step_player2: Phaser.Core.TimeStep

    private gameState = EnergykidsGamecontrol.getInstance()
    private playerOne: Player
    private playerTwo: Player

    private static AMOUNT_TO_INCREASE = 150
    private static MAX_WIDTH = 800
    private static REDUCTION_SPEED = 0.35

    private tick: number = 0

    private gameIsOver = true

    private countdownText: Phaser.GameObjects.Text
    private countdown: number
    private countdownTimer: Phaser.Time.TimerEvent

    private playerOneImage: Image
    private playerTwoImage: Image
    private rectangle_player1: Phaser.GameObjects.Rectangle
    private rectangle_player2: Phaser.GameObjects.Rectangle

    private playerState = [false, false]

    constructor() {
        super(PushButtonGame.IDENTIFIER)
        this.playerOne = this.gameState.getPlayerAt(0)
        this.playerTwo = this.gameState.getPlayerAt(1)
    }

    renderBackground() {
        this.add.image(512, 384, 'pb_background')
    }

    computePaddlesFloat(paddle: any) {
        let angle = ((this.tick + paddle.tOff) * 0.00051) % 360
        let diff = 10 * Math.sin(angle * (180 / Math.PI))
        let dy = paddle.oY + diff
        paddle.__proto__.setY(dy)
    }

    renderText() {
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
    }

    renderPlayers() {
        this.playerOneImage = this.add.image(350, 640, 'pb_kyo1_1')
        this.playerTwoImage = this.add.image(690, 640, 'pb_kyo2_1')

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
            this.buttonPush(this.rectangle_player1, 0, this.gameIsOver)
        })

        this.input.keyboard?.on('keyup-CTRL', () => {
            this.buttonPush(this.rectangle_player2, 1, this.gameIsOver)
        })
    }

    create() {
        this.camera = this.cameras.main

        this.renderBackground()
        this.renderText()
        this.renderPlayers()
    }

    reduceBar(delta, rectangle: Rectangle) {
        rectangle.width -= delta * PushButtonGame.REDUCTION_SPEED
        if (rectangle.width <= 0) {
            rectangle.width = 0
        }
    }

    buttonPush(rectangle: Rectangle, playerIndex: number, gameIsOver = false) {
        if (!gameIsOver) {
            if (rectangle.width < PushButtonGame.MAX_WIDTH) {
                rectangle.width += PushButtonGame.AMOUNT_TO_INCREASE
                this.playerState[playerIndex] = !this.playerState[playerIndex]
                const imageNum = this.playerState[playerIndex] ? '1' : '2'
                if (playerIndex === 0) {
                    this.playerOneImage.setTexture('pb_kyo1_' + imageNum)
                } else {
                    this.playerTwoImage.setTexture('pb_kyo2_' + imageNum)
                }
            } else {
                this.gameWon(this.gameState.getPlayerAt(playerIndex))
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

    update(time: number, delta: number) {
        super.update(time, delta)
        this.tick = (this.tick + 1) % Number.MAX_VALUE

        //this.computePaddlesFloat(this.playerOneImage)
    }
}

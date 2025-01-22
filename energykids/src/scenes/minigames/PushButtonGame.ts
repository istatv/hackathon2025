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
    private bulb_overlay: Image

    private static AMOUNT_TO_INCREASE = 80
    private static MAX_WIDTH = 800
    private static REDUCTION_SPEED = 0.35

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

    renderCountdown() {
        this.countdown = 5
        this.countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true,
        })

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
        this.playerOneImage = this.add.image(320, 640, 'pb_kyo1_1')
        this.playerTwoImage = this.add.image(710, 640, 'pb_kyo2_1')

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
        this.renderCountdown()
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
                    this.playerOneImage
                        .setTexture('pb_kyo1_' + imageNum)
                        .setScale(
                            1 + rectangle.width / PushButtonGame.MAX_WIDTH
                        )
                        .setAngle(imageNum === '1' ? -3 : 3)
                } else {
                    this.playerTwoImage
                        .setTexture('pb_kyo2_' + imageNum)

                        .setScale(
                            1 + rectangle.width / PushButtonGame.MAX_WIDTH
                        )
                        .setAngle(imageNum === '1' ? -3 : 3)
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
                this.renderPlayers()
                this.renderBulb()
            }
        }
    }

    renderBulb() {
        const width = +this.game.config.width / 2
        const height = +this.game.config.height / 2
        this.add.image(width, height, 'pb_bulb_off').setOrigin(0.5, 0.65)
        this.bulb_overlay = this.add
            .image(width, height, 'pb_bulb_on')
            .setOrigin(0.5, 0.65)
            .setAlpha(0)
    }

    update(time: number, delta: number) {
        super.update(time, delta)

        if (this.countdown < 0) {
            // Reduce size of player if they are not paddling
            const playerOneScale =
                1 + this.rectangle_player1.width / PushButtonGame.MAX_WIDTH
            const playerTwoScale =
                1 + this.rectangle_player2.width / PushButtonGame.MAX_WIDTH
            this.playerOneImage.setScale(playerOneScale)
            this.playerTwoImage.setScale(playerTwoScale)
            const overAllProgress =
                (this.rectangle_player1.width + this.rectangle_player2.width) /
                    (PushButtonGame.MAX_WIDTH * 2) -
                0.02

            this.bulb_overlay.setAlpha(overAllProgress)
        }
    }
}

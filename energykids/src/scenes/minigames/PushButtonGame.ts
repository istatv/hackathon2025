import { Player } from '../../shared/entities/Player.ts'
import { EnergykidsGamecontrol } from '../../shared/EnergykidsGamecontrol'
import TimeStep = Phaser.Core.TimeStep
import Image = Phaser.GameObjects.Image
import Key = Phaser.Input.Keyboard.Key
import Rectangle = Phaser.GameObjects.Rectangle

interface PlayerState {
    id: number
    player: Player
    playerImage?: Image
    barHeight: number
    barImage?: Rectangle
    score: number
    key?: Key
    timer: TimeStep
    leftLegStreched: boolean
}

export class PushButtonGame extends Phaser.Scene {
    public static readonly IDENTIFIER: string = 'PushButtonGame'
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image

    private gameState = EnergykidsGamecontrol.getInstance()
    private playerOne: PlayerState
    private playerTwo: PlayerState
    private bulb_overlay?: Image

    private static AMOUNT_TO_INCREASE = 80
    private static MAX_HEIGHT = 200
    private static REDUCTION_SPEED = 0.35

    private gameStarted = false
    private gameFinished = false

    private countdownText: Phaser.GameObjects.Text
    private countdown: number
    private countdownTimer: Phaser.Time.TimerEvent

    constructor() {
        super(PushButtonGame.IDENTIFIER)
    }

    setupPlayers() {
        this.playerOne = {
            id: 1,
            leftLegStreched: false,
            player: this.gameState.getPlayerAt(0),
            key: this.input.keyboard
                ?.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL, true, false)
                .on('down', () => {
                    this.buttonPush(this.playerOne)
                }),
            score: 0,
            barHeight: 0,
            playerImage: undefined,
            timer: new TimeStep(this.game, {
                smoothStep: true,
            }),
        }
        this.playerTwo = {
            id: 2,
            leftLegStreched: false,
            player: this.gameState.getPlayerAt(1),
            key: this.input.keyboard
                ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true, false)
                .on('down', () => {
                    this.buttonPush(this.playerTwo)
                }),
            score: 0,
            barHeight: 0,
            playerImage: undefined,
            timer: new TimeStep(this.game, {
                smoothStep: true,
            }),
        }
    }

    renderBackground() {
        this.add.image(512, 384, 'pb_background')
    }

    renderCountdown() {
        this.countdown = 1
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
                fontSize: '120px',
                align: 'center',
                fixedWidth: 200,
                color: '#07F077',
                fontFamily: 'MightySoul',
            }
        )
    }

    renderPlayers() {
        this.playerOne.playerImage = this.add.image(320, 640, 'pb_kyo1_1')
        this.playerTwo.playerImage = this.add.image(710, 640, 'pb_kyo2_1')

        this.playerOne.timer.start((_time, delta) =>
            this.reduceBar(delta, this.playerOne)
        )
        this.playerTwo.timer.start((_time, delta) =>
            this.reduceBar(delta, this.playerTwo)
        )
    }

    create() {
        this.camera = this.cameras.main

        this.setupPlayers()
        this.renderBackground()
        this.renderCountdown()
    }

    reduceBar(delta: number, player: PlayerState) {
        player.barHeight -= delta * PushButtonGame.REDUCTION_SPEED
        if (player.barHeight <= 0) {
            player.barHeight = 0
        }
    }

    buttonPush(player: PlayerState) {
        if (this.gameFinished) {
            return
        }

        if (player.barHeight >= PushButtonGame.MAX_HEIGHT) {
            this.gameWon(player.player)
            return
        }

        player.barHeight += PushButtonGame.AMOUNT_TO_INCREASE
        player.leftLegStreched = !player.leftLegStreched

        player.playerImage
            ?.setTexture(
                `pb_kyo${player.id}_${player.leftLegStreched ? '1' : '2'}`
            )
            .setScale(1 + player.barHeight / PushButtonGame.MAX_HEIGHT)
            .setAngle(player.leftLegStreched ? -3 : 3)
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
        this.playerOne.timer.stop()
        this.playerTwo.timer.stop()
        this.gameFinished = true
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
                this.gameStarted = true
                this.renderPlayers()
                this.renderBulb()
                this.renderBars()
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

    renderBars() {
        this.add.image(200, 645, 'pb_bar')
        this.add.image(820, 645, 'pb_bar')

        this.playerOne.barImage = this.add.rectangle(200, 645, 10, 0, 0xff7448)
        this.playerTwo.barImage = this.add.rectangle(620, 645, 10, 0, 0xff7335)
    }

    update(time: number, delta: number) {
        super.update(time, delta)

        if (this.gameStarted && !this.gameFinished) {
            // Update bar sizes
            if (this.playerOne.barImage) {
                this.playerOne.barImage.height = this.playerOne.barHeight
            }
            if (this.playerTwo.barImage) {
                this.playerTwo.barImage.height = this.playerTwo.barHeight
            }

            // Reduce size of player if they are not paddling
            const playerOneScale =
                1 +
                (this.playerOne?.barImage?.height ?? 0) /
                    PushButtonGame.MAX_HEIGHT
            const playerTwoScale =
                1 +
                (this.playerTwo?.barImage?.height ?? 0) /
                    PushButtonGame.MAX_HEIGHT
            this.playerOne.playerImage?.setScale(playerOneScale)
            this.playerTwo.playerImage?.setScale(playerTwoScale)
            const overAllProgress =
                0.02 -
                (this.playerOne.barHeight > this.playerTwo.barHeight
                    ? this.playerOne.barHeight
                    : this.playerTwo.barHeight) /
                    PushButtonGame.MAX_HEIGHT

            this.bulb_overlay?.setAlpha(overAllProgress)
        }
    }
}

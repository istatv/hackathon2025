import { Player } from '../../shared/entities/Player.ts'
import { EnergykidsGamecontrol } from '../../shared/EnergykidsGamecontrol'
import TimeStep = Phaser.Core.TimeStep
import Image = Phaser.GameObjects.Image
import Key = Phaser.Input.Keyboard.Key
import Rectangle = Phaser.GameObjects.Rectangle
import Text = Phaser.GameObjects.Text
import Between = Phaser.Math.Between

interface PlayerState {
    id: number
    player: Player
    playerImage?: Image
    barHeight: number
    barImage?: Rectangle
    score: number
    scoreText?: Text
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

    private static AMOUNT_TO_INCREASE = 10
    private static MAX_HEIGHT = 120
    private static REDUCTION_SPEED = 0.04
    private static GAME_DURATION = 30
    private static MAX_SCORE_PER_SECOND = 50
    private static NUM_COUNTDOWN = 3

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
            key: this.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.CTRL,
                true,
                false
            ),
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
            key: this.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE,
                true,
                false
            ),
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
        this.sound.play('pb_countdown')

        this.countdown = PushButtonGame.NUM_COUNTDOWN
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
        if (!this.gameFinished) {
            const reduction = delta * PushButtonGame.REDUCTION_SPEED

            player.barHeight -= reduction
            if (player.barHeight <= 0) {
                player.barHeight = 0
            }
        }
    }

    buttonPush(player: PlayerState) {
        if (this.gameFinished) {
            return
        }

        if (player.barHeight >= PushButtonGame.MAX_HEIGHT) {
            player.barHeight = PushButtonGame.MAX_HEIGHT
        }

        this.sound.play('pb_wheel' + Phaser.Math.Between(1, 3))

        player.barHeight += PushButtonGame.AMOUNT_TO_INCREASE
        player.leftLegStreched = !player.leftLegStreched

        player.playerImage
            ?.setTexture(
                `pb_kyo${player.id}_${player.leftLegStreched ? '1' : '2'}`
            )
            .setScale(1 + player.barHeight / PushButtonGame.MAX_HEIGHT)
            .setAngle(player.leftLegStreched ? -3 : 3)
    }

    endGame() {
        this.gameFinished = true
        this.sound.stopAll()
        this.playerOne.timer.stop()
        this.playerTwo.timer.stop()

        this.renderBackground()
        this.playerOne.playerImage?.setToTop()
        this.playerTwo.playerImage?.setToTop()

        const scoreLabels = ['pb_text_awesome', 'pb_text_cool', 'pb_text_great']

        const starOne = this.add.image(360, 300, 'pb_star').setAlpha(0)
        const scoreOne = this.add
            .text(360, 300, this.playerOne.score + '', {
                fontFamily: 'MightySoul',
                fontSize: '48px',
                color: 'black',
            })
            .setOrigin()
            .setAlpha(0)
        const scoreOneLabel = this.add
            .image(370, 440, scoreLabels[Between(0, scoreLabels.length)])
            .setScale(0.8, 0.8)
            .setAlpha(0)

        const starTwo = this.add.image(660, 300, 'pb_star').setAlpha(0)
        const scoreTwo = this.add
            .text(660, 300, this.playerTwo.score + '', {
                fontFamily: 'MightySoul',
                fontSize: '48px',
                color: 'black',
            })
            .setOrigin()
            .setAlpha(0)
        const scoreTwoLabel = this.add
            .image(650, 440, scoreLabels[Between(0, scoreLabels.length - 1)])
            .setScale(0.8, 0.8)
            .setAlpha(0)

        // Floating animation
        this.tweens.add({
            targets: [starOne, scoreOne],
            y: starOne.y - 20,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 3000,
        })
        // Fade in
        this.tweens.add({
            targets: [starOne, scoreOne],
            alpha: 1,
            ease: 'Cubic',
            duration: 1200,
            delay: 600,
        })

        // Floating animation
        this.tweens.add({
            targets: [starTwo, scoreTwo],
            y: starOne.y - 20,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: 1500,
            duration: 3000,
        })
        // Fade in
        this.tweens.add({
            targets: [starTwo, scoreTwo],
            alpha: 1,
            ease: 'Cubic',
            duration: 1200,
            delay: 1500,
        })

        // Move players
        const duration = 800
        this.tweens.add({
            targets: this.playerOne.playerImage,
            x: '+=50',
            y: '-=60',
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic',
            duration,
        })
        this.tweens.add({
            targets: this.playerTwo.playerImage,
            x: '-=50',
            y: '-=60',
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic',
            duration,
        })

        // Show score label
        this.tweens.add({
            targets: [scoreOneLabel, scoreTwoLabel],
            duration: 2000,
            alpha: 1,
            delay: 2000,
        })

        this.sound.play('pb_finish')
        this.time.delayedCall(200, () => {
            this.sound.play('pb_wow')
        })

        this.playerOne.player.addScore(this.playerOne.score)
        this.playerTwo.player.addScore(this.playerTwo.score)

        this.input.keyboard?.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(1000, 255, 255, 255)
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                (cam, effect) => {
                    this.scene.stop(PushButtonGame.IDENTIFIER)
                    this.scene.start('Lobby')
                }
            )
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
                this.startGame()
            } else {
                this.sound.play('pb_start')
            }
        } else {
            this.sound.play('pb_countdown')
        }
    }

    renderBulb() {
        const x = +this.game.config.width / 2
        const y = +this.game.config.height / 2

        this.add.line(0, 50, x, 10, x, y - 50, 0xffffff, 1)
        this.add.image(x, y, 'pb_bulb_off').setOrigin(0.5, 0.65)
        this.bulb_overlay = this.add
            .image(x, y, 'pb_bulb_on')
            .setOrigin(0.5, 0.65)
            .setAlpha(0)
    }

    renderBars() {
        this.add.image(200, 645, 'pb_bar')
        this.add.image(820, 645, 'pb_bar')

        this.playerOne.barImage = this.add.rectangle(200, 710, 10, 0, 0x07f077)
        this.playerTwo.barImage = this.add.rectangle(820, 710, 10, 0, 0x07f077)
    }

    renderScores() {
        this.playerOne.scoreText = this.add.text(171, 725, '0', {
            fontFamily: 'MightySoul',
            fontSize: '24px',
            color: '#ABCFFB',
            align: 'center',
            fixedWidth: 60,
        })

        this.playerTwo.scoreText = this.add.text(791, 725, '0', {
            fontFamily: 'MightySoul',
            fontSize: '24px',
            color: '#ABCFFB',
            align: 'center',
            fixedWidth: 60,
        })
    }

    startGame() {
        this.gameStarted = true
        this.renderPlayers()
        this.renderBulb()
        this.renderBars()
        this.renderScores()
        this.sound.play('pb_music', { loop: true })

        this.add
            .text(
                +this.game.config.width / 2,
                +this.game.config.height - 75,
                'Seconds left',
                {
                    fixedWidth: 200,
                    fontSize: '28px',
                    fontFamily: 'MightySoul',
                    align: 'center',
                }
            )
            .setOrigin()

        let gameDuration = PushButtonGame.GAME_DURATION
        const gameTime = this.add
            .text(
                +this.game.config.width / 2,
                +this.game.config.height - 120,
                gameDuration + '',
                {
                    fixedWidth: 200,
                    fontSize: '48px',
                    fontFamily: 'MightySoul',
                    align: 'center',
                }
            )
            .setOrigin()
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (gameDuration === 0) {
                    this.endGame(
                        this.playerOne.score > this.playerTwo.score
                            ? this.playerOne
                            : this.playerTwo
                    )
                } else {
                    this.addScore(this.playerOne)
                    this.addScore(this.playerTwo)
                    gameTime.setText((--gameDuration).toString())
                }
            },
            repeat: PushButtonGame.GAME_DURATION,
        })
    }

    addScore(player: PlayerState) {
        // Calculate amount of score a player gets for the current bar height
        const multiplicative =
            PushButtonGame.MAX_SCORE_PER_SECOND / PushButtonGame.MAX_HEIGHT
        const playerScore = player.barHeight * multiplicative
        player.score += Math.floor(playerScore * multiplicative)
        player.scoreText?.setText(player.score + '')
    }

    update(time: number, delta: number) {
        super.update(time, delta)

        if (this.gameStarted && !this.gameFinished) {
            // Check for keys
            if (this.playerOne.key?.isDown) {
                this.playerOne.key.isDown = false
                this.buttonPush(this.playerOne)
            }
            if (this.playerTwo.key?.isDown) {
                this.playerTwo.key.isDown = false
                this.buttonPush(this.playerTwo)
            }

            // Update bar sizes
            if (this.playerOne.barImage) {
                const bar = this.playerOne.barImage
                const heightDiff = this.playerOne.barHeight - bar.height

                bar.setPosition(bar.x, bar.y - heightDiff)
                bar.height = this.playerOne.barHeight
            }
            if (this.playerTwo.barImage) {
                const bar = this.playerTwo.barImage
                const heightDiff = this.playerTwo.barHeight - bar.height

                bar.setPosition(bar.x, bar.y - heightDiff)
                bar.height = this.playerTwo.barHeight
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
                (this.playerOne.barHeight >= this.playerTwo.barHeight
                    ? this.playerOne.barHeight
                    : this.playerTwo.barHeight) /
                    PushButtonGame.MAX_HEIGHT -
                0.02

            this.bulb_overlay?.setAlpha(overAllProgress)
        }
    }
}

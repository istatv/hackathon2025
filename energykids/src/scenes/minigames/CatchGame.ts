import { Player } from '../../shared/entities/Player.ts'
import Rectangle = Phaser.GameObjects.Rectangle
import SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE
import TimeStep = Phaser.Core.TimeStep
import { EnergykidsGamecontrol } from '../../shared/EnergykidsGamecontrol'

export class CatchGame extends Phaser.Scene {
    public static readonly IDENTIFIER: string = 'CatchGame'

    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text
    time_step_player1: Phaser.Core.TimeStep
    time_step_player2: Phaser.Core.TimeStep

    gamecontrol = EnergykidsGamecontrol.getInstance()
    private playerOne: Player
    private playerTwo: Player
    private paddleOne: Phaser.GameObjects.Rectangle
    private paddleTwo: Phaser.GameObjects.Rectangle
    private gameIsOver = true

    private countdownText: Phaser.GameObjects.Text
    private countdown = 5
    private countdownTimer: Phaser.Time.TimerEvent

    public static State = {
        INTRO: 'INTRO',
        INGAME: 'INGAME',
        STOP: 'STOP',
    }

    private gamestate = CatchGame.State.INTRO
    private overlayGroup: any[]
    private ballPool: any[]
    private ballTypes: any[]
    private tick: number = 0

    constructor() {
        super(CatchGame.IDENTIFIER)
        this.playerOne = this.gamecontrol.getPlayerAt(0)
        this.playerTwo = this.gamecontrol.getPlayerAt(1)

        this.ballPool = []
        this.ballTypes = [
            { color: 0xff0000, effect: 5 },
            { color: 0x00ff00, effect: 20 },
            { color: 0xffff00, effect: -10 },
        ]
        this.initBallPool()
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff00ff)

        this.addPlayers()
        this.addIntroOverlay()
        this.addBalls()
        this.initBindings()
    }

    initBallPool() {
        const totalBalls = 10
        for (let idx = 0; idx < totalBalls; idx++) {
            const rdx =
                Math.floor(Date.now() * Math.random()) % this.ballTypes.length
            console.log(rdx)
            const bt = this.ballTypes[rdx]
            const ball = {
                id: idx,
                // color: bt.color,
                pX: 0,
                pY: 0,
                r: 10,
                vY: 0,
                isActive: false,
            }
            ball.__proto__ = bt
            this.ballPool.push(ball)
        }
    }

    addPlayers() {
        const { width, height } = this.game.config
        const wha = width * 0.5
        const hha = height * 0.5
        const size = 150
        let oy = height - size * 0.75 + Math.random() * 5 - 5

        this.paddleOne = {
            tOff: Math.round(Math.random() * Date.now()),
            oY: oy,
            currX: wha - 200,
            nextX: wha - 200,
            leftKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            ),
            rightKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            ),
        }
        this.paddleOne.__proto__ = this.add.rectangle(
            wha - 200,
            oy,
            size,
            size,
            0x0000ff,
            0x555555
        )
        

        oy = height - size * 0.75 + Math.random() * 5 - 5
        this.paddleTwo = {
            tOff: Math.round(Math.random() * Date.now()),
            oY: oy,
            currX: wha + 200,
            nextX: wha + 200,
            leftKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.J
            ),
            rightKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.L
            ),
        }
        this.paddleTwo.__proto__ = this.add.rectangle(
            wha + 200,
            oy,
            size,
            size,
            0x0000ff,
            0x555555
        )
    }

    addBalls() {
        const { width, height } = this.game.config
        let dx = width * 0.5
        let dy = height * 0.5

        for (const ball of this.ballPool) {
            const step = ball.r + ball.r * 2
            this.add.circle((dx += step), dy, ball.r, ball.color)
        }
    }

    addIntroOverlay() {
        const cw = this.game.config.width
        const ch = this.game.config.height
        let m = 5
        let x = cw * 0.5
        let y = ch * 0.5
        x = cw * 0.5
        y = ch * 0.5
        let w = 1024 - m * 60
        let h = 768 - m * 60

        this.overlayGroup = []
        // this.overlay =
        const controlsTextStyle = {
            align: 'center',
            fontSize: '30px',
            wordWrap: { width: 600 },
        }
        const creditsTextStyle = {
            align: 'center',
            fontSize: '30px',
            wordWrap: { width: 150 },
        }

        this.overlayGroup = this.overlayGroup.concat([
            this.add.rectangle(x, y, w, h, 0xffffff, 0x555555),
            this.add.text(
                +this.game.config.width / 2 - 200,
                +this.game.config.height / 2 - 200,
                this.playerOne.name + ': ← [A] [D] ➔',
                controlsTextStyle
            ),
            this.add.text(
                +this.game.config.width / 2 - 200,
                +this.game.config.height / 2 - 150,
                this.playerTwo.name + ': ← [K] [L] ➔',
                controlsTextStyle
            ),

            this.add.circle(w - 420, h - 120, 20, this.ballTypes[0].color),
            this.add.circle(w - 220, h - 120, 20, this.ballTypes[1].color),
            this.add.circle(w - 10, h - 120, 20, this.ballTypes[2].color),
            this.add.text(
                cw * 0.5 - 250,
                ch * 0.5 + 20,
                this.ballTypes[0].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 - 70,
                ch * 0.5 + 20,
                this.ballTypes[1].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 + 140,
                ch * 0.5 + 20,
                this.ballTypes[2].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 - 200,
                ch * 0.5 + 140,
                '[press space to start]',
                controlsTextStyle
            ),
        ])
        // this.overlayGroup[0].contains
    }

    tween(currX:number, nextX:number, easingFactor = 0.1) {
    if (easingFactor <= 0 || easingFactor >= 1) {
        throw new Error("Easing factor must be between 0 and 1 (exclusive).");
    }

    // Calculate the difference and apply the easing
    const delta = nextX - currX;
    const step = delta * easingFactor;

    // Update the current position
    currX += step;

    // Return the updated position
    return currX;
    }

    update() {
        this.tick = (this.tick + 1) % Number.MAX_VALUE
        this.computePaddlesFloat(this.paddleOne)
        this.computePaddlesFloat(this.paddleTwo)
        console.log(this)
        if(this.paddleOne.leftKey.isDown) {
            this.paddleOne.nextX -= 10
        }
        if (this.paddleOne.rightKey.isDown) {
            // console.log("aaaa");
            this.paddleOne.nextX += 10
        }
        if (this.paddleTwo.leftKey.isDown) {
            this.paddleTwo.nextX -= 10
        }
        if (this.paddleTwo.rightKey.isDown) {
            // console.log("aaaa");
            this.paddleTwo.nextX += 10
        }


        this.paddleOne.currX = this.tween(this.paddleOne.currX, this.paddleOne.nextX, 0.1)

        this.paddleTwo.currX = this.tween(
            this.paddleTwo.currX,
            this.paddleTwo.nextX,
            0.1
        )

        this.paddleOne.__proto__.setX(this.paddleOne.currX)

        this.paddleTwo.currX = this.tween(
            this.paddleTwo.currX,
            this.paddleTwo.nextX,
            0.1
        )

        this.paddleTwo.__proto__.setX(this.paddleTwo.currX)

        if (this.gamestate == CatchGame.State.INGAME) {
            //console.log('!!!!', this)
        }
    }

    computePaddlesFloat(paddle: any) {
        let angle = ((this.tick + paddle.tOff) * 0.00051) % 360
        let diff = 10 * Math.sin(angle * (180 / Math.PI))
        let dy = paddle.oY + diff
        paddle.__proto__.setY(dy)
    }

    startGameloop() {
        this.gamestate = CatchGame.State.INGAME
        //     this.countdownTimer = this.time.addEvent({
        //         delay: 250,
        //         callback: () => this.compute(),
        //         callbackScope: this,
        //         loop: true,
        //     })
    }

    initBindings() {
        // close the modal start the game
        // this.input.keyboard?.on('keydown-A', () => {
        //     this.paddleOne.nextX -= 10;
        // })
        // this.input.keyboard?.on('keydown-D', () => {
        //     this.paddleOne.nextX += 10
        // })
        // this.input.keyboard?.on('keydown-J', () => {
        //     this.paddleTwo.nextX -= 10
        // })
        // this.input.keyboard?.on('keydown-L', () => {
        //     this.paddleTwo.nextX += 10
        // });

        this.input.keyboard?.on('keyup-SPACE', () => {
            if (this.gamestate == CatchGame.State.INTRO) {
                for (const item of this.overlayGroup) {
                    item.destroy(true)
                }
                this.startGameloop()
            } else {
                console.log('NOPE', this.gamestate)
            }
        })
    }

    // this.add.text(50,50,'catch the raindrops!',{}).setOrigin(0, 0.5)

    // this.countdownText = this.add.text(
    //     +this.game.config.width / 2 - 100,
    //     +this.game.config.height / 2 - 50,
    //     this.countdown.toString(),
    //     {
    //         fontSize: '100px',
    //         align: 'center',
    //         fixedWidth: 200,
    //     }
    // )

    // this.background = this.add.image(512, 384, 'background')
    // this.background.setAlpha(0.5)

    // this.rectangle_player1 = this.add.rectangle(100, 100, 0, 50, 0xff7448)
    // this.rectangle_player2 = this.add.rectangle(100, 200, 0, 50, 0xff7335)

    // this.time_step_player1 = new TimeStep(this.game, {
    //     smoothStep: true,
    // })
    // this.time_step_player2 = new TimeStep(this.game, {
    //     smoothStep: true,
    // })
    // this.time_step_player1.start((time, delta) =>
    //     this.reduceBar(delta, this.rectangle_player1)
    // )
    // this.time_step_player2.start((time, delta) =>
    //     this.reduceBar(delta, this.rectangle_player2)
    // )

    // this.input.keyboard?.on('keyup-SPACE', () => {
    //     this.buttonPush(
    //         this.rectangle_player1,
    //         this.playerOne,
    //         this.gameIsOver
    //     )
    // })

    // this.input.keyboard?.on('keyup-CTRL', () => {
    //     this.buttonPush(
    //         this.rectangle_player2,
    //         this.playerTwo,
    //         this.gameIsOver
    //     )
    // })

    // reduceBar(delta, rectangle: Rectangle) {
    //     rectangle.width -= delta * PushButtonGame.REDUCTION_SPEED
    //     if (rectangle.width <= 0) {
    //         rectangle.width = 0
    //     }
    // }

    // buttonPush(rectangle: Rectangle, player: Player, gameIsOver = false) {
    //     if (!gameIsOver) {
    //         if (rectangle.width < PushButtonGame.MAX_WIDTH) {
    //             rectangle.width += PushButtonGame.AMOUNT_TO_INCREASE
    //         } else {
    //             this.gameWon(player)
    //         }
    //     }
    // }

    // gameWon(player: Player) {
    //     this.add.text(
    //         +this.game.config.width / 2 - 200,
    //         +this.game.config.height / 2 - 100,
    //         'Congratulations ' +
    //             player.name +
    //             ', you have won! \n\n Press enter to return to the lobby.',
    //         {
    //             align: 'center',
    //             fontSize: '40px',
    //             wordWrap: { width: 400 },
    //         }
    //     )
    //     this.time_step_player1.stop()
    //     this.time_step_player2.stop()
    //     this.gameIsOver = true
    //     this.backToLobby()
    // }

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

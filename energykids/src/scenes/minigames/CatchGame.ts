import { Player } from '../../shared/entities/Player.ts'
import { EnergykidsGamecontrol } from '../../shared/EnergykidsGamecontrol'

const MAIN_FONT = 'MightySoul'
const TOTAL_BALLS = 5
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

    public static State = {
        INTRO: 'INTRO',
        INGAME: 'INGAME',
        OUTRO: 'OUTRO',
    }

    private gamestate = CatchGame.State.INTRO

    private overlayGroup: any[]
    private outroGroup: any[]
    private ballPool: any[]
    private ballTypes: any[]
    private tick: number = 0

    private countdown = 0
    private countdownTimer: Phaser.Time.TimerEvent
    private countdownText: Phaser.GameObjects.Text

    private playerOneScore: number
    private playerOneText: Phaser.GameObjects.Text
    private playerTwoScore: number
    private playerTwoText: Phaser.GameObjects.Text

    constructor() {
        super(CatchGame.IDENTIFIER)
        this.playerOne = this.gamecontrol.getPlayerAt(0)
        this.playerTwo = this.gamecontrol.getPlayerAt(1)
        this.ballTypes = [
            { color: 0xffff00, effect: 5 },
            { color: 0x00ff00, effect: 20 },
            { color: 0xff0000, effect: -10 },
        ]
    }

    create() {
        this.ballPool = []
        this.outroGroup = []
        this.countdown = 30
        this.playerOneScore = 0
        this.playerTwoScore = 0
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xaaaaaa)

        this.add.image(512, 384, 'pb_background')

        // if (this.countdown <= -1) {
        //     this.countdownTimer.remove()
        //     this.countdownText.destroy()
        //     this.gameIsOver = false
        // }

        this.initBallPool()
        this.addPlayers()
        this.addSlogan()
        this.addTimerText()
        this.addScoreText()
        this.addBalls()
        this.addIntroOverlay()
        this.initBindings()
    }

    initBallPool() {
        const totalBalls = TOTAL_BALLS
        for (let idx = 0; idx < totalBalls; idx++) {
            this.ballPool.push(this.createBall(idx))
        }
    }

    createBall(idx: Number, withSprite: boolean = true) {
        const { width, height } = this.game.config
        const rdx =
            Math.floor(Date.now() * Math.random()) % this.ballTypes.length
        const bt = this.ballTypes[rdx]

        let b = {
            id: idx,
            color: bt.color,
            effect: bt.effect,
            currX: Math.random() * width,
            currY: Math.random() * height * -1,
            nextY: 999999,
            velY: (Math.random() * 3 + 2) * 0.000001,
            r: 15,
        }

        if (withSprite) {
            b = this.attachSpriteToBall(b)
        }

        return b
    }

    attachSpriteToBall(ball) {
        let sprite = [
            { color: 0xffff00, asset: 'cg_drop_water' },
            { color: 0x00ff00, asset: 'cg_drop_sun' },
            { color: 0xff0000, asset: 'cg_drop_stone' },
        ]
            .filter((s) => s.color == ball.color)
            .pop()

        ball.sprite = this.add.image(ball.currX, ball.currX, sprite.asset)

        return ball
    }

    updateBall(ball) {
        const tmp = this.createBall(ball.id)

        if (ball.sprite) {
            // console.log('destro');
            ball.sprite.destroy()
            ball.sprite = undefined
        }

        Object.keys(tmp).forEach((k) => {
            ball[k] = tmp[k]
        })

        return ball
    }

    updateText() {
        this.countdownText.setText(this.getCurrentCountdownFormated())
        this.playerOneText.setText(
            this.getFormatedScoreText(this.playerOne, this.playerOneScore)
        )
        this.playerTwoText.setText(
            this.getFormatedScoreText(this.playerTwo, this.playerTwoScore)
        )
    }

    addBalls() {
        const { height } = this.game.config
        let dy = height * 0.5

        // for (const ball of this.ballPool) {
        // ball.sprite = this.add.circle(ball.currX, dy, ball.r, ball.color)
        // }
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
            size: size,
            leftKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            ),
            rightKey: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            ),
        }
        this.paddleOne.__proto__ = this.add.image(
            wha - 200,
            oy,
            'cg_basket_orange'
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
        this.paddleTwo.__proto__ = this.add.image(
            wha - 200,
            oy,
            'cg_basket_blue'
        )
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
            fontFamily: MAIN_FONT,
        }
        const creditsTextStyle = {
            align: 'center',
            fontSize: '30px',
            wordWrap: { width: 150 },
            fontFamily: MAIN_FONT,
        }
        // let dropWater = ;
        // dropWater.scale(0.5);
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
                this.playerTwo.name + ': ← [J] [L] ➔',
                controlsTextStyle
            ),

            this.add.image(w - 420, h - 120, 'cg_drop_water'),
            this.add.image(w - 220, h - 120, 'cg_drop_sun'),
            this.add.image(w - 10, h - 120, 'cg_drop_stone'),

            this.add.text(
                cw * 0.5 - 240,
                ch * 0.5 + 20,
                this.ballTypes[0].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 - 50,
                ch * 0.5 + 20,
                this.ballTypes[1].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 + 155,
                ch * 0.5 + 20,
                this.ballTypes[2].effect + ' pkt.',
                creditsTextStyle
            ),
            this.add.text(
                cw * 0.5 - 150,
                ch * 0.5 + 140,
                '[press space to start]',
                controlsTextStyle
            ),
        ])
        // this.overlayGroup[0].contains
    }

    getWinner() {
        if (this.playerOneScore > this.playerTwoScore) {
            return this.playerOne
        } else if (this.playerOneScore < this.playerTwoScore) {
            return this.playerTwo
        } else {
            return { name: "It's a draw!" }
        }
    }

    addOutroOverlay() {
        const cw = this.game.config.width
        const ch = this.game.config.height
        let m = 5
        let x = cw * 0.5
        let y = ch * 0.5
        x = cw * 0.5
        y = ch * 0.5
        let w = 1024 - m * 60
        let h = 768 - m * 60

        this.outroGroup = []
        // this.overlay =
        const controlsTextStyle = {
            align: 'center',
            fontSize: '70px',
            wordWrap: { width: 600 },
        }
        const creditsTextStyle = {
            align: 'center',
            fontSize: '30px',
            wordWrap: { width: 600 },
        }

        this.overlayGroup = this.overlayGroup.concat([
            this.add.rectangle(x, y, w, h, 0xffffff, 0x555555),
            this.add.text(
                +this.game.config.width / 2 - 260,
                +this.game.config.height / 2 - 100,
                'WINNER?\n ' + this.getWinner().name,
                controlsTextStyle
            ),
            this.add.text(
                cw * 0.5 - 220,
                ch * 0.5 + 140,
                '[space] to return to city',
                creditsTextStyle
            ),

            //     this.add.text(
            //         +this.game.config.width / 2 - 200,
            //         +this.game.config.height / 2 - 150,
            //         this.playerTwo.name + ': ← [J] [L] ➔',
            //         controlsTextStyle
            //     ),

            //     this.add.circle(w - 420, h - 120, 20, this.ballTypes[0].color),
            //     this.add.circle(w - 220, h - 120, 20, this.ballTypes[1].color),
            //     this.add.circle(w - 10, h - 120, 20, this.ballTypes[2].color),
            //     this.add.text(
            //         cw * 0.5 - 250,
            //         ch * 0.5 + 20,
            //         this.ballTypes[0].effect + ' pkt.',
            //         creditsTextStyle
            //     ),
            //     this.add.text(
            //         cw * 0.5 - 70,
            //         ch * 0.5 + 20,
            //         this.ballTypes[1].effect + ' pkt.',
            //         creditsTextStyle
            //     ),
            //     this.add.text(
            //         cw * 0.5 + 140,
            //         ch * 0.5 + 20,
            //         this.ballTypes[2].effect + ' pkt.',
            //         creditsTextStyle
            //     ),
        ])
        // this.overlayGroup[0].contains
    }

    addSlogan() {
        const cw = this.game.config.width
        const ch = this.game.config.height
        let m = 5
        let x = cw * 0.5
        let y = ch * 0.5
        x = cw * 0.5
        y = ch * 0.5
        let w = 1024 - m * 60
        let h = 768 - m * 60

        const playerTextStyle = {
            align: 'left',
            fontSize: '28px',
            wordWrap: { width: 250 },
            fontFamily: MAIN_FONT,
        }

        this.playerOneText = this.add.text(
            20,
            20,
            'Save the City - \nBe a Hero',
            playerTextStyle
        )

        this.playerOneText = this.add.text(
            20,
            100,
            'Catching Energy',
            playerTextStyle
        )
    }

    addTimerText() {
        const cw = this.game.config.width
        const ch = this.game.config.height
        let m = 5
        let x = cw * 0.5
        let y = ch * 0.5
        x = cw * 0.5
        y = ch * 0.5
        let w = 1024 - m * 60
        let h = 768 - m * 60

        this.countdownText = this.add.text(
            cw * 0.5 - 20,
            20,
            this.getCurrentCountdownFormated(),
            {
                align: 'center',
                fontSize: '40px',
                // wordWrap: { width: 600 },
                fontFamily: MAIN_FONT,
            }
        )
        this.add.text(cw * 0.5 - 40, 60, 'seconds left', {
            align: 'center',
            fontSize: '20px',
            // wordWrap: { width: 600 },
            fontFamily: MAIN_FONT,
        })
    }

    addScoreText() {
        const cw = this.game.config.width
        const ch = this.game.config.height
        let m = 5
        let x = cw * 0.5
        let y = ch * 0.5
        x = cw * 0.5
        y = ch * 0.5
        let w = 1024 - m * 60
        let h = 768 - m * 60

        const playerTextStyle = {
            align: 'center',
            fontSize: '18px',
            wordWrap: {
                width: 250,
                fontFamily: MAIN_FONT,
            },
        }

        this.playerOneText = this.add.text(
            this.paddleOne.currX - 150,
            ch - 45,
            this.getFormatedScoreText(this.playerOne, this.playerOneScore),
            playerTextStyle
        )

        this.playerTwoText = this.add.text(
            this.paddleTwo.currX,
            ch - 45,
            this.getFormatedScoreText(this.playerTwo, this.playerTwoScore),
            playerTextStyle
        )
    }

    getCurrentCountdownFormated() {
        return this.countdown
    }

    getFormatedScoreText(player, score) {
        return player.name + ': ' + score
    }

    tween(currX: number, nextX: number, easingFactor = 0.1) {
        if (easingFactor <= 0 || easingFactor >= 1) {
            throw new Error(
                'Easing factor must be between 0 and 1 (exclusive).'
            )
        }

        // Calculate the difference and apply the easing
        const delta = nextX - currX
        const step = delta * easingFactor

        // Update the current ition
        currX += step

        // Return the updated position
        return currX
    }

    update() {
        this.tick = (this.tick + 1) % Number.MAX_VALUE

        for (const ball of this.ballPool) {
            const isIngame = this.gamestate == CatchGame.State.INGAME
            const playerOneDidCollide =
                isIngame &&
                this.circleRectangleIntersect(ball, this.paddleOne.__proto__)
            const playerTwoDidCollide =
                isIngame &&
                this.circleRectangleIntersect(ball, this.paddleTwo.__proto__)
            const ballReachedEnd = ball.currY > this.game.config.height
            const didCollide =
                ballReachedEnd || playerOneDidCollide || playerTwoDidCollide

            if (playerOneDidCollide) {
                this.playerOneScore += ball.effect
                // this.gamecontrol.getPlayerAt(0).addScore(ball.effect);
            }
            if (playerTwoDidCollide) {
                this.playerTwoScore += ball.effect
                // this.gamecontrol.getPlayerAt(1).addScore(ball.effect);
            }

            if (didCollide) {
                console.log('The circle and rectangle intersect.')
                this.updateBall(ball)
                ball.sprite.fillColor = ball.color
                ball.currY = -100
                ball.velY = (Math.random() * 6 + 2) * 0.000001
                // console.log(ball);
            }

            ball.currY = this.tween(ball.currY, ball.nextY, ball.velY)
            ball.sprite.setX(ball.currX)
            ball.sprite.setY(ball.currY)
        }

        this.calculatePaddleMovement()
        if (this.gamestate == CatchGame.State.INGAME) {
            //console.log('!!!!', this)
        }
        this.updateText()
    }

    _circleRectangleIntersect(circle: any, rectangle: any) {
        const { currX: cx, currY: cy, r: radius } = circle
        const { x: rx, y: ry, size: size } = rectangle
        const width = size
        const height = size

        // Find the closest point on the rectangle to the circle's center
        const closestX = Math.max(rx, Math.min(cx, rx + width))
        const closestY = Math.max(ry, Math.min(cy, ry + height))

        // Calculate the distance between the circle's center and this closest point
        const distanceX = cx - closestX
        const distanceY = cy - closestY

        // Check if the distance is less than the circle's radius
        return distanceX ** 2 + distanceY ** 2 <= radius ** 2
    }

    circleRectangleIntersect(circle: any, rectangle: any) {
        const { currX: cx, currY: cy, r: radius } = circle
        const { x: rx, y: ry, width: size } = rectangle
        // debugger;
        const width = size
        const height = size

        // Find the closest point on the rectangle to the circle's center
        const closestX = Math.max(rx, Math.min(cx, rx + width))
        const closestY = Math.max(ry, Math.min(cy, ry + height))

        // Calculate the distance between the circle's center and this closest point
        const distanceX = cx - closestX
        const distanceY = cy - closestY

        // Check if the distance is less than the circle's radius
        return distanceX ** 2 + distanceY ** 2 <= radius ** 2
    }

    calculatePaddleMovement() {
        this.computePaddlesFloat(this.paddleOne)
        this.computePaddlesFloat(this.paddleTwo)
        // console.log(this)
        if (this.paddleOne.leftKey.isDown) {
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

        this.paddleOne.currX = this.tween(
            this.paddleOne.currX,
            this.paddleOne.nextX,
            0.1
        )
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
    }

    computePaddlesFloat(paddle: any) {
        let angle = ((this.tick + paddle.tOff) * 0.00051) % 360
        let diff = 10 * Math.sin(angle * (180 / Math.PI))
        let dy = paddle.oY + diff
        paddle.__proto__.setY(dy)
    }

    startGameloop() {
        this.gamestate = CatchGame.State.INGAME
        this.countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true,
        })
    }

    initBindings() {
        this.input.keyboard?.on('keyup-SPACE', () => {
            if (this.gamestate == CatchGame.State.INTRO) {
                for (const item of this.overlayGroup) {
                    item.destroy(true)
                }
                this.startGameloop()
            } else if (this.gamestate == CatchGame.State.OUTRO) {
                this.gamecontrol.getPlayerAt(0).addScore(this.playerOneScore)
                this.gamecontrol.getPlayerAt(1).addScore(this.playerTwoScore)
                this.scene.start('Lobby')
            }
        })
    }

    // backToLobby() {
    //     this.input.keyboard?.on('keydown-ENTER', () => {

    //         this.scene.start('Lobby')
    //     })
    // }

    updateCountdown() {
        this.countdown--
        if (this.countdown <= 0) {
            this.gamestate = CatchGame.State.OUTRO
            this.countdownTimer.destroy()
            this.addOutroOverlay()
        }
    }
}

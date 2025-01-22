import { Scene } from 'phaser'
import { EnergykidsGamecontrol } from '../shared/EnergykidsGamecontrol.ts'
import { Util } from '../shared/Util.ts'
import Rectangle = Phaser.GameObjects.Rectangle
import Text = Phaser.GameObjects.Text
import Point = Phaser.Geom.Point

interface Player {
    shape: Rectangle
    title: Text
    subtitle: Text
    position: Point
    diameter: number
    button: string
    ready: boolean
}

export class MinigameIntro extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image

    // Retrieve data from the registry
    config: any

    players: Player[] = []

    constructor() {
        super('MinigameIntro')
    }

    setupScene() {
        this.sound.stopAll()

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x00ffea)

        this.background = this.add.image(512, 384, 'background')
        this.background.setAlpha(0.5)

        // Add Title
        this.add.text(0, 48, this.config.title, {
            align: 'center',
            fontSize: 32,
            fixedWidth: 1024,
        })

        // Add Description
        this.add.text(
            0,
            +this.game.config.height / 2 - 250,
            this.config.tutorialText,
            {
                align: 'justify',
                fontSize: 25,
                padding: {
                    left: 80,
                    right: 80,
                },
                wordWrap: {
                    width: 900,
                    useAdvancedWrap: false,
                },
            }
        )
    }

    renderPlayers() {
        const gameControl = EnergykidsGamecontrol.getInstance()
        const playerAmount = gameControl.getPlayers().length
        const division = +this.game.config.width / (playerAmount + 1)

        for (let i = 0; i < playerAmount; i++) {
            const position = new Point(
                Math.floor(division * (i + 1)),
                +this.game.config.height - 180
            )
            const diameter = 100
            const button = i === 0 ? 'R' : 'SPACE'

            const shape = this.add.ellipse(
                position.x,
                position.y,
                diameter,
                diameter,
                Util.getColorFromString(gameControl.getPlayerAt(i).name)
            )

            const subtitle = this.add.text(
                position.x - diameter - 50,
                position.y + 60,
                'Press ' + button + " when you're ready",
                {
                    align: 'center',
                    fixedWidth: 300,
                    color: 'darkblue',
                }
            )

            const title = this.add.text(
                position.x - diameter / 2,
                position.y - diameter / 2,
                'P' + (i + 1),
                {
                    align: 'center',
                    padding: {
                        top: diameter / 2 - 15,
                    },
                    fixedWidth: diameter,
                    fontSize: 35,
                    fixedHeight: diameter,
                    color: 'darkblue',
                    fontStyle: 'bold',
                }
            )

            const player: Player = {
                button,
                shape,
                position,
                diameter,
                title,
                subtitle,
                ready: false,
            }

            this.players.push(player)
        }
    }

    waitUntilReady() {
        const gameControl = EnergykidsGamecontrol.getInstance()
        const playerAmount = gameControl.getPlayers().length
        for (let i = 0; i < playerAmount; i++) {
            this.input.keyboard?.on('keydown-' + this.players[i].button, () => {
                this.players[i].subtitle.setText('Ready!')
                this.players[i].ready = true
                if (this.players.reduce((p, c) => c.ready && p, true)) {
                    this.time.delayedCall(500, () => {
                        this.add.text(
                            0,
                            +this.game.config.height / 2,
                            'Get Ready!',
                            {
                                align: 'center',
                                fixedWidth: 1024,
                                fontSize: 45,
                                color: 'white',
                                fontStyle: 'bold',
                            }
                        )
                        this.time.delayedCall(3000, () => {
                            this.scene.stop()
                            this.scene.start(this.config.sceneToStart)
                        })
                    })
                }
            })
        }
    }

    create() {
        this.config = this.registry.get('sceneConfig')
        this.setupScene()
        this.renderPlayers()
        this.waitUntilReady()
    }
}

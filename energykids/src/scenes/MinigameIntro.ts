import { Scene } from 'phaser'
import { EnergykidsGamecontrol } from '../shared/EnergykidsGamecontrol.ts'
import Text = Phaser.GameObjects.Text
import Point = Phaser.Geom.Point

interface Player {
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

        this.background = this.add.image(512, 384, 'background-minigame')
        this.background.setDisplaySize(1024, 768)

        // Add Title
        this.add.text(0, 150, this.config.title, {
            align: 'center',
            fixedWidth: 1024,
            fontSize: '48px',
            color: '#00F077',
            fontFamily: 'MightySoul',
        })

        // Add Description
        this.add.text(
            150,
            +this.game.config.height / 2 - 150,
            this.config.tutorialText,
            {
                align: 'center',
                padding: {
                    left: 80,
                    right: 80,
                },
                wordWrap: {
                    width: 600,
                    useAdvancedWrap: false,
                },
                fontSize: '32px',
                color: '#ABCFFB',
                fontFamily: 'MightySoul',
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

            const title = this.add.text(
                position.x - diameter - 50,
                position.y - 20,
                gameControl.getPlayerAt(i).name,
                {
                    align: 'center',
                    fixedWidth: 300,
                    fontSize: '32px',
                    color: '#ABCFFB',
                    fontFamily: 'MightySoul',
                }
            )

            const subtitle = this.add.text(
                position.x - 70,
                position.y + 20,
                'Press ' + button + " when you're ready",
                {
                    align: 'center',
                    fontSize: '24px',
                    color: '#ABCFFB',
                    fontFamily: 'MightySoul',
                    wordWrap: {
                        width: 310,
                        useAdvancedWrap: false,
                    },
                }
            )

            const characterKey = `character${i+1}`
            this.add.image(
                position.x,
                position.y - 100,
                this.config[characterKey]
            )

            const player: Player = {
                button,
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

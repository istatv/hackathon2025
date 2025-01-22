import { Scene } from 'phaser'
import { EnergykidsGamecontrol } from '../shared/EnergykidsGamecontrol.ts'
import { Player } from '../shared/entities/Player.ts'
import { Minigame } from '../shared/entities/Minigame.ts'
import { Minigames } from '../shared/Minigames.ts'

export class Lobby extends Scene {
    background: Phaser.GameObjects.Image
    controller: EnergykidsGamecontrol
    private players: Player[]

    constructor() {
        super('Lobby')
        this.controller = EnergykidsGamecontrol.getInstance()
    }

    create() {
        this.background = this.add.image(512, 384, 'background')
        this.players = this.controller.getPlayers()
        this.add.text(50, 50, 'Save the city - \nBe the hero')

        const start_game = this.add
            .rectangle(150, 125, 200, 50, 0x0000ff)
            .setInteractive()
            .on('pointerdown', () => {
                this.launchMiniGame(
                    Minigames[Phaser.Math.Between(0, Minigames.length - 1)]
                )
            })

        this.add
            .text(150, 125, 'Start Game', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        const exit = this.add
            .rectangle(950, 50, 100, 50, 0x0000ff)
            .setInteractive()
            .on('pointerdown', () => {})

        this.add
            .text(950, 50, 'Exit', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        this.add.rectangle(100, 700, 100, 50, 0x0000ff)

        const status = this.add
            .text(100, 700, 'Status', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        const player2 = this.add
            .rectangle(950, 700, 100, 100, 0x0000ff)
            .setInteractive()
            .on('pointerdown', () => {
                this.updatePlayerName(player2name, this.players[1])
            })

        const player1 = this.add
            .rectangle(830, 700, 100, 100, 0x0000ff)
            .setInteractive()
            .on('pointerdown', () => {
                this.updatePlayerName(player1name, this.players[0])
            })

        const player1name = this.add.text(350, 725, this.players[0].name, {})
        const player2name = this.add.text(550, 725, this.players[1].name, {})
        const player1Score = this.add.text(350, 750, '0', {})
        const player2Score = this.add.text(550, 750, '0', {})
    }

    updatePlayerName(playerName: Phaser.GameObjects.Text, player: Player) {
        // Create a background overlay
        const overlay = this.add.rectangle(512, 400, 400, 400, 0x000000, 0.7)
        overlay.setInteractive()

        // Add a container for the popup
        const popup = this.add.rectangle(512, 400, 300, 300, 0xffffff)
        popup.setStrokeStyle(2, 0x0000ff)

        const text = this.add
            .text(512, 300, 'Enter Player Name:', {
                fontSize: '24px',
                color: '#000',
            })
            .setOrigin(0.5)

        // Create an HTML input element
        const inputElement = document.createElement('input')
        inputElement.type = 'text'
        inputElement.style.position = 'absolute'
        inputElement.style.top = '50%'
        inputElement.style.left = '50%'
        inputElement.style.transform = 'translate(-50%, -50%)'
        inputElement.style.width = '200px'
        inputElement.style.height = '30px'
        inputElement.style.fontSize = '18px'
        document.body.appendChild(inputElement)

        // Add a confirm button
        const confirmButton = this.add
            .text(512, 500, 'Confirm', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#0000ff',
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                const userName = inputElement.value
                playerName.text = userName
                player.name = userName

                // Cleanup popup elements
                overlay.destroy()
                popup.destroy()
                text.destroy()
                confirmButton.destroy()
                document.body.removeChild(inputElement)
            })
    }

    launchMiniGame(game: Minigame) {
        // Add data to the registry
        this.registry.set('sceneConfig', {
            title: game.title,
            tutorialText: game.tutorialText,
            sceneToStart: game.sceneName,
        })

        this.scene.start('MinigameIntro')
    }
}

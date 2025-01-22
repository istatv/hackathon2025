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
        this.players = this.controller.getPlayers()
        this.renderCity()
        this.renderScores()
        this.renderButtons()
    }

    renderButtons() {
        this.add
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

        this.add
            .rectangle(950, 50, 100, 50, 0x0000ff)
            .setInteractive()
            .on('pointerdown', () => {})

        this.add
            .text(950, 50, 'Exit', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)
    }

    renderScores() {
        this.add.rectangle(100, 700, 100, 50, 0x0000ff)

        // Total score
        this.add
            .text(100, 700, this.controller.getTotalScore().toString(), {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        // Player 1
        const playerOneName = this.add.text(350, 725, this.players[0].name, {}) // Name
        this.add.text(350, 750, '0', {}) // Score
        this.add
            .image(950, 700, 'kyo1')
            .setInteractive()
            .on('pointerdown', () => {
                this.updatePlayerName(playerOneName, this.players[0])
            })

        // Player 2
        const playerTwoName = this.add.text(550, 725, this.players[1].name, {}) // Name
        this.add.text(550, 750, '0', {}) // Score
        this.add
            .image(830, 700, 'kyo2')
            .setInteractive()
            .on('pointerdown', () => {
                this.updatePlayerName(playerTwoName, this.players[1])
            })
    }

    renderCity() {
        this.add.image(512, 384, 'background')
        this.add.text(50, 50, 'Save the city - \nBe the hero')
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
                if (userName.trim().length > 0) {
                    playerName.text = userName
                    player.name = userName
                }

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

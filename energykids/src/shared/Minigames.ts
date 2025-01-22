import { Minigame } from './entities/Minigame.ts'

export const Minigames: Minigame[] = [
    {
        sceneName: 'PushButtonGame',
        title: 'Push the Button',
        tutorialText: `Our car has no energy anymore! You need to ride the bicycle as fast as you can to recharge it!`,
        character1: 'pb_kyo1_1',
        character2: 'pb_kyo2_1',
    },
    {
        sceneName: 'CatchGame',
        title: 'Catch something',
        tutorialText: `Litter everywhere! Use your arrow keys to catch the litter as quickly as possible!`,
        character1: 'pb_kyo1_1', // TODO: Change to the CatchGame character
        character2: 'pb_kyo2_1', // TODO: Change to the CatchGame character
    },
]

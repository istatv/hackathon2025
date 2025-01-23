import LoaderPlugin = Phaser.Loader.LoaderPlugin

export const loadCatchGameAssets = (load: LoaderPlugin) => {
    // load.image([{ key: 'pb_background', url: 'pushbutton/background.png' }])
    load.svg([
        {
            key: 'cg_drop_water',
            url: 'catchgame/water.svg',
            svgConfig: { scale: 1 },
        },
        {
            key: 'cg_drop_sun',
            url: 'catchgame/sun.svg',
            svgConfig: { scale: 1 },
        },
        {
            key: 'cg_drop_stone',
            url: 'catchgame/stone.svg',
            svgConfig: { scale: 1 },
        },
        {
            key: 'cg_basket_orange',
            url: 'catchgame/empty_basket_orange.svg',
            svgConfig: { scale: 1 },
        },
        {
            key: 'cg_basket_blue',
            url: 'catchgame/empty_basket_blue.svg',
            svgConfig: { scale: 1 },
        },
        {
            key: 'pb_kyo_1',
            url: 'catchgame/Kyo_1.svg',
            svgConfig: { scale: 0.4 },
        },
        {
            key: 'pb_kyo_2',
            url: 'catchgame/Kyo_2.svg',
            svgConfig: { scale: 0.4 },
        },
    ])
}

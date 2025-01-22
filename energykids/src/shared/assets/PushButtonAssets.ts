import LoaderPlugin = Phaser.Loader.LoaderPlugin

export const loadPushButtonAssets = (load: LoaderPlugin) => {
    load.svg([
        { key: 'pb_kyo1_1', url: 'pushbutton/Kyo_blue_Bike_A.svg' },
        { key: 'pb_kyo1_2', url: 'pushbutton/Kyo_blue_Bike_B.svg' },
        { key: 'pb_kyo2_1', url: 'pushbutton/Kyo_yellow_Bike_A.svg' },
        { key: 'pb_kyo2_2', url: 'pushbutton/Kyo_yellow_Bike_B.svg' },
        { key: 'pb_bulb_on', url: 'pushbutton/light_bulb_on.svg' },
        { key: 'pb_bulb_off', url: 'pushbutton/light_bulb_off.svg' },
        {
            key: 'pb_text_awesome',
            url: 'pushbutton/finalScore_Expression_Awesome.svg',
        },
        {
            key: 'pb_text_cool',
            url: 'pushbutton/finalScore_Expression_Cool.svg',
        },
        {
            key: 'pb_text_oops',
            url: 'pushbutton/finalScore_Expression_Oops.svg',
        },
        {
            key: 'pb_text_great',
            url: 'pushbutton/finalScore_Expression_YoureGreat.svg',
        },
        { key: 'pb_bar', url: 'pushbutton/loadingbar.svg' },
        { key: 'pb_star', url: 'pushbutton/Star.svg' },
    ])
}

export class Util {
    /**
     * Generates a color from a string by hashing it and mapping it to a hexadecimal color.
     * @param {string} str The input string (e.g., player's name).
     * @returns {number} A color in hexadecimal format.
     */
    public static getColorFromString(str: string) {
        let hash = 0

        // Create a hash from the string
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }

        // Map the hash to an RGB color
        const r = (hash >> 16) & 0xff
        const g = (hash >> 8) & 0xff
        const b = hash & 0xff

        // Convert RGB to hexadecimal
        return (r << 16) | (g << 8) | b
    }
}

/**
 * Detects country name and flag emoji from an ISO country code.
 * @param code ISO 3166-1 alpha-2 country code
 */
export const getCountryInfo = (code: string) => {
    if (!code) return { name: 'Unknown', flag: '🏳️' }
    if (code.length > 3) return { name: code, flag: '🌍' }

    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
        const name = regionNames.of(code.toUpperCase()) || code
        const flag = code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
        return { name, flag }
    } catch (e) {
        return { name: code, flag: '🏳️' }
    }
}


export default function fittext(text?: HTMLDivElement, maxRatio?: number, minRatio?: number, maxFontSize?: number, minFontSize?: number) {
    if (!maxRatio) maxRatio = 0.8
    if (!minRatio) minRatio = 0.6
    if (!maxFontSize) maxFontSize = 16
    if (!minFontSize) minFontSize = 8
    const parent = text?.parentElement
    if (text && parent) {
        const maxWidth = maxRatio * parent.offsetWidth
        const minWidth = minRatio * parent.offsetWidth
        let fontSize = (maxFontSize + minFontSize) / 2
        while (text.offsetWidth > maxWidth && fontSize >= minFontSize) {
            text.style.fontSize = `${fontSize}px`
            fontSize -= 1
        }
        while (text.offsetWidth < minWidth && fontSize <= maxFontSize) {
            text.style.fontSize = `${fontSize}px`
            fontSize += 1
        }
    }
}
export function getEventColor(type: string): string {
    switch (type) {
        case 'paper': return 'yellow'
        case 'news': return 'salmon'
        case 'event': return 'mediumspringgreen'
        case 'points':
        default: return 'deepskyblue'
    }
}
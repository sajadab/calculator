export function removeLastChar(str: string) {
    return str.substring(0, str.length - 1);
}

export function removeLastCharWithIndex(str: string, index: number) {
    return str.substring(0, str.length - index);
}

export function removeCharFromString(str: string, index: number) {
    return str.substring(0, index) + str.substring(index + 1);
}

export function isLastCharacterDigit(str: string): boolean {
    return /^\d+$/.test(str);
}

export function getStringCount(str: string, char: string): number {
    let result = 0, i = 0;
    for (i; i < str.length; i++) if (str[i] == char) result++;
    return result;
}
import {DARK_MODE_KEY} from "./CONSTANTS";


export function saveDarkMode(nightMode: boolean) {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(nightMode));
}

export function getDarkMode(): boolean {
    return JSON.parse(localStorage.getItem(DARK_MODE_KEY)??'false');
}
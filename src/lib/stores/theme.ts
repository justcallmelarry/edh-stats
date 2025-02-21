import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Get initial theme from localStorage or default to 'light'
const initialTheme = browser
    ? localStorage.getItem('theme') ?? 'light'
    : 'light';

export const theme = writable<'light' | 'dark'>(initialTheme as 'light' | 'dark');

// Update localStorage when theme changes
if (browser) {
    theme.subscribe(value => {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
    });
}
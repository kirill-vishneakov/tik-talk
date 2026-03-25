import { Injectable, signal } from '@angular/core';
import { ThemesList } from '../interfaces/theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkTheme = {
    '--dark-color': '#000000',
    '--light-color': '#fff',
    '--primary-color': '#ae7aff',
    '--primary-color-hover': '#916dca',
    '--grey-color': '#5f646d',
    '--dark-hover-color': '#161616',
    '--light-transparent-color': 'rgba(255, 255, 255, 0.75)',
    '--message-color': '#404040',
    '--background': 'url(/assets/imgs/img-bg.jpg)'
  }

   lightTheme = {
  '--dark-color': '#dce1e5',
  '--light-color': '#000000',
  '--primary-color': '#7b4bff',
  '--primary-color-hover': '#6a40da',
  '--grey-color': '#a0a4ac',
  '--dark-hover-color': '#f0f0f0',
  '--light-transparent-color': 'rgba(0, 0, 0, 0.75)',
  '--message-color': '#e0e0e0',
  '--background': 'url(/assets/imgs/bg.jpg)'
};


  themes = signal<ThemesList>({
		dark: this.darkTheme,
		light: this.lightTheme,
	})

  currentTheme = signal<keyof ThemesList>(
		(() => {
			const theme = localStorage.getItem('theme') as keyof ThemesList | null
			return theme && theme in this.themes() ? theme : 'dark'
		})()
	)

  changeTheme() {
		const themeKeys = Object.keys(this.themes()) as Array<keyof ThemesList>
		const currentIndex = themeKeys.indexOf(this.currentTheme())

		const nextIndex = (currentIndex + 1) % themeKeys.length
		const nextTheme = themeKeys[nextIndex]

		this.currentTheme.set(nextTheme)
		localStorage.setItem('theme', nextTheme.toString())
		this.setTheme()
	}

  setTheme() {
		const themeVariables = this.themes()[this.currentTheme()]
		Object.entries(themeVariables).forEach(([variable, value]) => {
			document.documentElement.style.setProperty(variable, value)
		})
	}
}

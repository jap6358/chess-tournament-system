import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// "Board" palette — inspired by ebony/ivory chess squares rather than
				// generic SaaS blues or the common cream+terracotta AI palette.
				ebony: {
					DEFAULT: '#15171C',
					50: '#F2F3F5',
					100: '#E3E5E9',
					200: '#C3C7CF',
					300: '#9BA1AD',
					400: '#6C7280',
					500: '#454A55',
					600: '#2E323B',
					700: '#22242B',
					800: '#1A1C22',
					900: '#15171C',
					950: '#0D0E11'
				},
				ivory: {
					DEFAULT: '#EDEAE1',
					50: '#FBFAF7',
					100: '#F5F3EC',
					200: '#EDEAE1',
					300: '#DDD8C9',
					400: '#C7C0AA'
				},
				gold: {
					DEFAULT: '#C9A227',
					50: '#FBF4DC',
					100: '#F5E7B3',
					300: '#DDBB4C',
					500: '#C9A227',
					600: '#9C7C1C',
					700: '#725A14'
				},
				emerald: {
					DEFAULT: '#2E6F5E',
					50: '#E7F2EF',
					100: '#C7E2DA',
					300: '#5C9C89',
					500: '#2E6F5E',
					600: '#245747',
					700: '#1B4034'
				},
				garnet: {
					DEFAULT: '#9B3B3B',
					50: '#F5E4E4',
					100: '#E8C2C2',
					300: '#C77676',
					500: '#9B3B3B',
					600: '#7C2F2F',
					700: '#5C2222'
				}
			},
			fontFamily: {
				display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
				sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
			},
			borderRadius: {
				xl: '0.875rem',
				'2xl': '1.25rem'
			},
			boxShadow: {
				card: '0 1px 2px rgba(21, 23, 28, 0.06), 0 8px 24px -12px rgba(21, 23, 28, 0.18)',
				popover: '0 12px 32px -8px rgba(21, 23, 28, 0.35)'
			},
			backgroundImage: {
				'board-grid':
					'linear-gradient(45deg, rgba(0,0,0,0.035) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.035) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.035) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.035) 75%)'
			},
			backgroundSize: {
				board: '32px 32px'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(4px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'toast-in': {
					'0%': { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.2s ease-out',
				'toast-in': 'toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
			}
		}
	},
	plugins: []
} satisfies Config;

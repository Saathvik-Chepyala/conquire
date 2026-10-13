import type { Category } from './types'

export type IconKey = 'cart' | 'wrench' | 'store' | 'cup' | 'monitor' | 'box'

export const CATEGORY_STYLE: Record<Category, { bg: string; fg: string; icon: IconKey }> = {
  eCommerce: { bg: '#dce8e7', fg: '#1b4d4c', icon: 'cart' },
  Service: { bg: '#f3eada', fg: '#8a6a2a', icon: 'wrench' },
  Retail: { bg: '#e3e6ef', fg: '#3b4a7a', icon: 'store' },
  'Food & Beverage': { bg: '#f6e4dc', fg: '#9a4a2a', icon: 'cup' },
  Digital: { bg: '#e0ecf4', fg: '#2a5a7a', icon: 'monitor' },
  Other: { bg: '#e6e6e6', fg: '#555', icon: 'box' },
}

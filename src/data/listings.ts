import raw from './listings.json'
import { validateListings } from './validate'
import type { Listing } from './types'

/** All sample listings, validated once at load. Edit src/data/listings.json to change them. */
export const listings: Listing[] = validateListings(raw)

export const allIndustries: string[] = [...new Set(listings.map((l) => l.teaser.industry))].sort()
export const allStates: string[] = [...new Set(listings.map((l) => l.teaser.location.state))].sort()

export const getListing = (id: string | undefined): Listing | undefined =>
  id ? listings.find((l) => l.id === id) : undefined

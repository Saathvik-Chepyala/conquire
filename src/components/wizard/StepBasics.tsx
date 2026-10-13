import { CATEGORIES, type Category } from '../../data/types'
import type { SellerForm } from '../../lib/sellerForm'
import { Field } from '../Field'

const PLATFORMS = ['Shopify', 'Etsy', 'Amazon FBA', 'WooCommerce', 'Stripe', 'Square', 'Booking app', 'In-person', 'Other']

export function StepBasics({ form, update }: { form: SellerForm; update: (p: Partial<SellerForm>) => void }) {
  return (
    <>
      <h2>Basics</h2>
      <p className="muted">Buyers see everything here except the name and URL until they sign the NDA.</p>
      <div className="field-row">
        <Field id="businessName" label="Business name" hint="Hidden from buyers until NDA.">
          <input id="businessName" value={form.businessName} onChange={(e) => update({ businessName: e.target.value })} />
        </Field>
        <Field id="url" label="Website (optional)" hint="Hidden from buyers until NDA.">
          <input id="url" placeholder="example.com" value={form.url} onChange={(e) => update({ url: e.target.value })} />
        </Field>
      </div>
      <div className="field-row">
        <Field id="category" label="Business type">
          <select id="category" value={form.category} onChange={(e) => update({ category: e.target.value as Category | '' })}>
            <option value="">Choose one</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field id="industry" label="Industry" hint="e.g. Home goods, Pet services, Lawn care">
          <input id="industry" value={form.industry} onChange={(e) => update({ industry: e.target.value })} />
        </Field>
      </div>
      <div className="field-row field-row-3">
        <Field id="city" label="City">
          <input id="city" value={form.city} onChange={(e) => update({ city: e.target.value })} />
        </Field>
        <Field id="state" label="State">
          <input id="state" maxLength={2} value={form.state} onChange={(e) => update({ state: e.target.value.toUpperCase() })} />
        </Field>
        <Field id="yearFounded" label="Year founded">
          <input id="yearFounded" inputMode="numeric" placeholder="2021" value={form.yearFounded} onChange={(e) => update({ yearFounded: e.target.value })} />
        </Field>
      </div>
      <Field id="platform" label="Main platform">
        <select id="platform" value={form.platform} onChange={(e) => update({ platform: e.target.value })}>
          <option value="">Choose one</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field id="tagline" label="One-line tagline" hint="Shown on your anonymous teaser. Do not include the business name.">
        <input id="tagline" placeholder="Profitable Shopify candle brand with 38% repeat customers" value={form.tagline} onChange={(e) => update({ tagline: e.target.value })} />
      </Field>
      <Field id="reasonForSale" label="Reason for sale">
        <input id="reasonForSale" placeholder="Relocating, new full-time job, retiring…" value={form.reasonForSale} onChange={(e) => update({ reasonForSale: e.target.value })} />
      </Field>
    </>
  )
}

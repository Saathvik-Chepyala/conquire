import type { SellerForm } from '../../lib/sellerForm'
import { Field } from '../Field'

export function StepOperations({ form, update }: { form: SellerForm; update: (p: Partial<SellerForm>) => void }) {
  return (
    <>
      <h2>Operations</h2>
      <p className="muted">How the business actually runs. One item per line in the lists.</p>
      <div className="field-row">
        <Field id="hoursPerWeek" label="Hours per week to run">
          <input id="hoursPerWeek" inputMode="numeric" placeholder="12" value={form.hoursPerWeek} onChange={(e) => update({ hoursPerWeek: e.target.value })} />
        </Field>
        <Field id="ownership" label="Ownership">
          <input id="ownership" value={form.ownership} onChange={(e) => update({ ownership: e.target.value })} />
        </Field>
      </div>
      <Field id="customerProfiles" label="Customer profiles" hint="Who buys, how often, and through which channel.">
        <textarea id="customerProfiles" placeholder={'Gift buyers aged 25–40 found through Instagram\nRepeat subscribers on a 6-week cycle'} value={form.customerProfiles} onChange={(e) => update({ customerProfiles: e.target.value })} />
      </Field>
      <Field id="growthOpportunities" label="Growth opportunities" hint="What a new owner could do that you have not.">
        <textarea id="growthOpportunities" placeholder={'Launch wholesale to local boutiques\nAdd a subscription option'} value={form.growthOpportunities} onChange={(e) => update({ growthOpportunities: e.target.value })} />
      </Field>
      <div className="field-row">
        <Field id="headwinds" label="Headwinds">
          <textarea id="headwinds" placeholder={'Ad costs rose 20% this year'} value={form.headwinds} onChange={(e) => update({ headwinds: e.target.value })} />
        </Field>
        <Field id="tailwinds" label="Tailwinds">
          <textarea id="tailwinds" placeholder={'Repeat rate climbing each quarter'} value={form.tailwinds} onChange={(e) => update({ tailwinds: e.target.value })} />
        </Field>
      </div>
    </>
  )
}

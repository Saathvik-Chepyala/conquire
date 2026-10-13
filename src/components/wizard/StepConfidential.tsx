import type { ExpenseInput, SellerForm } from '../../lib/sellerForm'
import { Field } from '../Field'

export function StepConfidential({ form, update }: { form: SellerForm; update: (p: Partial<SellerForm>) => void }) {
  const setExpense = (i: number, patch: Partial<ExpenseInput>) =>
    update({ expenses: form.expenses.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) })
  const addExpense = () => update({ expenses: [...form.expenses, { category: '', amount: '' }] })
  const removeExpense = (i: number) => update({ expenses: form.expenses.filter((_, idx) => idx !== i) })

  return (
    <>
      <h2>Confidential details</h2>
      <p className="muted">Only buyers who sign the NDA see this section. Add-backs turn net profit into owner earnings (SDE).</p>
      <div className="field" style={{ marginBottom: 6 }}>
        <label>Expenses by category (trailing 12 months, $)</label>
      </div>
      <div className="repeater">
        {form.expenses.map((e, i) => (
          <div key={i} className="repeater-row">
            <input placeholder="Category" value={e.category} onChange={(ev) => setExpense(i, { category: ev.target.value })} aria-label={`Expense ${i + 1} category`} />
            <input placeholder="Amount" inputMode="numeric" value={e.amount} onChange={(ev) => setExpense(i, { amount: ev.target.value })} aria-label={`Expense ${i + 1} amount`} />
            <button type="button" className="icon-btn" onClick={() => removeExpense(i)} aria-label="Remove expense" disabled={form.expenses.length <= 1}>
              ×
            </button>
          </div>
        ))}
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addExpense}>
            + Add expense
          </button>
        </div>
      </div>
      <div className="field-row">
        <Field id="ownerSalary" label="Owner salary add-back ($)" hint="What you paid yourself, added back to profit.">
          <input id="ownerSalary" inputMode="numeric" placeholder="24000" value={form.ownerSalary} onChange={(e) => update({ ownerSalary: e.target.value })} />
        </Field>
        <Field id="oneTimeExpenses" label="One-time expenses add-back ($)" hint="Non-recurring costs a buyer would not inherit.">
          <input id="oneTimeExpenses" inputMode="numeric" placeholder="3500" value={form.oneTimeExpenses} onChange={(e) => update({ oneTimeExpenses: e.target.value })} />
        </Field>
      </div>
      <Field id="unverifiedNotes" label="Anything to flag as unverified" hint="Be honest here. Gaps are flagged in the memo, never guessed.">
        <textarea id="unverifiedNotes" placeholder={'2023 tax return not yet uploaded'} value={form.unverifiedNotes} onChange={(e) => update({ unverifiedNotes: e.target.value })} />
      </Field>
    </>
  )
}

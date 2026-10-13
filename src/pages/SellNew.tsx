import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { StepBasics } from '../components/wizard/StepBasics'
import { StepConfidential } from '../components/wizard/StepConfidential'
import { StepFinancials } from '../components/wizard/StepFinancials'
import { StepOperations } from '../components/wizard/StepOperations'
import { StepReview } from '../components/wizard/StepReview'
import { EMPTY_FORM, type SellerForm } from '../lib/sellerForm'

const STEPS = ['Basics', 'Financials', 'Operations', 'Confidential', 'Review']

export default function SellNew() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<SellerForm>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const update = (patch: Partial<SellerForm>) => setForm((f) => ({ ...f, ...patch }))

  const next = () => {
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const back = () => {
    setStep((s) => Math.max(0, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="container section">
        <div className="card wizard success">
          <div className="check">
            <Icon name="check" size={32} />
          </div>
          <h2>Submitted for sign-off</h2>
          <p className="muted" style={{ maxWidth: 480, margin: '10px auto 20px' }}>
            Your memorandum draft is saved. In the full product, Conquire would verify connected sources, resolve
            flagged gaps with you, and publish the anonymous teaser once you give final approval.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link to="/buy" className="btn btn-primary">
              See how buyers browse
            </Link>
            <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setStep(0); setForm(EMPTY_FORM) }}>
              Start another listing
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isLast = step === STEPS.length - 1

  return (
    <div className="container section">
      <div className="wizard">
        <span className="eyebrow">List a business · step {step + 1} of {STEPS.length}</span>
        <div className="steps" style={{ marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i < step ? 'done' : ''} ${i === step ? 'current' : ''}`}>
              <div className="bar" />
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="card">
          {step === 0 && <StepBasics form={form} update={update} />}
          {step === 1 && <StepFinancials form={form} update={update} />}
          {step === 2 && <StepOperations form={form} update={update} />}
          {step === 3 && <StepConfidential form={form} update={update} />}
          {step === 4 && <StepReview form={form} update={update} />}

          <div className="wizard-actions">
            <button className="btn btn-ghost" onClick={back} disabled={step === 0}>
              Back
            </button>
            {isLast ? (
              <button className="btn btn-gold" disabled={!form.confirmed} onClick={() => setSubmitted(true)}>
                Submit for sign-off
              </button>
            ) : (
              <button className="btn btn-primary" onClick={next}>
                {step === STEPS.length - 2 ? 'Preview memo' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

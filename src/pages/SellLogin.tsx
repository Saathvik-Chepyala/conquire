import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field } from '../components/Field'

export default function SellLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const ready = email.trim() !== '' && password.trim() !== ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!ready) {
      setError('Enter an email and a password to continue.')
      return
    }
    navigate('/sell/new')
  }

  return (
    <div className="container section">
      <form className="card auth-card" onSubmit={submit}>
        <span className="eyebrow">Sellers</span>
        <h1>Sign in to list your business</h1>
        <p className="muted">Your listing stays anonymous until a buyer signs the NDA.</p>
        <Field id="email" label="Email">
          <input id="email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field id="password" label="Password">
          <input id="password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && (
          <div className="small" style={{ color: 'var(--red)', marginBottom: 10 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary">
            Log in
          </button>
          <button type="submit" className="btn btn-ghost">
            Create account
          </button>
        </div>
        <div className="form-note" style={{ marginTop: 16 }}>
          Demo login: any email and password work. Nothing is stored.
        </div>
      </form>
    </div>
  )
}

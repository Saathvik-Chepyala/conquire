import { resetDemo } from '../lib/storage'

export function Footer() {
  const onReset = () => {
    resetDemo()
    window.location.href = '/'
  }
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          Valuations are estimates, not appraisals. Conquire is not a licensed broker. Sample listings are
          fictional.
        </span>
        <span>
          © 2026 Conquire · <button onClick={onReset}>Reset demo</button>
        </span>
      </div>
    </footer>
  )
}

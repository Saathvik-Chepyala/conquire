import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

const root = createRoot(document.getElementById('root')!)

// App is imported lazily so a bad listings.json surfaces as a readable error
// page instead of a blank screen.
import('./App')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    console.error(err)
    root.render(
      <div style={{ maxWidth: 720, margin: '64px auto', padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <h1 style={{ fontFamily: 'Lora, Georgia, serif', color: '#1b4d4c' }}>Sample data needs a fix</h1>
        <p>The site could not load because <code>src/data/listings.json</code> has a problem:</p>
        <pre
          style={{
            background: '#f7e3e3',
            color: '#b23a3a',
            padding: 16,
            borderRadius: 10,
            whiteSpace: 'pre-wrap',
            fontSize: 14,
          }}
        >
          {message}
        </pre>
        <p>Fix the field named above, save, and this page will reload on its own.</p>
      </div>,
    )
  })

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { BuyBox } from '../lib/buyBox'
import { load, remove, save } from '../lib/storage'

interface BuyBoxContextValue {
  buyBox: BuyBox | null
  setBuyBox: (box: BuyBox | null) => void
  surveyOpen: boolean
  surveyDismissed: boolean
  openSurvey: () => void
  closeSurvey: () => void
  dismissSurvey: () => void
}

const Ctx = createContext<BuyBoxContextValue | null>(null)

export function BuyBoxProvider({ children }: { children: ReactNode }) {
  const [buyBox, setBuyBoxState] = useState<BuyBox | null>(() => load<BuyBox | null>('buybox', null))
  const [surveyDismissed, setDismissed] = useState<boolean>(() => load('buybox.dismissed', false))
  const [surveyOpen, setSurveyOpen] = useState(false)

  const setBuyBox = useCallback((box: BuyBox | null) => {
    setBuyBoxState(box)
    if (box) save('buybox', box)
    else remove('buybox')
  }, [])

  const openSurvey = useCallback(() => setSurveyOpen(true), [])
  const closeSurvey = useCallback(() => setSurveyOpen(false), [])
  const dismissSurvey = useCallback(() => {
    setSurveyOpen(false)
    setDismissed(true)
    save('buybox.dismissed', true)
  }, [])

  const value = useMemo(
    () => ({ buyBox, setBuyBox, surveyOpen, surveyDismissed, openSurvey, closeSurvey, dismissSurvey }),
    [buyBox, setBuyBox, surveyOpen, surveyDismissed, openSurvey, closeSurvey, dismissSurvey],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBuyBox(): BuyBoxContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useBuyBox must be used inside <BuyBoxProvider>')
  return v
}

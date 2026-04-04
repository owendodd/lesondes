'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '../hooks/useLang'

const messages = {
  empty:   { en: 'Add your email',  fr: 'Ajoutez votre email' },
  invalid: { en: 'Invalid email',   fr: 'Email invalide' },
  success: { en: 'Thank you!',      fr: 'Merci\u00a0!' },
  submit:  { en: 'Subscribe',       fr: "S'inscrire" },
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function NewsletterInline({ brevoFormAction }: { brevoFormAction: string }) {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [buttonText, setButtonText] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [placeholder, setPlaceholder] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const currentPlaceholder = placeholder ?? (lang === 'fr' ? 'Entrez votre email...' : 'Enter your email...')
  const currentButton = buttonText ?? messages.submit[lang]

  function flashError(key: 'empty' | 'invalid') {
    setButtonText(messages[key][lang])
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setButtonText(null), 3000)
  }

  function handleSubmit() {
    const val = email.trim()
    if (!val) { flashError('empty'); inputRef.current?.focus(); return }
    if (!isValidEmail(val)) { flashError('invalid'); inputRef.current?.focus(); return }

    if (brevoEmailRef.current) brevoEmailRef.current.value = val
    formRef.current?.submit()

    setEmail('')
    setPlaceholder(messages.success[lang])
    setSubmitted(true)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="newsletter-inline filter-[url(#roughen)]">
      <p className="newsletter-inline-title">{lang === 'fr' ? 'Infolettre' : 'Newsletter'}</p>

      <input
        ref={inputRef}
        className="newsletter-inline-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={currentPlaceholder}
        disabled={submitted}
      />

      <button
        className="newsletter-inline-submit"
        onClick={handleSubmit}
        disabled={submitted}
        style={submitted ? { opacity: 0, pointerEvents: 'none' } : undefined}
      >
        {currentButton}
      </button>

      <iframe name="brevo-nl-target" style={{ display: 'none' }} aria-hidden="true" />
      <form
        ref={formRef}
        method="POST"
        action={brevoFormAction}
        target="brevo-nl-target"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <input ref={brevoEmailRef} type="text" name="EMAIL" />
        <input type="text" name="email_address_check" defaultValue="" />
        <input type="hidden" name="locale" value="en" />
        <input type="hidden" name="html_type" value="simple" />
      </form>
    </div>
  )
}

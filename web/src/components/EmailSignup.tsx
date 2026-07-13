'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { siteDisplayClass } from '@/lib/siteSpacing'

const messages = {
  placeholder: { en: 'Sign up for updates', fr: 'Restez informés' },
  subscribe:   { en: 'Subscribe',           fr: "S'inscrire" },
  invalid:     { en: 'Invalid email',       fr: 'Email invalide' },
  success:     { en: 'Thank you!',          fr: 'Merci !' },
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function EmailSignup({ brevoFormAction }: { brevoFormAction: string }) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  const [emailVal, setEmailVal]   = useState('')
  const [error, setError]         = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inputRef      = useRef<HTMLInputElement>(null)
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef       = useRef<HTMLFormElement>(null)

  function flashInvalid() {
    setError(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setError(false), 3000)
  }

  function handleSubmit() {
    const val = emailVal.trim()
    if (!val) { inputRef.current?.focus(); return }
    if (!isValidEmail(val)) { flashInvalid(); return }

    if (brevoEmailRef.current) brevoEmailRef.current.value = val
    formRef.current?.submit()

    setEmailVal('')
    setSubmitted(true)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={`flex flex-col items-center w-full ${siteDisplayClass}`}>
      {submitted ? (
        <p className="text-center">{messages.success[lk]}</p>
      ) : (
        <div className="flex w-full flex-col items-center gap-1">
          <input
            ref={inputRef}
            type="email"
            value={emailVal}
            onChange={e => setEmailVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.placeholder[lk]}
            autoComplete="email"
            className="w-full text-center bg-transparent border-0 p-0 outline-none font-sans text-[inherit] leading-none tracking-[inherit] text-black placeholder:text-black/60 focus:placeholder:text-black/20"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="link-box cursor-pointer border-0 bg-transparent p-0 font-sans text-[inherit] leading-none tracking-[inherit] text-black whitespace-nowrap"
          >
            {error ? messages.invalid[lk] : messages.subscribe[lk]}
          </button>
        </div>
      )}

      {/* Hidden Brevo form */}
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

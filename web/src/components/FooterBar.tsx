'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'

const messages = {
  placeholder: { en: 'Enter your email', fr: 'Entrez votre email' },
  subscribe:   { en: 'Subscribe',        fr: "S'inscrire" },
  invalid:     { en: 'Invalid email',    fr: 'Email invalide' },
  success:     { en: 'Thank you!',       fr: 'Merci !' },
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function FooterBar({ contactEmail, brevoFormAction }: { contactEmail: string; brevoFormAction: string }) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  const [emailVal, setEmailVal] = useState('')
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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
    <footer className={`relative z-10 bg-[#f0f1ea] flex flex-wrap items-center justify-between gap-4 p-8 max-[740px]:p-4 ${siteFigmaTextClass}`}>
      <div className="flex flex-wrap gap-4">
        <a href={`mailto:${contactEmail}`} className="text-inherit no-underline">
          {contactEmail}
        </a>
        <a
          href="https://www.instagram.com/les.ondes.cerbere"
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit no-underline"
        >
          @les.ondes.cerbere
        </a>
      </div>

      <div className="bg-white border border-black/20 flex items-center w-full max-w-[547px] max-[740px]:max-w-full">
        <input
          ref={inputRef}
          type="email"
          value={emailVal}
          onChange={e => setEmailVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={submitted ? messages.success[lk] : messages.placeholder[lk]}
          disabled={submitted}
          autoComplete="email"
          className="flex-1 min-w-0 bg-transparent border-0 p-3 outline-none font-sans text-[inherit] leading-none tracking-[inherit] text-black placeholder:text-black/50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          className="link-box shrink-0 cursor-pointer border-0 bg-[#f0f1ea] p-3 font-sans text-[inherit] leading-none tracking-[inherit] text-black whitespace-nowrap"
        >
          {error ? messages.invalid[lk] : messages.subscribe[lk]}
        </button>
      </div>

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
    </footer>
  )
}

'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { siteArtistClass } from '@/lib/siteSpacing'

const messages = {
  empty:   { en: 'Add your email',  fr: 'Ajoutez votre email' },
  invalid: { en: 'Invalid email',   fr: 'Email invalide' },
  success: { en: 'Thank you!',      fr: 'Merci\u00a0!' },
  submit:  { en: 'Subscribe',       fr: "S'inscrire" },
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const rootBase = `flex flex-col gap-[60px] text-center ${siteArtistClass}`

const inputClass =
  'w-full border-0 bg-transparent p-0 text-center font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black/20 outline-none placeholder:text-black focus:text-black focus:placeholder:text-transparent'

const submitClass =
  'cursor-pointer border-0 bg-transparent p-0 text-center font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black underline decoration-2 underline-offset-2 outline-none hover:text-[#2b5aca]'

export function NewsletterContact({
  brevoFormAction,
  email,
  variant = 'home',
}: {
  brevoFormAction: string
  email: string
  variant?: 'home' | 'accommodation'
}) {
  const { lang } = useLang()
  const [buttonText, setButtonText] = useState<string | null>(null)
  const [emailVal, setEmailVal] = useState('')
  const [placeholder, setPlaceholder] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const langKey: keyof (typeof messages)['submit'] = lang === 'fr' ? 'fr' : 'en'

  const currentPlaceholder = placeholder ?? (lang === 'fr' ? 'Entrez votre email...' : 'Enter your email...')
  const currentButton = buttonText ?? messages.submit[langKey]

  function flashError(key: 'empty' | 'invalid') {
    setButtonText(messages[key][langKey])
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setButtonText(null), 3000)
  }

  function handleSubmit() {
    const val = emailVal.trim()
    if (!val) { flashError('empty'); inputRef.current?.focus(); return }
    if (!isValidEmail(val)) { flashError('invalid'); inputRef.current?.focus(); return }

    if (brevoEmailRef.current) brevoEmailRef.current.value = val
    formRef.current?.submit()

    setEmailVal('')
    setPlaceholder(messages.success[langKey])
    setSubmitted(true)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div
      className={
        variant === 'accommodation'
          ? `${rootBase} text-inherit max-[740px]:text-inherit`
          : rootBase
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-black uppercase">{lang === 'fr' ? 'Newsletter' : 'Newsletter'}</p>

        <input
          ref={inputRef}
          className={inputClass}
          type="email"
          value={emailVal}
          onChange={e => setEmailVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentPlaceholder}
          disabled={submitted}
        />

        <button
          className={submitClass}
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          style={submitted ? { opacity: 0, pointerEvents: 'none' } : undefined}
        >
          {currentButton}
        </button>
      </div>

      <div className="text-center leading-[1.1] tracking-[0.08em]">
        <span>{lang === 'fr' ? 'Contactez-nous à ' : 'Contact us at '}</span>
        <a href={`mailto:${email}`} className="text-inherit underline decoration-2 underline-offset-2 max-[740px]:block">
          {email}
        </a>
      </div>

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

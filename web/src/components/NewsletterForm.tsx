'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { siteTextClass, siteRoughenClass } from '@/lib/siteSpacing'

const messages = {
  placeholder: { en: 'Enter your email...', fr: 'Entrez votre email...' },
  empty:       { en: 'Add your email',      fr: 'Ajoutez votre email' },
  invalid:     { en: 'Invalid email',       fr: 'Email invalide' },
  success:     { en: 'Thank you!',          fr: 'Merci\u00a0!' },
  submit:      { en: 'Subscribe',           fr: "S'inscrire" },
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function NewsletterForm({ brevoFormAction }: { brevoFormAction: string }) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  const [emailVal, setEmailVal]       = useState('')
  const [placeholder, setPlaceholder] = useState<string | null>(null)
  const [buttonText, setButtonText]   = useState<string | null>(null)
  const [submitted, setSubmitted]     = useState(false)

  const inputRef      = useRef<HTMLInputElement>(null)
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef       = useRef<HTMLFormElement>(null)

  const currentPlaceholder = placeholder ?? messages.placeholder[lk]
  const currentButton      = buttonText  ?? messages.submit[lk]

  function flashError(key: 'empty' | 'invalid') {
    setButtonText(messages[key][lk])
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setButtonText(null), 3000)
  }

  function handleSubmit() {
    const val = emailVal.trim()
    if (!val)              { flashError('empty');   inputRef.current?.focus(); return }
    if (!isValidEmail(val)) { flashError('invalid'); inputRef.current?.focus(); return }

    if (brevoEmailRef.current) brevoEmailRef.current.value = val
    formRef.current?.submit()

    setEmailVal('')
    setPlaceholder(messages.success[lk])
    setSubmitted(true)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={`flex flex-col gap-2 ${siteTextClass} ${siteRoughenClass}`}>
      <p>{lang === 'fr' ? 'Newsletter' : 'Newsletter'}</p>
      <input
        ref={inputRef}
        type="email"
        value={emailVal}
        onChange={e => setEmailVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={currentPlaceholder}
        disabled={submitted}
        className="border-0 bg-transparent p-0 font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black outline-none placeholder:text-black focus:placeholder:text-transparent w-full"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitted}
        style={submitted ? { opacity: 0, pointerEvents: 'none' } : undefined}
        className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[inherit] leading-[inherit] tracking-[inherit] text-black underline decoration-2 underline-offset-2 hover:text-[#888] transition-colors duration-150"
      >
        {currentButton}
      </button>

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

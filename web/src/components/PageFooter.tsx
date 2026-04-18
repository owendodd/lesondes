'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { siteLinkClass, siteFooterClass, siteRoughenClass } from '@/lib/siteSpacing'
import { LangSwitcher } from '@/components/HeaderControls'
import type { SiteConfig } from '@/lib/types'

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

export function PageFooter({ config }: { config: Pick<SiteConfig, 'contactEmail' | 'brevoFormAction'> }) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  const [emailVal, setEmailVal]   = useState('')
  const [buttonText, setButtonText] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const inputRef      = useRef<HTMLInputElement>(null)
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brevoEmailRef = useRef<HTMLInputElement>(null)
  const formRef       = useRef<HTMLFormElement>(null)

  const currentButton = buttonText ?? messages.submit[lk]

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
    setButtonText(messages.success[lk])
    setSubmitted(true)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <footer className={`px-10 max-[740px]:px-4 pt-[56px] max-[740px]:pt-[48px] pb-[40px] ${siteFooterClass} ${siteRoughenClass}`}>
      <div className="flex flex-wrap gap-x-7 gap-y-5 max-[740px]:flex-col max-[740px]:gap-y-5 items-baseline">

        <LangSwitcher />

        <a href={`mailto:${config.contactEmail}`} className={siteLinkClass}>
          {config.contactEmail}
        </a>
        <a
          href="https://www.instagram.com/les.ondes.cerbere"
          target="_blank"
          rel="noopener noreferrer"
          className={siteLinkClass}
        >
          @les.ondes.cerbere
        </a>

        {/* Inline newsletter */}
        <div className="flex border-b-2 border-current items-baseline gap-x-7 w-full max-w-[400px] max-[740px]:max-w-full">
          <input
            ref={inputRef}
            type="email"
            value={emailVal}
            onChange={e => setEmailVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.placeholder[lk]}
            disabled={submitted}
            className="flex-1 h-[24px] bg-transparent border-0 p-0 outline-none font-sans text-[inherit] leading-none tracking-[inherit] text-black placeholder:text-black focus:placeholder:text-transparent"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted}
            style={submitted ? { opacity: 0, pointerEvents: 'none' } : undefined}
            className="cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[inherit] leading-none tracking-[inherit] text-black whitespace-nowrap hover:text-[#2b5aca] transition-colors duration-150"
          >
            {currentButton}
          </button>
        </div>

      </div>

      {/* Hidden Brevo form */}
      <iframe name="brevo-nl-target" style={{ display: 'none' }} aria-hidden="true" />
      <form
        ref={formRef}
        method="POST"
        action={config.brevoFormAction}
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

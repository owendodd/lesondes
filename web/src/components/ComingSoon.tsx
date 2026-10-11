'use client'

import Image from 'next/image'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'
import { useLang } from '@/hooks/useLang'
import { siteFigmaTextClass } from '@/lib/siteSpacing'
import { EmailSignup } from '@/components/EmailSignup'
import type { SanityImageRef } from '@/lib/types'

const builder = createImageUrlBuilder(client)

function imgUrl(ref?: SanityImageRef | null) {
  return ref ? builder.image(ref).auto('format').width(1200).url() : null
}

const messages = {
  planned: {
    en: 'The 2027 edition of Les Ondes is being planned. Come back soon.',
    fr: "L'édition 2027 de Les Ondes est en préparation. Revenez bientôt.",
  },
}

function Cell({ image, children }: { image?: SanityImageRef | null; children: React.ReactNode }) {
  const url = imgUrl(image)
  return (
    <div className="relative overflow-hidden">
      {url && (
        <Image
          src={url}
          alt=""
          fill
          sizes="(max-width: 740px) 100vw, 50vw"
          priority
          className="object-cover pointer-events-none"
        />
      )}
      <div className={`relative p-4 text-black ${siteFigmaTextClass}`}>{children}</div>
    </div>
  )
}

export function ComingSoon({
  images,
  contactEmail,
  brevoFormAction,
}: {
  images?: {
    brand?: SanityImageRef | null
    message?: SanityImageRef | null
    contact?: SanityImageRef | null
    signup?: SanityImageRef | null
  } | null
  contactEmail: string
  brevoFormAction: string
}) {
  const { lang } = useLang()
  const lk = lang === 'fr' ? 'fr' : 'en'

  return (
    <div className="grid flex-1 grid-cols-2 grid-rows-2 max-[740px]:grid-cols-1 max-[740px]:grid-rows-none max-[740px]:auto-rows-[50svh]">
      <Cell image={images?.brand}>
        <p className="uppercase">LES ONDES</p>
      </Cell>
      <Cell image={images?.message}>
        <p>{messages.planned[lk]}</p>
      </Cell>
      <Cell image={images?.contact}>
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
      </Cell>
      <Cell image={images?.signup}>
        <EmailSignup brevoFormAction={brevoFormAction} variant="inline" />
      </Cell>
    </div>
  )
}

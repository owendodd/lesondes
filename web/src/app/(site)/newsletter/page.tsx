import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/sanity'
import { EmailSignup } from '@/components/EmailSignup'

export const metadata: Metadata = {
  title: 'LES ONDES — Newsletter',
}

export default async function NewsletterPage() {
  const config = await getSiteConfig()

  return (
    <div className="flex-1 flex flex-col justify-center px-8 max-[740px]:px-4">
      <EmailSignup brevoFormAction={config?.brevoFormAction ?? ''} />
    </div>
  )
}

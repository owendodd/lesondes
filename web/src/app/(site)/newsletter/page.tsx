import { getSiteConfig } from '@/lib/sanity'
import { NewsletterForm } from '@/components/NewsletterForm'

export default async function NewsletterPage() {
  const config = await getSiteConfig()
  const brevoFormAction = config?.brevoFormAction ?? ''

  return (
    <div className="px-10 max-[740px]:px-4 pb-8 flex flex-col gap-4">
      <NewsletterForm brevoFormAction={brevoFormAction} />
    </div>
  )
}

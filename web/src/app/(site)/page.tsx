import { ComingSoon } from '@/components/ComingSoon'
import { getSiteConfig } from '@/lib/sanity'

export default async function Home() {
  const config = await getSiteConfig()
  return (
    <ComingSoon
      images={{
        brand: config?.comingSoonImageBrand,
        message: config?.comingSoonImageMessage,
        contact: config?.comingSoonImageContact,
        signup: config?.comingSoonImageSignup,
      }}
      contactEmail={config?.contactEmail ?? 'poste@les-ondes.fr'}
      brevoFormAction={config?.brevoFormAction ?? ''}
    />
  )
}

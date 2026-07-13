import { siteMinimalNavClass } from '@/lib/siteSpacing'

const linkClass = 'text-inherit no-underline hover:text-[#2b5aca] transition-colors duration-150'

export function FooterBar({ contactEmail }: { contactEmail: string }) {
  return (
    <footer className={`relative z-10 flex flex-wrap gap-x-6 gap-y-3 px-8 max-[740px]:px-4 pt-10 pb-4 ${siteMinimalNavClass}`}>
      <a href={`mailto:${contactEmail}`} className={linkClass}>
        {contactEmail}
      </a>
      <a
        href="https://www.instagram.com/les.ondes.cerbere"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        @les.ondes.cerbere
      </a>
    </footer>
  )
}

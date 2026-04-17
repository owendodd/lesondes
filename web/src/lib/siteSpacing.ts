/** Main text: logo, nav, artists, dates, food/wine credits — fluid 28→42px */
export const siteTextClass = 'text-[32px] leading-none tracking-[-0.02em]'

/** Body text: info/accommodation/access paragraphs */
export const siteBodyClass = 'text-[24px] leading-[1.2] tracking-[0.04em] max-w-[32em] max-[740px]:text-[20px]'

/** Roughen filter — apply to text containers (not image containers) */
export const siteRoughenClass = 'filter-[url(#roughen)]'

/** Underlined link */
export const siteLinkClass =
  'underline decoration-2 underline-offset-2 text-inherit hover:text-[#888] transition-colors duration-150'

// Legacy alias
export const siteNavClass = siteTextClass
export const siteBodyTextClass = siteTextClass

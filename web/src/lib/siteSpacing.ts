/** Nav links: 24px desktop / 22px mobile */
export const siteNavClass = 'text-[24px] max-[740px]:text-[22px] leading-none tracking-[-0.02em]'

/** Header title: fluid 48→80px */
export const siteTitleClass = 'text-[clamp(48px,calc(14.2px+4.57vw),80px)] leading-none tracking-[-0.02em]'

/** Artists + food/wine: 40px desktop / 32px mobile */
export const siteArtistClass = 'text-[40px] max-[740px]:text-[32px] leading-none tracking-[-0.02em]'

/** Footer: same size as nav but positive tracking */
export const siteFooterClass = 'text-[24px] max-[740px]:text-[22px] leading-none tracking-[0.04em]'

/** Body text: info/accommodation/access paragraphs */
export const siteBodyClass = 'text-[24px] leading-[1.2] tracking-[0.04em] max-w-[32em] max-[740px]:text-[20px]'

/** Roughen SVG filter */
export const siteRoughenClass = 'filter-[url(#roughen)]'

/** Underlined link */
export const siteLinkClass = 'underline decoration-2 underline-offset-2 text-inherit hover:text-[#888] transition-colors duration-150'

// Backward compat aliases
export const siteTextClass = siteNavClass
export const siteBodyTextClass = siteArtistClass

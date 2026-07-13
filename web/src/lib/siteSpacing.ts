/** Nav links: matches body size and letter spacing */
export const siteNavClass = 'text-[22px] max-[740px]:text-[18px] leading-[1.2] tracking-[0.04em]'

/** Header title: fluid 48→80px, scaling from ~885px */
export const siteTitleClass = 'text-[clamp(48px,calc(-2.3px+5.71vw),80px)] leading-none tracking-[-0.02em]'

/** Artists + food/wine: 34px desktop / 28px mobile */
export const siteArtistClass = 'text-[34px] max-[740px]:text-[28px] leading-none tracking-[-0.02em]'

/** Footer: matches body size */
export const siteFooterClass = 'text-[22px] max-[740px]:text-[18px] leading-none tracking-[0.04em]'

/** Body text: info/accommodation/access paragraphs */
export const siteBodyClass = 'text-[24px] leading-[1.2] tracking-[0.04em] max-w-[32em] max-[740px]:text-[20px]'

/** Minimal site (2027): nav + footer text — 32px at 1440w, scaling down fluidly */
export const siteMinimalNavClass = 'text-[clamp(17px,2.22vw,32px)] leading-none tracking-[-0.03em]'

/** Minimal site (2027): display text — ~118px at 1440w, scaling down fluidly. Regular weight; everything else is Medium */
export const siteDisplayClass = 'font-normal text-[clamp(44px,8.19vw,118px)] leading-none tracking-[-0.07em]'

/** Underlined link (standalone) */
export const siteLinkClass = 'border-b-2 border-current leading-none text-inherit hover:text-[#2b5aca] transition-colors duration-150'

/** Underlined link (inline within body text) */
export const siteInlineLinkClass = 'underline decoration-2 underline-offset-[3px] text-inherit hover:text-[#2b5aca] transition-colors duration-150'

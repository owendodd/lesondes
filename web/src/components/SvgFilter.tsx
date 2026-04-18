export function SvgFilter() {
  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      <defs>
        <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves={4} seed={10} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="roughen-header" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves={4} seed={10} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

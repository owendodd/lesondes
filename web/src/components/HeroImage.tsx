import Image from 'next/image'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'

const builder = createImageUrlBuilder(client)

type SanityImageRef = { asset: { _ref: string }; hotspot?: object; crop?: object }

export function HeroImage({ image }: { image: SanityImageRef }) {
  const url = builder.image(image).auto('format').width(1856).url()
  return (
    <div className="relative w-full h-[640px] max-[740px]:h-[260px]">
      <Image
        src={url}
        alt=""
        fill
        className="object-contain object-left max-w-none"
        priority
      />
    </div>
  )
}

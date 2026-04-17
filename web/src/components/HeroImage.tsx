import Image from 'next/image'
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from '@/lib/sanity'

const builder = createImageUrlBuilder(client)

type SanityImageRef = { asset: { _ref: string }; hotspot?: object; crop?: object }

export function HeroImage({ image }: { image: SanityImageRef }) {
  const url = builder.image(image).auto('format').width(1856).url()
  return (
    <div className="relative w-full aspect-[3/2]">
      <Image
        src={url}
        alt=""
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}

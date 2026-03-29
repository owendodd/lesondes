'use client'

export function HeroVideo() {
  return (
    <div className="flex justify-center px-6">
      <video
        className="block aspect-[3/2] w-[720px] object-cover max-[740px]:w-full"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/BG3_75.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

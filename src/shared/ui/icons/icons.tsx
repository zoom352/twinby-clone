import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const Svg = ({ size = 24, children, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    {children}
  </svg>
)

export const HeartIcon = (props: IconProps) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4 6.3 4c2.3 0 3.8 1.3 5.7 3.4C13.9 5.3 15.4 4 17.7 4 21.8 4 23.7 8.4 22 11.7 19.5 16.4 12 21 12 21Z"
    />
  </Svg>
)

export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path stroke="currentColor" strokeWidth={3} strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const StarIcon = (props: IconProps) => (
  <Svg {...props}>
    <path fill="currentColor" d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8 2.9-6Z" />
  </Svg>
)

export const FlameIcon = (props: IconProps) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M12 2c.6 3.2 2.3 5 4 6.8 1.7 1.8 3 3.7 3 6.2a7 7 0 0 1-14 0c0-2.3 1-4 2.5-5.3.2 1.6 1 2.8 2.3 3.3C9.3 9.7 10.3 5.3 12 2Z"
    />
  </Svg>
)

export const ChatIcon = (props: IconProps) => (
  <Svg {...props}>
    <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
  </Svg>
)

export const UserIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx={12} cy={8} r={4.5} fill="currentColor" />
    <path fill="currentColor" d="M3 21c0-4.4 4-7.5 9-7.5s9 3.1 9 7.5H3Z" />
  </Svg>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <Svg {...props}>
    <path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M15 5 8 12l7 7" />
  </Svg>
)

export const SendIcon = (props: IconProps) => (
  <Svg {...props}>
    <path fill="currentColor" d="M3 20.5 22 12 3 3.5v6.6L16 12 3 13.9v6.6Z" />
  </Svg>
)

export const VerifiedIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx={12} cy={12} r={10} fill="#3b9cff" />
    <path stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" d="m7.5 12 3 3 6-6" />
  </Svg>
)

export const InfoIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={2} />
    <path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" d="M12 11v6M12 7.5v.01" />
  </Svg>
)

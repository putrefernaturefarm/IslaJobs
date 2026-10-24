import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  firstName: string
  lastName: string
  size?: number
  className?: string
}

function Avatar({ src, firstName, lastName, size = 40, className }: AvatarProps) {
  const initials = getInitials(firstName, lastName)

  if (src) {
    return (
      <div
        className={cn('rounded-full overflow-hidden shrink-0', className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={`${firstName} ${lastName}`}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center shrink-0 bg-[#E7F0FD] text-[#1565D8] font-semibold',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

export { Avatar }

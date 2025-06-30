import Image from "next/image"
import { User } from "lucide-react"

interface CustomerAvatarProps {
  name: string
  imageUrl?: string
  size?: "sm" | "md" | "lg"
}

export function CustomerAvatar({ name, imageUrl, size = "md" }: CustomerAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={`${name}様のプロフィール画像`}
        width={size === "lg" ? 64 : size === "md" ? 48 : 32}
        height={size === "lg" ? 64 : size === "md" ? 48 : 32}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}>
      <User className={`${iconSizes[size]} text-gray-500`} />
    </div>
  )
}


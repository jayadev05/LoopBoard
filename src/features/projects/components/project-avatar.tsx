import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { AvatarFallback } from "@radix-ui/react-avatar"
import Image from "next/image"

interface ProjectAvatarProps{
    image?:string
    name:string
    className?:string
    fallbackClassName?:string
}

export const ProjectAvatar = ({image, name, className,fallbackClassName}:ProjectAvatarProps) => {
    if(image){
        return (
        <div className={cn('size-5 relative rounded-md overflow-hidden',className)}>
            <Image src={image} alt={name} className='object-cover' fill />
        </div>
        
        )
    }

    return (
<Avatar className={cn("size-5 rounded-md", className)}>
  <AvatarFallback className={cn(" flex items-center justify-center text-white bg-[#2563eb] font-semibold text-sm uppercase",fallbackClassName)}>
    {name[0]}
  </AvatarFallback>
</Avatar>

    )
}
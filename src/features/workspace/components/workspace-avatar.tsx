import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { AvatarFallback } from "@radix-ui/react-avatar"
import Image from "next/image"

interface WorkspaceAvatarProps{
    image?:string
    name:string
    className?:string
}

export const WorkspaceAvatar = ({image, name, className}:WorkspaceAvatarProps) => {
    if(image){
        return (
        <div className={cn('size-10 relative rounded-md overflow-hidden',className)}>
            <Image src={image} alt={name} className='object-cover' fill />
        </div>
        
        )
    }

    return (
<Avatar className={cn("size-10 rounded-md", className)}>
  <AvatarFallback className="w-10 h-10 flex items-center justify-center text-white bg-[#2563eb] font-semibold text-lg uppercase">
    {name[0]}
  </AvatarFallback>
</Avatar>

    )
}
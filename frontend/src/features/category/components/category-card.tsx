import { Category } from "../types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

type Props = {
  data: Category
  onUpdate?: () => void
  onDelete?: () => void
}

export function CategoryCard({ data, onDelete, onUpdate }: Props) {
  return (
    <div
      className="flex aspect-square flex-col overflow-hidden rounded-4xl py-6"
      style={{ backgroundColor: data.color }}
    >
      <div className="flex items-start justify-between px-6">
        {/* Icon */}
        <div className="inline-flex aspect-square size-12 items-center justify-center rounded-xl bg-white shadow-sm select-none">
          <span className="text-2xl">{data.icon}</span>
        </div>

        {/* More */}
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <EllipsisIcon className="size-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onUpdate}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 flex-col justify-end px-6">
        <h5
          className="font-heading text-lg font-bold"
          style={{ color: `color-mix(in srgb, ${data.color}, black 65%)` }}
        >
          {data.name}
        </h5>
        <p
          className="text-sm capitalize"
          style={{ color: `color-mix(in srgb, ${data.color}, black 40%)` }}
        >
          {data.type}
        </p>
      </div>
    </div>
  )
}

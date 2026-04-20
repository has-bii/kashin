import { useCategoryContext } from "../hooks/use-category-context"
import { Category } from "../types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CATEGORY_COLORS } from "@/constants/category-colors"
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"

type Props = {
  data: Category
}

export function CategoryCard({ data }: Props) {
  const { handleUpdateCategory, handleDeleteCategory } = useCategoryContext()

  const styles = CATEGORY_COLORS.find((acc) => acc.background === data.color) ?? CATEGORY_COLORS[0]

  return (
    <div
      className="flex aspect-square flex-col overflow-hidden rounded-4xl border py-6"
      style={{ backgroundColor: styles.background, borderColor: styles.border }}
    >
      <div className="flex items-start justify-between px-6">
        {/* Icon */}
        <div className="inline-flex aspect-square size-12 items-center justify-center rounded-xl bg-white shadow-sm select-none">
          <span className="text-2xl">{data.icon}</span>
        </div>

        {/* More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisIcon className="size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleUpdateCategory(data)}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => handleDeleteCategory(data)}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 flex-col justify-end px-6">
        <h5 className="font-heading text-lg font-bold" style={{ color: styles.foreground }}>
          {data.name}
        </h5>
        <p className="text-sm capitalize opacity-60" style={{ color: styles.foreground }}>
          {data.type}
        </p>
      </div>
    </div>
  )
}

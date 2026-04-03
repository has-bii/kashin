import { Category } from "../types"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

type Props = Pick<Category, "icon" | "name" | "type" | "color">

export function CategoryCard({ name, icon, color, type }: Props) {
  return (
    <Card style={{ backgroundColor: color }}>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <CardTitle className="text-2xl font-semibold">{name || "Category Name"}</CardTitle>
          <CardDescription className="text-xs capitalize">{type}</CardDescription>
        </div>
        <span className="text-5xl select-none">{icon}</span>
      </CardContent>
    </Card>
  )
}

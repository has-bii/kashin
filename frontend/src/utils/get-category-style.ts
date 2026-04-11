import { CATEGORY_COLORS } from "@/constants/category-colors"

export const getCategoryStyle = (categoryColor: string) => {
  const existed = CATEGORY_COLORS.find((acc) => acc.background === categoryColor)

  return existed
}

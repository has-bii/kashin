import { Category } from "../types"
import { createContext } from "react"

export interface CategoryContextType {
  selectedCategory: Category | null
  dialogOpen: boolean
  dialogMode: "create" | "update"
  handleAddCategory: () => void
  handleUpdateCategory: (category: Category) => void
  handleDialogClose: () => void
  dialogDeleteOpen: boolean
  selectedDeleteCategory: Category | null
  handleDeleteCategory: (category: Category) => void
  handleDeleteDialogClose: () => void
}

export const CategoryContext = createContext<CategoryContextType | null>(null)

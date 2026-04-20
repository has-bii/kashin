import { CategoryContext, CategoryContextType } from "../context/category.context"
import { Category } from "../types"
import React from "react"

type Props = {
  children: React.ReactNode
}

export function CategoryProvider({ children }: Props) {
  /* ------------------------ Create and Update States ------------------------ */
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const dialogMode = selectedCategory ? "update" : "create"

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleUpdateCategory = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  /* ------------------------------ Delete State ------------------------------ */
  const [selectedDeleteCategory, setSelectedDeleteCategory] = React.useState<Category | null>(null)
  const [dialogDeleteOpen, setDeleteDialogOpen] = React.useState(false)

  const handleDeleteCategory = (category: Category) => {
    setSelectedDeleteCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  const value: CategoryContextType = {
    selectedCategory,
    dialogOpen,
    dialogMode,
    handleAddCategory,
    handleUpdateCategory,
    handleDialogClose,
    dialogDeleteOpen,
    selectedDeleteCategory,
    handleDeleteCategory,
    handleDeleteDialogClose,
  }

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

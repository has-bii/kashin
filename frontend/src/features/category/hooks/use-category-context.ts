import { CategoryContext } from "../context/category.context"
import React from "react"

export const useCategoryContext = () => {
  const context = React.useContext(CategoryContext)
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider")
  }
  return context
}

import { parseAsStringEnum, useQueryState } from "nuqs"

enum Type {
  expense = "expense",
  income = "income",
}

export const useGetCategoryFilter = () => {
  const [type, setType] = useQueryState("type", parseAsStringEnum<Type>(Object.values(Type)))

  return { type, setType }
}

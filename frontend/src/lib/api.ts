import axios, { isAxiosError } from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Normalize backend error messages so error.message always reflects
// the server's response body instead of Axios's generic text.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.data?.error) {
      error.message = error.response.data.error
    }
    return Promise.reject(error)
  },
)

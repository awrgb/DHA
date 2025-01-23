import { apiClient } from "../api-client"

export const placesApi = {
   getOrg: async () => {
    const response = await apiClient.get<any>("/places/organizations")
    return response.data
  },

  getUser: async () => {
    const response = await apiClient.get<any>("/user/me")
    return response.data
  },
}

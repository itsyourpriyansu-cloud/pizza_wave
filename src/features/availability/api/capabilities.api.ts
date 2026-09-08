import { apiClient } from '../../../services/api/client'
import { endpoints } from '../../../services/api/endpoints'
import { capabilitiesSchema } from '../../../services/api/contracts'
export const getCapabilities = async () => capabilitiesSchema.parse((await apiClient.get(endpoints.capabilities)).data)

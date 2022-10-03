import React from 'react'
import { EquilibriumClient } from 'client/core'

const EquilibriumClientContext = React.createContext<{
  client: EquilibriumClient | null
  connectSigning: () => void
}>({
  client: null,
  connectSigning: () => {},
})
export default EquilibriumClientContext

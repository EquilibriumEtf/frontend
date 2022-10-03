import { useContext } from 'react'
import EquilibriumContext from './EquilibriumContext'

export default function useEquilibriumClient() {
  const client = useContext(EquilibriumContext)
  return client
}

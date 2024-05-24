import { FarmWithStakedValue } from '@pancakeswap/farms'
import { createContext } from 'react'

export const FarmsContext = createContext<{chosenFarmsMemoized: FarmWithStakedValue[]}>({ chosenFarmsMemoized: [] })

import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.developerOptionEnabled),
)
const setContext = React.createContext<SetContext>((_: boolean) => {})

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('developerOptionEnabled')),
  )

  const setStateWrapped = React.useCallback(
    (developerOptionEnabled: persisted.Schema['developerOptionEnabled']) => {
      setState(Boolean(developerOptionEnabled))
      persisted.write('developerOptionEnabled', developerOptionEnabled)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('developerOptionEnabled', nextDeveloperOption => {
      setState(Boolean(nextDeveloperOption))
    })
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export const useDeveloperOption = () => React.useContext(stateContext)
export const useSetDeveloperOption = () => React.useContext(setContext)

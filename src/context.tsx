import React, { createContext, useState, useContext } from 'react'

export type dataType = {
  id: string
  list: Array<string>
  name: string
  path: string
  originList: string[]
}

type selectedDirectoryType = {
  list: string[]
}

type contextType = {
  directory: [dataType[], React.Dispatch<React.SetStateAction<dataType[]>>]
  selectedDirectory: [
    selectedDirectoryType | undefined,
    React.Dispatch<React.SetStateAction<selectedDirectoryType | undefined>>
  ]
}

const context = createContext<contextType>({
  directory: [[], () => void 0],
  selectedDirectory: [undefined, () => void 0],
})

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [directoryList, setDirectoryList] = useState<dataType[]>([])
  const [selectedDirectory, setSelectedDirectory] = useState<selectedDirectoryType>()

  return (
    <context.Provider
      value={{
        directory: [directoryList, setDirectoryList],
        selectedDirectory: [selectedDirectory, setSelectedDirectory],
      }}>
      {children}
    </context.Provider>
  )
}

export const useDirectoryContext = (): contextType['directory'] => {
  const [directoryList, setDirectoryList] = useContext(context).directory

  return [directoryList, setDirectoryList]
}

export const useGetSelectedDirectory = (): contextType['selectedDirectory'] => {
  const [selectedDirectory, setSelectedDirectory] = useContext(context).selectedDirectory

  return [selectedDirectory, setSelectedDirectory]
}

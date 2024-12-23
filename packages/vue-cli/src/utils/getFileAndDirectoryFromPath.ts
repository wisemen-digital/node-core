export const getFileAndDirectoryFromPath = (path: string) => {
  const splitPath = path.split("/")
  if (splitPath.length === 1) {
    return { fileName: path, directory: "." }
  }
  const fileName = splitPath[splitPath.length - 1]
  const directory = splitPath.slice(0, splitPath.length - 1).join("/")
  return { fileName, directory }
}
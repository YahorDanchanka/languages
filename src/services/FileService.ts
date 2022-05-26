import {
  FilesystemDirectory,
  Plugins,
  FilesystemEncoding,
} from 'app/src-capacitor/node_modules/@capacitor/core'

const { Filesystem } = Plugins

export async function fileExists(
  fileName: string,
  path: string = '/',
  directory: FilesystemDirectory = FilesystemDirectory.Documents
): Promise<boolean> {
  try {
    const dirList = await Filesystem.readdir({ path, directory })
    return dirList.files.some((file) => file === fileName)
  } catch (e) {}

  return false
}

export async function readFile(
  path: string,
  directory: FilesystemDirectory = FilesystemDirectory.Documents
) {
  const result = await Filesystem.readFile({
    path,
    directory,
    encoding: FilesystemEncoding.UTF8,
  })

  return JSON.parse(result.data)
}

export async function writeData(
  path: string,
  data: any,
  directory: FilesystemDirectory = FilesystemDirectory.Documents
) {
  await Filesystem.writeFile({
    path,
    directory,
    data: JSON.stringify(data),
    encoding: FilesystemEncoding.UTF8,
  })
}

import { GoogleAuth } from 'google-auth-library'

let auth: GoogleAuth | null

/**
 * Get the URL of a given v2 cloud function.
 *
 * @param {string} name the function's name
 * @param {string} location the function's location
 * @return {Promise<string>} The URL of the function
 */
export const getFunctionUrl = async (name: string, location: string) => {
  if (!auth) {
    auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    })
  }
  const projectId = await auth.getProjectId()
  const url =
    'https://cloudfunctions.googleapis.com/v2beta/' +
    `projects/${projectId}/locations/${location}/functions/${name}`

  const client = await auth.getClient()
  const res = await client.request({ url })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = res.data
  const uri = data?.serviceConfig?.uri
  if (!uri) {
    throw new Error(`Unable to retrieve uri for function at ${url}`)
  }
  return uri
}

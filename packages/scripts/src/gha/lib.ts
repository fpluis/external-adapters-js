import { DockerLabels, generateFileJSON } from '../docker-build/lib'

interface JobMatrix {
  adapter: {
    name: string
    type: string
  }[]
}

/**
 * Create a job matrix that allows our build pipeline to create and push
 * docker images
 */
export async function getJobMatrix(): Promise<JobMatrix> {
  const branch = process.env.BRANCH || ''
  const prefix = process.env.IMAGE_PREFIX || ''
  const useLatest = !!process.env.LATEST

  const dockerfile = await generateFileJSON({ prefix, branch, useLatest }, { context: '.' })
  const adapter = Object.entries(dockerfile.services).map(([k, v]) => {
    return {
      name: k,
      type: v.build.labels[DockerLabels.EA_TYPE],
    }
  })

  return { adapter }
}

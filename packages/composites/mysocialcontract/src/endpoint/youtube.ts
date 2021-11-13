import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, InputParameters } from '@chainlink/types'

const YOUTUBE_URL = 'https://youtube.googleapis.com'
const YOUTUBE_ENDPOINT = `${YOUTUBE_URL}/youtube/v3/channels`

export const supportedEndpoints = ['statistics']

export const endpointResultPaths = {
  ytSubs: 'ytSubs',
  ytViews: 'ytViews',
}

interface YoutubeResponseSchema {
  items: {
    statistics: {
      viewCount: string
      subscriberCount: string
    }
  }[]
}

const customError = (data: any) => data.Response === 'Error'

export const inputParameters: InputParameters = {
  ytChannelId: false,
  ytSubs: false,
  ytViews: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const ytChannelId = validator.validated.data.ytChannelId
  const ytSubs = validator.validated.data.ytSubs
  const ytViews = validator.validated.data.ytViews

  const promises: Promise<any>[] = []

  if (ytChannelId && (ytSubs || ytViews)) {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    const options = {
      ...config.api,
      params: {
        part: 'statistics',
        id: ytChannelId,
        key: youtubeApiKey,
      },
      url: YOUTUBE_ENDPOINT,
    }
    const promise = new Promise(async (resolve) => {
      const response = (await Requester.request<YoutubeResponseSchema>(options, customError)) as any
      const {
        data: { items },
      } = response
      const [
        {
          statistics: { viewCount, subscriberCount },
        },
      ] = items
      const props = {}
      if (ytSubs) {
        props.ytSubs = Number(subscriberCount)
      }

      if (ytViews) {
        props.ytViews = Number(viewCount)
      }

      resolve(props)
    })
    promises.push(promise)
  }

  const responses = await Promise.all(promises)
  const result = responses.reduce((result, response) => {
    return { ...result, ...response }
  }, {})

  const response = { data: { result }, status: 200 }
  return Requester.success(jobRunID, response)
}

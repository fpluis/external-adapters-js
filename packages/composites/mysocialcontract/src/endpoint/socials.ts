import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, InputParameters } from '@chainlink/types'

const YOUTUBE_ENDPOINT = `https://youtube.googleapis.com/youtube/v3/channels`
const TWITTER_ENDPOINT = `https://api.twitter.com/1.1/users/show.json`

export const supportedEndpoints = ['statistics']

export const endpointResultPaths = {
  ytSubs: 'ytSubs',
  ytViews: 'ytViews',
  twitterFollowers: 'twitterFollowers',
}

interface YoutubeResponseSchema {
  items: {
    statistics: {
      viewCount: string
      subscriberCount: string
    }
  }[]
}

interface TwitterResponseSchema {
  followers_count: number
}

const customError = (data: any) => data.Response === 'Error'

export const inputParameters: InputParameters = {
  ytChannelId: false,
  twitterUsername: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)
  if (validator.error) {
    throw validator.error
  }

  const jobRunID = validator.validated.id
  const ytChannelId = validator.validated.data.ytChannelId
  const twitterUsername = validator.validated.data.twitterUsername
  console.log(`Input parameters: ytChannelId=${ytChannelId}, twitterUsername=${twitterUsername}`)

  const promises: Promise<any>[] = []

  if (ytChannelId && ytChannelId !== '-') {
    console.log(`Request youtube with channel id ${ytChannelId}`)
    const promise = new Promise((resolve) => {
      const options = {
        ...config.api,
        params: {
          part: 'statistics',
          id: ytChannelId,
          key: process.env.YOUTUBE_API_KEY,
        },
        url: YOUTUBE_ENDPOINT,
      }
      Requester.request<YoutubeResponseSchema>(options, customError).then((request) => {
        const {
          data: { items },
        } = request
        const [
          {
            statistics: { viewCount, subscriberCount },
          },
        ] = items

        console.log(`View count: ${viewCount}, subscriberCount ${subscriberCount}`)
        resolve({ ytViews: Number(viewCount), ytSubs: Number(subscriberCount) })
      })
    })

    promises.push(promise)
  }

  if (twitterUsername && twitterUsername !== '-') {
    console.log(`Request twitter with username ${twitterUsername}`)
    const promise = new Promise((resolve) => {
      const options = {
        ...config.api,
        params: {
          screen_name: twitterUsername,
        },
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
        },
        url: TWITTER_ENDPOINT,
      }
      Requester.request<TwitterResponseSchema>(options, customError).then((request) => {
        const {
          data: { followers_count },
        } = request
        console.log(`Followers for ${twitterUsername}: ${followers_count}`)
        resolve({ twitterFollowers: followers_count })
      })
    })

    promises.push(promise)
  }

  if (promises.length > 0) {
    const responses = await Promise.all(promises)
    const {
      ytViews = 0,
      ytSubs = 0,
      twitterFollowers = 0,
    } = responses.reduce((result, response) => {
      return { ...result, ...response }
    }, {})
    console.log(
      `Results from promises: ${JSON.stringify({
        ytViews,
        ytSubs,
        twitterFollowers,
      })}`,
    )
    return Requester.success(jobRunID, {
      data: {
        result: {
          ytViews,
          ytSubs,
          twitterFollowers,
        },
      },
      status: 200,
    })
  }

  return Requester.success(jobRunID, {
    data: {},
    status: 200,
  })
}

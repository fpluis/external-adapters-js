import { AdapterRequest } from '@chainlink/types'
import request from 'supertest'
import * as process from 'process'
import { server as startServer } from '../../src'
import * as nock from 'nock'
import * as http from 'http'
import { mockYoutubeSuccess, mockTwitterSuccess } from './fixtures'

describe('execute', () => {
  const id = '1'
  let server: http.Server
  const req = request('localhost:8080')
  beforeAll(async () => {
    process.env.CACHE_ENABLED = 'false'
    process.env.YOUTUBE_API_KEY = 'mock-api-key'
    process.env.TWITTER_API_KEY = 'mock-api-key'
    if (process.env.RECORD) {
      nock.recorder.rec()
    }
    server = await startServer()
  })
  afterAll((done) => {
    if (process.env.RECORD) {
      nock.recorder.play()
    }

    nock.restore()
    nock.cleanAll()
    nock.enableNetConnect()
    server.close(done)
  })

  describe('statistics api', () => {
    it('should return success with a valid ytChannelId', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          ytChannelId: 'UCfpnY5NnBl-8L7SvICuYkYQ',
        },
      }
      mockYoutubeSuccess()

      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toEqual({
        data: {
          result: {
            ytViews: 30692800,
            ytSubs: 104000,
            twitterFollowers: 0,
          },
        },
        jobRunID: '1',
        result: {
          ytViews: 30692800,
          ytSubs: 104000,
          twitterFollowers: 0,
        },
        statusCode: 200,
      })
    })

    it('should return success with a valid twitter username', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          twitterUsername: 'twitterdev',
        },
      }
      mockTwitterSuccess()

      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        // .set('Authorization', 'Bearer mock-api-key')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toEqual({
        data: {
          result: {
            ytViews: 0,
            ytSubs: 0,
            twitterFollowers: 528832,
          },
        },
        jobRunID: '1',
        result: {
          ytViews: 0,
          ytSubs: 0,
          twitterFollowers: 528832,
        },
        statusCode: 200,
      })
    })

    it('should return success with both valid twitter username and youtube channel id', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          ytChannelId: 'UCfpnY5NnBl-8L7SvICuYkYQ',
          twitterUsername: 'twitterdev',
        },
      }
      mockYoutubeSuccess()
      mockTwitterSuccess()

      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toEqual({
        data: {
          result: {
            ytViews: 30692800,
            ytSubs: 104000,
            twitterFollowers: 528832,
          },
        },
        jobRunID: '1',
        result: {
          ytViews: 30692800,
          ytSubs: 104000,
          twitterFollowers: 528832,
        },
        statusCode: 200,
      })
    })
  })
})

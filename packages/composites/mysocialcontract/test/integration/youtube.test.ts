import { AdapterRequest } from '@chainlink/types'
import request from 'supertest'
import * as process from 'process'
import { server as startServer } from '../../src'
import * as nock from 'nock'
import * as http from 'http'
import { mockResponseSuccess } from './fixtures'

describe('execute', () => {
  const id = '1'
  let server: http.Server
  const req = request('localhost:8080')
  beforeAll(async () => {
    process.env.CACHE_ENABLED = 'false'
    process.env.YOUTUBE_API_KEY = 'mock-api-key'
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
    it('should return success with only one yt property', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          ytChannelId: 'UCfpnY5NnBl-8L7SvICuYkYQ',
          ytViews: true,
        },
      }
      mockResponseSuccess()

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
          },
        },
        jobRunID: '1',
        result: {
          ytViews: 30692800,
        },
        statusCode: 200,
      })
    })

    it('should return success with both yt properties', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          ytChannelId: 'UCfpnY5NnBl-8L7SvICuYkYQ',
          ytViews: true,
          ytSubs: true,
        },
      }
      mockResponseSuccess()

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
          },
        },
        jobRunID: '1',
        result: {
          ytViews: 30692800,
          ytSubs: 104000,
        },
        statusCode: 200,
      })
    })
  })
})

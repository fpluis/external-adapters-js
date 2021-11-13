import nock from 'nock'

export const mockResponseSuccess = (): nock =>
  nock('https://youtube.googleapis.com', {
    encodedQueryParams: true,
  })
    .get('/youtube/v3/channels')
    .query({ part: 'statistics', key: 'mock-api-key', id: 'UCfpnY5NnBl-8L7SvICuYkYQ' })
    .reply(
      200,
      (_, request) => ({
        kind: 'youtube#channelListResponse',
        etag: 'qiHAsBoe-opIX0DFSy_FBVPOdnk',
        pageInfo: {
          totalResults: 1,
          resultsPerPage: 5,
        },
        items: [
          {
            kind: 'youtube#channel',
            etag: 'i905Wr3s1NHRqvlbcqZswj-NcfE',
            id: 'UCfpnY5NnBl-8L7SvICuYkYQ',
            statistics: {
              viewCount: '30692800',
              subscriberCount: '104000',
              hiddenSubscriberCount: false,
              videoCount: '1551',
            },
          },
        ],
      }),
      [
        'Content-Type',
        'application/json',
        'Connection',
        'close',
        'Vary',
        'Accept-Encoding',
        'Vary',
        'Origin',
      ],
    )

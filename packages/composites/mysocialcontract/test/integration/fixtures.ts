import nock from 'nock'

export const mockYoutubeSuccess = (): nock =>
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

export const mockTwitterSuccess = (): nock =>
  nock('https://api.twitter.com', {
    encodedQueryParams: true,
    // reqheaders: {
    //   authorization: 'Bearer mock-api-key',
    // },
  })
    .get('/1.1/users/show.json')
    .query({ screen_name: 'twitterdev' })
    .reply(
      200,
      (_, request) => ({
        id: 2244994945,
        id_str: '2244994945',
        name: 'Twitter Dev',
        screen_name: 'TwitterDev',
        location: '127.0.0.1',
        profile_location: null,
        description:
          'The voice of the #TwitterDev team and your official source for updates, news, and events, related to the #TwitterAPI.',
        url: 'https://t.co/3ZX3TNiZCY',
        protected: false,
        followers_count: 528832,
        friends_count: 2022,
        listed_count: 1885,
      }),
      [
        'Authorization',
        'Bearer mock-api-key',
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

# Chainlink External Adapter for mysocialcontract

This adapter provides smart contracts with access to social media statistics. Currently implemented:

- Youtube channel's views
- Youtube channel's subscribers

### Environment Variables

| Required? |      Name       |                                                                                 Description                                                                                 | Options | Defaults to |
| :-------: | :-------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :---------: |
|    ✅     | YOUTUBE_API_KEY | Follow [the official docs](https://developers.google.com/youtube/v3/getting-started) to get the API key. You will need a Google Account and a Google Cloud Platform account |         |             |
|    ✅     | TWITTER_API_KEY |            Follow [the official docs](https://developer.twitter.com/en/apply-for-access) to set up a Twitter dev account. Create an app and get the Bearer Token            |         |             |

---

## mysocialcontract Endpoint

An example endpoint description

### Input Parameters

| Required? |      Name       |               Description               | Options | Defaults to |
| :-------: | :-------------: | :-------------------------------------: | :-----: | :---------: |
|           |   ytChannelId   | (String) The id of the Youtube Channel. |         |    null     |
|           | twitterUsername |       (String) Twitter username.        |         |    null     |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "ytChannelId": "UCfpnY5NnBl-8L7SvICuYkYQ",
    "twitterUsername": "twitterdev"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "result": {
      "ytViews": 30692800,
      "ytSubs": 104000,
      "twitterFollowers": 528832
    }
  },
  "statusCode": 200
}
```

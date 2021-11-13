# Chainlink External Adapter for mysocialcontract

This adapter provides smart contracts with access to social media statistics. Currently implemented:

- Youtube channel's views
- Youtube channel's subscribers

### Environment Variables

| Required? |      Name       |                                                                                 Description                                                                                 | Options | Defaults to |
| :-------: | :-------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :---------: |
|    ✅     | YOUTUBE_API_KEY | Follow [the official docs](https://developers.google.com/youtube/v3/getting-started) to get the API key. You will need a Google Account and a Google Cloud Platform account |         |             |

---

## mysocialcontract Endpoint

An example endpoint description

### Input Parameters

| Required? |    Name     |                                Description                                 | Options | Defaults to |
| :-------: | :---------: | :------------------------------------------------------------------------: | :-----: | :---------: |
|           | ytChannelId |                  (String) The id of the Youtube Channel.                   |         |    null     |
|           |   ytViews   |    (Boolean) Whether or not you want to return the channel's view count    |         |    false    |
|           |   ytSubs    | (Boolean) Whether or not you want to return the channel's subscriber count |         |    false    |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "ytChannelId": "UCfpnY5NnBl-8L7SvICuYkYQ",
    "ytViews": true,
    "ytSubs": true
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
      "ytSubs": 104000
    }
  },
  "statusCode": 200
}
```

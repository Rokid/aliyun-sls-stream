# 阿里云 SLS Stream

阿里云 SLS PutLogs Stream

## 使用方法

1. 通过 `bunyan` 使用

```js
const bunyan = require('bunyan')
const AliyunSlsStream = require('aliyun-sls-stream')

const log = bunyan.createLogger({
  name: 'foo',
  streams: [{
    type: 'raw',
    stream: new AliyunSlsStream({
      accessKeyId: 'your_very_secured_access_key_id',
      secretAccessKey: 'your_very_secured_secret_access_key',
      endpoint: 'an_aliyun_endpoint_for_sls', // refer to https://help.aliyun.com/document_detail/29008.html?spm=5176.doc28984.2.5.CMkSh1 for more details
      project: process.env.ALIYUN_PROJECT,
      logStore: process.env.ALIYUN_LOG_STORE
    }),
    reemitErrorEvents: true
  }],
  level: 'debug'
})

log.debug('foobar')
log.debug({ foo: 'bar' }, 'foobar')
log.debug({ foo: 'bar' }, 'foobar: %s', ['foo', 'bar'])

```

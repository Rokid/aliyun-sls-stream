const { test } = require('ava')
const bunyan = require('bunyan')

const AliyunSlsStream = require('../index')

test.beforeEach(async t => {
  const log = bunyan.createLogger({
    name: 'foo',
    streams: [{
      type: 'raw',
      stream: new AliyunSlsStream({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        secretAccessKey: process.env.ALIYUN_SECRET_ACCESS_KEY,
        endpoint: process.env.ALIYUN_ENDPOINT,
        project: process.env.ALIYUN_PROJECT,
        logStore: process.env.ALIYUN_LOG_STORE
      }),
      reemitErrorEvents: true
    }],
    level: 'debug'
  })
  t.context = { log }
})

test('write logs', async t => {
  const { log } = t.context
  log.debug('foobar')
  log.debug({ foo: 'bar' }, 'foobar')
  log.debug({ foo: 'bar' }, 'foobar: %s', ['foo', 'bar'])

  await new Promise(resolve => setTimeout(resolve, 2000))
  t.pass()
})

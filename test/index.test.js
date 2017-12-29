const { test } = require('ava')
const bunyan = require('bunyan')

const AliyunSlsStream = require('../index')

test.beforeEach(async t => {
  const stream = new AliyunSlsStream({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    secretAccessKey: process.env.ALIYUN_SECRET_ACCESS_KEY,
    endpoint: process.env.ALIYUN_ENDPOINT,
    project: process.env.ALIYUN_PROJECT,
    logStore: process.env.ALIYUN_LOG_STORE
  })
  const log = bunyan.createLogger({
    name: 'foo',
    streams: [{
      type: 'raw',
      stream,
      reemitErrorEvents: true
    }],
    level: 'debug'
  })
  t.context = { log, stream }
})

test('write bunyan logs', async t => {
  const { log } = t.context
  log.debug('foobar')
  log.debug({ foo: 'bar' }, 'foobar')
  log.debug({ foo: 'bar' }, 'foobar: %s', ['foo', 'bar'])

  await new Promise(resolve => setTimeout(resolve, 2000))
  t.pass()
})

test('write logs', async t => {
  const { stream } = t.context
  stream.write('message from write string')
  stream.write({ from: 'stream' })
  stream.write({ array: ['foo', 'bar'] })

  await new Promise(resolve => setTimeout(resolve, 2000))
  t.pass()
})

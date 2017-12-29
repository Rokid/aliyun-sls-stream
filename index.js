'use strict'

const { Writable } = require('stream')
const { SLS } = require('aliyun-sdk')

class AliyunSlsStream extends Writable {
  constructor (options) {
    options = Object.assign({
      apiVersion: '2015-06-01'
    }, options, { objectMode: true })
    super(options)
    this.__sls = new SLS(options)
    this.__cache = []

    this.project = options.project
    this.logStore = options.logStore

    setTimeout(() => {
      this.__flushCache(() => {})
    }, 1000)
  }

  __flushCache (callback) {
    const cache = this.__cache
    this.__cache = []
    const logs = cache.map(log => {
      return {
        time: log.__time,
        contents: Object.keys(log)
          .filter(key => key !== '__time')
          .map(key => ({
            key,
            value: String(log[key])
          }))
      }
    })

    if (logs.length > 0) {
      this.__sls.putLogs({
        logGroup: {
          logs,
          topic: '',
          source: ''
        },
        projectName: this.project,
        logStoreName: this.logStore
      }, err => {
        if (err) {
          console.error('[AliyunSlsStream] put logs errored: ', err)
        }
        callback(err)
      })
    } else {
      process.nextTick(callback)
    }
  }

  _write (chunk, encoding, callback) {
    if (typeof chunk === 'string') {
      chunk = {
        message: chunk
      }
    }
    this.__cache.push(Object.assign({}, chunk, {
      __time: Math.floor(new Date().getTime() / 1000)
    }))
    if (this.__cache.length > 100) {
      this.__flushCache(callback)
    } else {
      process.nextTick(callback)
    }
  }
}

module.exports = AliyunSlsStream

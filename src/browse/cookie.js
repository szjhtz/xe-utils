import { isArray, isObject, objectAssign, arrayEach } from '../core/base'
import { dateNow } from '../core/date'

/**
  * cookie操作函数
  * @param String/Array/Object name 键/数组/对象
  * @param String value 值
  * @param Object options 参数
  *   @param String name: 键
  *   @param Object value: 值
  *   @param String path: 路径
  *   @param String domain: 作用域
  *   @param Number expires: 几天后过期
  */
export function cookie (name, value, options) {
  var inserts = []
  if (isArray(name)) {
    inserts = name
  } else if (arguments.length > 1) {
    inserts = [objectAssign({name: name, value: value}, options)]
  } else if (isObject(name)) {
    inserts = [name]
  }
  if (inserts.length > 0) {
    arrayEach(inserts, function (obj) {
      var opts = objectAssign({}, obj)
      var values = []
      if (opts.name) {
        values.push(encodeURIComponent(opts.name) + '=' + encodeURIComponent(JSON.stringify(opts.value)))
        if (opts.expires !== undefined) {
          opts.expires = new Date(dateNow() + parseFloat(opts.expires) * 86400000).toUTCString()
        }
        arrayEach(['expires', 'path', 'domain', 'secure'], function (key) {
          if (opts[key] !== undefined) {
            values.push(key + '=' + opts[key])
          }
        })
      }
      document.cookie = values.join('; ')
    })
  } else {
    var result = {}
    if (document.cookie) {
      arrayEach(document.cookie.split('; '), function (val) {
        var items = val.split('=')
        result[decodeURIComponent(items[0])] = decodeURIComponent(items[1] || '')
      })
    }
    return arguments.length === 1 ? result[name] : result
  }
}

objectAssign(cookie, {
  setItem: function (name, key) {
    cookie(name, key)
  },
  getItem: function (name) {
    return cookie(name)
  },
  removeItem: function (name) {
    cookie(name, null, {expires: -1})
  },
  getJSON: function () {
    return cookie()
  }
})

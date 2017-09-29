'use strict'

module.exports  = SuperFilter = {
  filter:  (obj, parentKey, objKey, filter) => {
    let objs = obj.filter(function(o){
      filter.forEach(function(f){
        let i = o[parentKey][objKey].indexOf(f)
        if (i > 0) {
          return true
        }
      })
    })
    return objs
  }
}

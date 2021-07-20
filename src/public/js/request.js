const _request = (function() {
  function valid(value) {
    return value !== null && value !== undefined;
  }
  
  function makeQueryString(params) {
    if (params === null || params === undefined || params === '') {
      return '';
    }

    let result = '?';
    for (let key in params) {
      if (result.charAt(result.length-1) !== '?') {
        result += '&';
      }
      if (valid(params[key])) {
        result += key;
        result += '=';
        result += params[key];
      }
    }
  
    return result;
  }
  
  let obj = {};

  obj.get = function (url, option, cb) {
    let xhr = new XMLHttpRequest();
    // ?query=string
    let search = makeQueryString(option.params);
  
    xhr.open('GET', url + search, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    let header = option.header;
    for (let key in header) {
        xhr.setRequestHeader(key, header[key]);
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
            cb(null, JSON.parse(xhr.responseText));
        } else {
            cb(JSON.parse(xhr.responseText));
        }
        } else {
        
        }
    }

    xhr.send();
  }

  obj.post = function (url, option, cb) {
    let xhr = new XMLHttpRequest();
    let search = makeQueryString(option.params);
  
    xhr.open('POST', url + search, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    let header = option.header;
    for (let key in header) {
        xhr.setRequestHeader(key, header[key]);
    }
    
    let data = option.body || {};

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
            cb(null, JSON.parse(xhr.responseText));
        } else {
            cb(JSON.parse(xhr.responseText));
        }
        } else {
        
        }
    }

    xhr.send(JSON.stringify(data));
  } 

  return obj;
})();
import * as request from 'request';
import { URL } from 'url';
const Article = require('newspaperjs').Article

export const fetchArticle = (uri: string) => {
  return new Promise((resolve, reject) => {
    _get(uri, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function _get (uri: string, cb: Function) {
  let protocol, domain, urlPath: string;
  
  try {
    const inst = new URL(uri);
    domain = inst.hostname.toLowerCase();
    protocol = inst.protocol.toLowerCase();
    urlPath = inst.pathname.toLowerCase();
  } catch (err) {
    return cb(err);
  }

  const robotsUri = protocol + '//' + domain + '/robots.txt';

  console.log(`[Info] domain: ${robotsUri}, Checking File : robots.txt...`)
  request.get(robotsUri, (err, res) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      const contentType = res.headers['content-type'];
      const statusCode = res.statusCode;
      const body = res.body;
      
      const info = {
        contentType: contentType,
        statusCode: statusCode,
        body: body,
        urlPath: urlPath,
      }

      if (checkRobotsPolicy(info)) {
        console.log(`[Debug] Try to Site Crawling uri: ${uri} `)
        
        crawling(uri, (err: any, result: newspaperInterface) => {
          if (err) {
            cb(err);
          } else {
            cb(null, result);
          }
        });
      } else {
        console.log(`[Debug] Denied From Site uri: ${uri}`)
        cb(null, 'deny');
      }
    }
  });
};

/*
True: 로봇 정책 허용
False: 로봇 정책 비허용
참고 : https://developers.google.com/search/docs/advanced/robots/robots_txt?hl=ko
*/
function checkRobotsPolicy(params: any) {
  const { contentType, statusCode, body, urlPath } = params;

  console.log(`[Info][checkRobotsPolicy] contentType=${contentType}, statusCode=${statusCode}, urlPath=${urlPath}`);

  let lcode = level(statusCode);
  if (lcode === 2) {
    if (contentType.split(';')[0] === 'text/plain') {
      const useragentObj: any = {};
      const rows = body.split('\n').filter((row: string) => {
        return row.trim() !== '';
      });
      let useragentName: string;

      for (let row of rows) {
        const cols = row.split(':');
        const key = cols[0].trim().toLowerCase();
        const value = cols[1].trim().toLowerCase();

        if (key === 'user-agent') {
          useragentName = value;
          useragentObj[useragentName] = {};
          useragentObj[useragentName].disallow = [];
          useragentObj[useragentName].allow = [];
        } else if (key === 'disallow') {
          useragentObj[useragentName].disallow.push(value);
        } else if (key === 'allow') {
          useragentObj[useragentName].allow.push(value);
        } else {
          // TODO: sitemap 처리 (html, xml)
        }
      }

      console.log(`[Debug][checkRobotsPolicy] user-agent object: ${JSON.stringify(useragentObj)}`);

      if (useragentObj['*']) {
        // Disallow 정책 체크
        const _count1 = useragentObj['*'].disallow.filter((disallowedPath: string) => {
          return checkDisallowedPath(urlPath, disallowedPath);
        }).length;

        if (_count1 > 0) {
          return false;
        } else {
          // Allow 정책 체크
          const _count2 = useragentObj['*'].allow.filter((allowedPath: string) => {
            return checkAllowedPath(urlPath, allowedPath);
          }).length;
          
          if (_count2 > 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  } else if (lcode === 4) {
    return true;
  } else if (lcode === 5) {
    // TODO: 일시 에러있을 수도 있으니 Retry
    return false;
  } else {
    return false;
  }
}

function level(statusCode: number) {
  return statusCode / 100;
}

function checkDisallowedPath(srcPath: string, disallowPath: string) {
  console.log(`[Debug][checkDisallowedPath] srcPath: ${srcPath}, disallowPath: ${disallowPath}`);

  let len1 = srcPath.length;
  let len2 = disallowPath.length;

  if (len1 >= len2) {
    return srcPath.substring(0, len2) === disallowPath;
  } else {
    return false;
  }
}

function checkAllowedPath(srcPath: string, allowPath: string) {
  console.log(`[Debug][checkAllowedPath] srcPath: ${srcPath}, disallowPath: ${allowPath}`);

  let len1 = srcPath.length;
  let len2 = allowPath.length;

  if (len1 >= len2) {
    return srcPath.substring(0, len2) === allowPath;
  } else {
    return false;
  }
}

// newspaper npm module interface
interface newspaperInterface {
  title: string;
  text: string;
  topImage: string;
  date: string;
  author: string;
  description: string;
  keywords: Array<string>;
}

async function crawling(uri: String, cb: Function) {
  try {
    let res: newspaperInterface = await Article(uri);
    
    cb(null, res);
  } catch (err) {
    cb(err);
  }
}
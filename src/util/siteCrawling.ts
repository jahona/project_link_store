import * as request from 'request';
import * as url from 'url';

export const crawl = (uri: string) => {
  const protocol = extractProtocol(uri);
  const domain = extractDomain(uri);
  const robotsUri = protocol + '//' + domain + '/robots.txt';

  console.log(`[Info] domain: ${robotsUri}, Checking File : robots.txt...`)
  request.get(robotsUri, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.body);
    }
  });
};

function extractDomain(uri: string) {
  return new URL(uri).hostname;
}

function extractProtocol(uri: string) {
  return new URL(uri).protocol;
}
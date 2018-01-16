import {registerBidder} from 'src/adapters/bidderFactory';
import * as utils from 'src/utils';

const BIDDER_CODE = 'smartyads';
const URL = 'http://ssp-nj.webtradehub.com/?c=o&m=multi';
const URL_SYNC = 'http://ssp-nj.webtradehub.com/?c=o&m=cookie';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: ['video', 'native'],

  isBidRequestValid: (bid) => {
    return (bid['bidId'] !== undefined && bid['params'] !== undefined && bid['params']['placement_id'] !== undefined);
  },

  buildRequests: (validBidRequests = []) => {
    let winTop = window;
    try {
      window.top.location.toString();
      winTop = window.top;
    } catch (e) {
      utils.logMessage(e);
    }
    ;
    let location = utils.getTopWindowLocation();
    let placements = [];
    let request = {
      'deviceWidth': winTop.screen.width,
      'deviceHeight': winTop.screen.height,
      'language': (navigator && navigator.language) ? navigator.language : '',
      'secure': location.protocol === 'https:' ? 1 : 0,
      'host': location.host,
      'page': location.pathname,
      'placements': placements
    };
    for (let i = 0; i < validBidRequests.length; i++) {
      let bid = validBidRequests[i];
      let placement = {};
      placement['placementId'] = bid.params.placement_id;
      placement['bidId'] = bid.bidId;
      placement['traffic'] = bid.traffic || 'banner';
      placements.push(placement);
    }
    return {
      method: 'POST',
      url: URL,
      data: request
    };
  },

  interpretResponse: (serverResponse, request) => {
    let response = [];
    try {
      serverResponse = serverResponse.body;
      for (let i = 0; i < serverResponse.length; i++) {
        let resItem = serverResponse[i];

        if (!resItem['requestId'] || !resItem['cpm'] || !resItem['creativeId'] ||
          !resItem['ttl'] || !resItem['currency'] || !resItem['netRevenue']) {
          continue;
        }

        if (!resItem['mediaType']) {
          if (resItem['width'] && resItem['height'] && resItem['ad']) {
            response.push(resItem);
          }
        } else if (resItem['mediaType'] === 'video') {
          delete resItem['mediaType'];
          if (resItem['vastUrl']) {
            response.push(resItem);
          }
        } else if (resItem['mediaType'] === 'native') {
          delete resItem['mediaType'];
          if (resItem['title'] && resItem['image'] && resItem['impressionTrackers']) {
            response.push(resItem);
          }
        }
      }
    } catch (e) {
      utils.logMessage(e);
    }
    ;
    return response;
  },

  getUserSyncs: (syncOptions, serverResponses) => {
    return [{
      type: 'image',
      url: URL_SYNC
    }];
  }

};

registerBidder(spec);

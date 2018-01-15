# Overview

```
Module Name: SmartyAds Bidder Adapter
Module Type: Bidder Adapter
Maintainer: supply@smartyads.com
```

# Description

Module that connects to SmartyAds' demand sources

# Test Parameters
```
    var adUnits = [{
                code: 'placementid_0',
                sizes: [[300, 250]],
                bids: [{
                        bidder: 'smartyads',
                        params: {
                            placement_id: 0,
                            traffic: 'banner',
                            bidId: 12345
                        }
                    }]
                }
            ];
```
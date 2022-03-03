# API Cache Design

**Overview**: Working with Google API's means paying fractions of a penny for each request. The rates vary depending on which API you choose to work with, however, to improve financial viability of utilizing their services, it would be best practice to save off previously made API calls, such that you never pay for generating the same response twice.

**What calls should be cached?**
- An overview of the Places API calls are available [here](https://developers.google.com/maps/documentation/places/web-service/search).
- Places API requests are made on the server for restaurants near search locale (specified by latitude, longitude) and serve to retrieve information regarding the restaurant's address, website, photos, and other information packaged with the Places API response. There are different versions of Places API requests such as:
  - [Text Search](https://developers.google.com/maps/documentation/places/web-service/search-text): This is the search type currently utilized in the `retrieveRestaurants` route within the server at [functions/index.js](../functions/index.js). This type of search provides a plethora of information regarding Places, however, it does not allow for the specification of which fields are desired (a field being an attribute of a Place, e.g. address, place id, address, etc). This can be an issue in that not each field costs the same, and if the fields that are desired are not bounded, you will end up paying for resources which you do not require. `Text Search` returns up to 20 places per response (per page), and up to 60 if a following requests are made with the next page token.
  - [Find Place](https://developers.google.com/maps/documentation/places/web-service/search-find-place): This is the search type which allows for the specification of desired fields, however, does not allow for the return of multiple places per request. It also allows for the retrieval of place information by Place ID.

**How "best" to create a cache**:

Utilizing `Find Place` searches in tandem with `Text Search` would be beneficial as new places can be found with `Text Search`, cached in Firestore, and updated with `Find Place` requests once the original request expiration is reached (more on data expriation/cache refresh below). Once the original set of places from `Text Search` are cached in relation to the initial request (a request is indentified by rounded latitude, rounded longitude and cuisine type), subsequent calls to `Find Place` can be made with each places `place_id` so that it is up to date.

**Request Expiration/Cache Refresh**:

Restaurants can go out of business, so it is important that we have an expiration date on how long we serve the same places. As we are subservient to Google in regards to the status of a restaurant (either shut-down or operational), we rely on their data to know whether or not a place we are serving to users is open. So, it would be ideal to run checks on places we have previously found by utilizing `Find Place` requests. The responses from these requests will dictate what we do with the place in our cache. If the place is no longer open, we will purge it from the request it is associated with in the cache, and if it is open, we can verify that we still have the correct metadata for the place (update/verify address, udpate/verify name, update/verify cuisine type, update/verify website etc).

The interval at which we will run updates to the cache can range anywhere from a week to a month. As we rely on Google for the status of a restaurant/place, it would be ideal to know how often they are checking on the status of places they send out. It is uncertain whether Google can verify the status of a place outside of the owner of a place notifying Google that their business has changed operational status. For this reason, the initial expiry date on Places will be set at a month after the initial request. This duration can be revisited if more information about how often Google receives/runs place status updates come to light.

**How is a request identified**:

The requests we are making are indentified by their starting search location (latitude, longitude), and cuisine type. It is unlikely that people utilzing this application, even within nearby areas, will end up searching with the exact latitude longitude of another individual (these values go down to the thousandth, .0001 difference could be just be up the block). For this reason, it is important to group together requests within a certain latitude, longitude range/area. The granularity of these ranges/areas can effect the quality of service, and varying granularities of these ranges may be necessary for different areas population density. For example, a region with sparsely connected towns may not require the same precision as cities like San Francisco or New York where there are significantly more restaurants available and commerce hubs to provide reference to. 

In regards to space complexity, rounding latitude and longitude values to the nearest tenth versus the nearest hundreth would result in a significantly more storage requirements. As I mentioned above, utilizing different latitude longitude precisions for different areas based on population would be ideal, but for the scope of this project, may be difficult to implement in practice. One way of accomplishing this could be utilizing another API to determine the city a given search locale is from (based on latitude and longitude), and associating a predefined precision for that request's latitude longitude to round to.
For example, for requests made in San Francisco, we can have the latitude longitude values round to the hundreths place, look in the cache for an identical request made previous, if none found, then store the request's results into the cache. For requests made in Santa Cruz, we can have the latitude longitude values round to the tenth places, look in the cache for an indentical request made previous, if none found, then store the request's results into the cache.

For the purpose of this project, the rounding will attempt to be more precise than necessary (to the hundreths/nearest %.%2), then get optimized over time.

The uppe bound space complexity required for associating requests by their latitude longitude to a certain precision can be calculated by:

Total possible latitude longitude areas = `64800*(1/x)` where `x` is the precision (e.g. x=0.01 to round to the nearest hundreth).

For the purposes of this project, the value of the total possible latitude longitude areas, can then be multiplied by the number of different cuisine searches we can run at each latitude longitude area, as well as how many restaurants are stored for each cuisine type. 

This brings the upper bound of storage for the cache equal to `64800*(1/x)*y*z` where `y` is the number of cuisines and `z` is the number of restaurants stored per cuisine.

With `x` equal to `0.02`, `y` equal to 13 (current number of cuisines serviced), and `z` equal to 20 (average number of restaurants retrieved for each `Text Search` request), the upper bound of storage/space complexity comes out to: `842,400,000`.
Of this we could cache `42,120,000` unique requests/responses made to the client. This number is retrieved from `842,400,000/20` which removes space assumed by restaurants per cuisine, and we just count total number of unique requests we can service given that each request is indentified by lat, lng, and cuisine type.

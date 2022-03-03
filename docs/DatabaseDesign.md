# Database Design

**Overview**: The current database utilized for this project is [Google Firestore](https://cloud.google.com/firestore) which is a NoSQL, document-oriented database. The nature of the data being stored is generally regarding restaurants and information specific to the restaurant. For this reason, a document/KVS store available in NoSQL database solutions seems effective for this type of application. SQL/Relational database solutions may be desirable in the future if useful relational queries/associations can be drawn from the data.

**What information is being stored in the database?**

The information being stored in the database is primarily application specific restaurant ratings, a cache for requests made to Google Places API (soon to be implemented), and user attributes (previous ratings, favorited restaurants).

Firestore documents and sub documents of varying types. One of those being collections. The existing collections in our system are `places`, `users`, and soon to be `cache`. `places` is where restaurant ratings and restaurant data is stored (keys equal to place ids, values equal to a places attributes). `users` is where user information and previous ratings are stored (keys equal to place ids and values representing the vote value for that place). `cache` will be where previously made requests will be stored with keys equal to latitude longitude pairs, and sub collections/maps with keys equal to cuisine type. The values for each cuisine type key is lists of place ids representing restaurants that were found in relation to a search for restaurants, of said cuisine type, made at that latitude longitude range.

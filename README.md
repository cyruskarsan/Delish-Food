# Delish-Food
**Notice**: The API keys for the website are paused as the application is undergoing development for a final release. The current site is hosted with the main branch, one which does not yet incorporate sign-ins (as this branch does). One can still view the site, however, the API calls in place to retrieve restaurants and an unrestricted map view rely on the aforementioned keys, which are paused.

[Delish Food](https://delish-2.web.app/#) is a crowdsourced website designed to be intuitive and visually appealing. Our goal is to help you find the best ethnic food in your area. 

https://delish-2.web.app/# \
Simply visit our website and choose a category, or categories, of food you are craving.\
*If you don't see any markers, try zooming out*

# Icons and ratings
Delish Food uses crowdsourcing to let you know where the best places are to eat in your neighborhood. Places with larger icons are highly rated while places with smaller icons are rated less.
![map](readme-images/map_update.png)

## Crowdsourcing
We need your help! When you find a good place to eat, add an upvote to your favorite place on the app! This will help others know where the best places are in town. 

![upvote](readme-images/pericos.png)

# Tech Stack
* Our website is hosted on **Google Firebase**.
* Our REST API uses **firebase functions serverless infrastructure**.
* We used **firestore nosql database** to store our data. 
* Populated maps data using Google Maps and Places API.

# Local Development
To run locally: `firebase emulators: start`\
Once everything has been initialized, you will see the domains and ports which the frontend and backend are run on.

WEb app is viewable locally at: http://localhost:5000/#

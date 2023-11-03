Road Reporter
==========
Used [react-bootstrap](https://react-bootstrap.github.io/) for making a road reporter app for my BTP. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### info about EPSG: 4326 and EPSG 3857
- There are a few things that you are mixing up.(https://gis.stackexchange.com/questions/48949/epsg-3857-or-4326-for-web-mapping)
- Google Earth is in a Geographic coordinate system with the wgs84 datum. (EPSG: 4326)
- Google Maps is in a projected coordinate system that is based on the wgs84 datum. (EPSG 3857)
- The data in Open Street Map database is stored in a gcs with units decimal degrees & datum of wgs84. (EPSG: 4326)
- The Open Street Map tiles and the WMS webservice, are in the projected coordinate system that is based on the wgs84 datum. (EPSG 3857)
- So if you are making a web map, which uses the tiles from Google Maps or tiles from the Open Street Map webservice, they will be in Sperical Mercator (EPSG 3857 or srid: 900913) and hence your map has to have the same projection.

### info about lat/long
- Latitude, Longitude
- X, Y
- degree N, degree E
- maps follow the same notation, for example https://maps.google.com/?q=22.322,87.3085
- for some reason, i have to store the points in (y,x) form in the postgis database geometry datatype, for the leaflet to render to correctly
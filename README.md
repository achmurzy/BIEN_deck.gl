Start-up:
nvm use node
npm start

TO-DO:
-Query traits from the backend
	-Construct trait maps from average values
	-Use element picking to show a histogram of trait values on click for that area.
-Render political boundaries as polygons from the DB
	-PolygonLayer

-Find out how to dynamically construct richness maps based on the viewport
-We constructed a GridCell layer from static richness input -- try to do the same thing dynamically with backend queries and viewport info now.
-How do we define the 'focal' point of the viewport and query in an area arround that?
	-Define a grid on the Earth, dynamically instantiated based on viewport
	-query each cell of the grid as the viewport is updated, and compute richness on the backend-reactive paradigm will make this efficient automatically by keeping previously viewed/computed grid cells(hopefully) 
	-May take some finagling as deck.gl expects a set of data points, not overlapping range maps (Has the machinery to handle 200,000,000 obs tho)
	-Investigate the use of deck.gl 'view states' to query subsets of data

DONE:
-Format dropdown search for proper visibility and styling
-Implement search bar functionality to prevent over-loading species names

	--Use a frontend framework (reactstrap) that is robust
-Load all names into search bar for occurrence query

-Continue replicating biendata.org functionality
	-Make routes for BIEN, About, Methods, Reporting, Login

--Query and render ranges for single species

-Set up default species data to display on pageload

-Retrieve images for CyVerse, BIEN, NCEAS, Microsoft, Conservation International and display them

-Find out how to scale points on a scatterplot layer - Scatterplot layer automatically interpolates with max/min pixel settings

-Don't fill in ranges, give them outlines or opacity - parameters on base GeoJSONLayer

Configuration and deployment (eventually):
https://deck.gl/#/documentation/developer-guide/building-apps?section=optimizing-for-bundle-size

Optimization considerations:
https://deck.gl/#/documentation/developer-guide/optimizing-updates?section=about-webgl-state
https://deck.gl/#/documentation/developer-guide/performance-notes
https://deck.gl/#/documentation/developer-guide/tips-and-tricks

"Based on the way WebGL works there are two main types of state, and it is good to be somewhat aware of the difference between them:

Attributes - (sometimes called vertex attributes) these are big buffers of memory that contain the geometry primitives that describe how the GPU should render your data. Updating of attributes is done by JavaScript looping over every element in your data. It is essentially a linear time operation (proportional to the number of data items you are passing to the layer) and care should taken to avoid unnecessary updates.

Uniforms and Settings - These are single parameters (single values or small vectors) that are accessible to the GPU. They are very cheap to change and can essentially be changed on every render.

Some deck.gl props will cause attributes to be recalculated (mainly data props and accessors), and some will just affect uniforms and settings. You will want to develop an understanding for which props do what."

"Even if interactivity is not an issue, browser limitations on how big chunks of contiguous memory can be allocated (e.g. Chrome caps individual allocations at 1GB) will cause most layers to crash during WebGL buffer generation somewhere between 10M and 100M items. You would need to break up your data into chunks and use multiple deck.gl layers to get past this limit."

BIEN 4.1 sits at 200,000,000 observations, which would definitely break things (>.<)
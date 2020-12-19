# iobroker-controme
iobroker script for crawling data out of Controme Miniserver and HRGW

## How it works 

First of all install iobroker javascript adapter to use those scripts. After that download `miniserver.js` and `hrgw.js` and upload those file into the `javascript adpter`. 

There are some adjustments to do, open the file `miniserver.js` and adjust the line `const ms_url = '<url>/get/json/v1/2/temps/';`, add `http://` or `https://` + your domain or IP address of your Miniserver. 
You may also change the `/get/json/v1/` 2 in 1 `/temps/`, my API is accessible by using `2`. 

Now add you rooms you want to import in iobroker by adding them to the dictionary `const roomsDict = {1: 'kitchen', 2: 'livingroom', 3: 'bathroom'};`
The key represents the room id of the Controme API. e.g. `http://ip/get/json/v1/2/temps/1/`  will show the kitchen sensor values. So by calling `http://ip/get/json/v1/2/temps` you get back all configured rooms in the browser, there you can find simply the ids for each room to use. 

This script will run every 5Minutes you can also adjust this by changing the last line `schedule('*/5 * * * *', controme_fetchMS);` 

**Caution, if you produce to many request, it may infect the healthy of your miniserver**

For the `miniserver` you are ready to run the script and double check if the values are there. 
**Note: If you recreate everything, let the script run at least twice to make sure all states have updated


Unfortunately the Controme Miniserver API doesn't have an endpoint for the HRGW-Controls or relay. So I figured out that the HRGW has also an open Web REST API by reverse engineering. 
The adjustment in `hrgw.js` is only the line `const urlHRGW = "<url>/json/v1/"` after that you should be receiving values of the relays and the Differentialcontrols you have setup in the Controme System. 


<b>!!! THIS IS IN A NON-WORKING STATE! DO NOT USE! !!!</b>

## JSON-Parser

Take any JSON file/response and turn it into a single-purpose application.

## Design goals
### General flow
1. Upload a file or set an HTTP source. That exmaple data will be used to parse the structure of the JSON.
2. Set a root key/key path (only while the root key is nested within objects).
3. Allow for sanitizing individual values (or mark them as ignored). E.g. whether a string should be treated as a date or a number, etc.
4. Allow spatially arranging the different key/value pairs in the response.

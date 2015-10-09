# ziltag-plugin

## Build
Install dependencies first.

`npm install`

To build a staging version.

`gulp build`

To build a production version.

`gulp build --production`

The plugin will thus be built as `/dist/ziltag-plugin.js`.

## Installation

Embed following script into the page. The `data-ziltag` should be filled with the token which assigned to the user.

```
<script src="https://ziltag.github.io/ziltag-plugin/dist/ziltag-plugin.js" data-ziltag="d3d4b9"></script>
```

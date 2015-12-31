# ziltag-plugin

## Build
Install dependencies first.
`npm install`

To build staging and production versions.
`gulp build`

The plugin will thus be built as `/dist/staging/ziltag-plugin.js` and `/dist/production/ziltag-plugin.js`.

## Installation
Embed following script into the page. The `data-ziltag` should be filled with the token which assigned to the user.

```
<script src="https://ziltag.github.io/ziltag-plugin/dist/production/ziltag-plugin.js" data-ziltag="d3d4b9"></script>
```

## Attributes
### Disable Ziltag on Specific Image
To disable Ziltag on specific image, add a `data-ziltag="false"` attribute on the `img`.

`<img src="...src" data-ziltag="false"/>`

## Limits
The `img`'s width must be greater than or equal to `400px`, height must be greater than or equal to `100px`.

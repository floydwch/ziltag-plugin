# ziltag-plugin

## Development
### Run dev server
May operate by `hotel`.

`npm run docker:serve`

### Operate npm
Note: must run dev server first.

`npm run docker:npm -- command`

e.g.

`npm run docker:npm -- i -S react`

`npm run docker:npm -- rm -S react`

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
### Disable
To disable Ziltag on specific image, add a `data-ziltag="false"` attribute on the `img`.

`<img src="...src" data-ziltag="false"/>`

### Autoplay

`<img src="...src" data-ziltag-autoplay="true|false"/>`

default: `true`

### Enable Switch

`<img src="...src" data-ziltag-switch="true|false"/>`

default: `true`

## Limits
The `img`'s width must be greater than or equal to `200px`, height must be greater than or equal to `100px`.

## Events
There are some events indicate the state of the interaction between user and Ziltag plugin.

### Example
```javascript
const target = document.getElementsByClassName('ziltag-app')
target.addEventListener('ZILTAG_MAP_SWITCH_ACTIVATED', () => {...})
```

### Event types
* ZILTAG_MAP_SWITCH_ACTIVATED
* ZILTAG_READER_ACTIVATED
* ZILTAG_INPUT_ACTIVATED

# Ember-cli-chrome

A toolkit for building ambitious chrome extensions


## General Info
Chrome will complain if you define script tags inside your popup.html (index.html) this allows app initialization to occur in an external file. It also adds a few helpers and a method to ensure your chrome extension is always sized to your ember app size after dom updates.


A manifest.json will automatically be generated, if you needer finer grain control, you can override the default by adding a manifest.json file under `public/` the default icon paths are `chrome-icon-lg.png` and `chrome-icon.png` which can just be placed under `public/`


## Installation
`npm install --save-dev ember-cli-chrome`

Remove all script tags and add

`<script src="ember-chrome.js"></script>`

## Demo

[Ember Chrome Demo](https://github.com/j-mcnally/ember-chrome-demo)



## TODO

- Wrap common chrome api calls with promise layer.
- Create application blueprint.
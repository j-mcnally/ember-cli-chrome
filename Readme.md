# Ember-cli-chrome

A toolkit for building ambitious chrome extensions


## General Info
Chrome will complain if you define script tags inside your popup.html (index.html) this allows app initialization to occur in an external file. It also adds a few helpers and a method to ensure your chrome extension is always sized to your ember app size after dom updates.


## Installation
`npm install --save-dev ember-cli-chrome`

Remove all script tags and add

`<script src="ember-chrome.js"></script>`

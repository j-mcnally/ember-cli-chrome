# supertree-chrome-extension

A toolkit for building embedded chrome extensions 


## General Info

This does not work for generic repos, it currently works only with supertree clients.

You will most likely need to install `https://github.com/xcambar/ember-cli-embedded` and enable `ember-export-application-global` by 
adding `exportApplicationGlobal: 'MyApp',` to `environment.js` (your repo).

Change `SupertreeChrome` in `insert.js` (this repo) to be the name of you app that you are exporting.
Set a rootElement for your app in `app.js` (your repo) and replace `supertree-chrome-extension` with the rootElement of your ember-cli app.


## Installation
`ember install supertree-chrome-extension`


## Thanks
99% of this repo came from ember-cli-chrome
https://github.com/j-mcnally/ember-cli-chrome

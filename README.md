# KindleClippingsCLI 
[![npm version](https://badge.fury.io/js/kindle-clippings-cli.svg)](https://badge.fury.io/js/kindle-clippings-cli)
<span class="badge-daviddm"><a href="https://david-dm.org/DarylSerrano/KindleClippingsCLI" title="View the status of this project's dependencies on DavidDM"><img src="https://david-dm.org/DarylSerrano/KindleClippingsCLI.svg" alt="Dependency Status" /></a></span>


CLI version of my [KindleClippings](https://github.com/DarylSerrano/KindleClippings) package for parsing clippings made on the Kindle into json files or a anki deck. 
## Installing the CLI
`npm i -g kindle-clippings-cli`
## Usage of the CLI
```bash
kindle-clippings --help
kindle-clippings -i "My Clippings.txt" -d "./clippings"
kindle-clippings -i "clippings/clipp_short.txt" --org "book" -d "anki" -a
```
## Testing dev
`npm run dev -- [args]`
## Anki Note template
The anki note template can be found in the folder `anki`, or by just [clicking here](https://github.com/DarylSerrano/KindleClippingsCLI/raw/master/anki/KindleClippingsTemplate.apkg) just import the anki deck and you will get the anki template that is used in this project
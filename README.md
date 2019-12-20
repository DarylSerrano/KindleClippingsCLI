# KindleClippingsCLI 
CLI version of my [KindleClippings](https://github.com/DarylSerrano/KindleClippings) package for parsing clippings made on the Kindle into json files. 
## Installing the CLI
`npm i -g @darylserrano/kindle-clippings-cli`
## Usage of the CLI
```bash
kindle-clippings --help
kindle-clippings -i "My Clippings.txt" -d "./clippings"
kindle-clippings -i "clippings/clipp_short.txt" --org "book" -d "anki" -a
```
## Testing dev
`npm run dev -- [args]`
## Anki Note template
The anki note template can be found in the folder `anki`, just import the anki deck and you will get the anki template that is used in this project
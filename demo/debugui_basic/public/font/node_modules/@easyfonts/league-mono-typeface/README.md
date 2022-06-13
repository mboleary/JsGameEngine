- [Synopsis](#synopsis)
- [Install](#install)
- [Usage](#usage)
- [Example](#example)

# Synopsis

![League Mono][sample]

By [Tyler Finck][designer] (last update: November 14, 2017)

League Mono is a mashup of sorts, inspired by some beautiful forms found in both Fira Mono, Libertinus Mono, and Courier(?!).

League Mono was created for The League of Moveable Type using Glyphs app, with masters for the Thin, Regular, and Bold weights, and interpolated instances for the UltraLight, Light, Medium, SemiBold, and ExtraBold weights. This, unfortunately, is not supported by UFO files, which is why there is a Glyphs source and source files for each weight.

![League Mono Family Pangram][pangram]
![League Mono Details][details]

# Install

Install the fontface via npm. 

```bash
npm install --save @easyfonts/league-mono-typeface
## OR
yarn add @easyfonts/league-mono-typeface
```

# Usage

Include the font in your build with 

```javascript

import '@easyfonts/league-mono-typeface';
```

Reference in your css

```css
  .someclass {
     font-family: 'League Mono';
  }
```  

This will install all fontfiles and (1.1Mb).

If you are not using all font weights you can select a subset of fontfiles to be included into your build based on the `font-weight`


| import statement                                        | `font-weight` |
| ------------------------------------------------------- | ------------- |
| `import '@easyfonts/leaugue-mono-typeface/ultralight.css';` | 100           |
| `import '@easyfonts/leaugue-mono-typeface/light.css';`      | 200           |
| `import '@easyfonts/leaugue-mono-typeface/thin.css';`       | 300           |
| `import '@easyfonts/leaugue-mono-typeface/regular.css';`    | 400           |
| `import '@easyfonts/leaugue-mono-typeface/medium.css';`     | 500           |
| `import '@easyfonts/leaugue-mono-typeface/semibold.css';`   | 600           |
| `import '@easyfonts/leaugue-mono-typeface/bold.css';`       | 700           |
| `import '@easyfonts/leaugue-mono-typeface/extra-bold.css';` | 800           |

# Example

Include only extra-bold in your bundle

```javascript
import '@easyfonts/leaugue-mono-typeface/extra-bold.css';
```

Include regular and semibild in your bundle;

```javascript
import '@easyfonts/leaugue-mono-typeface/regular.css';
import '@easyfonts/leaugue-mono-typeface/semibold.css';
```

[sample]: ./leaguemono-sample.png
[designer]: http://www.tylerfinck.com
[pangram]: ./leaguemono-family-pangram.png
[details]: ./leaguemono-details.png



# HTML5 like input number

HTML5 like input number, but better

## Features

- Simple and easy to install.
- Only 1 KB (minified gzipped).

## Installation

Include jQuery and `jquery.inputNumber.js` onto your page:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script src="jquery.inputNumber.js"></script>
<link rel="stylesheet" href="inputNumber.css">
```
If you want mousewheel support include:

```html
<script src="jquery.mousewheel.js"></script>
```

```javascript
$('input.num').inputNumber({
	negative:true, //allow negative numbers
	positive:true, //allow positive numbers
	wrapClass:'ranged-input',
	upClass:'up',
	upTitle:'Incrase',
	downClass:'down',
	downTitle:'Decrace'
});
```

---

## License

The MIT License, see the included `License.md` file.
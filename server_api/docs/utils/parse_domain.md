# Utility Function: parseDomain

Parses a domain string and extracts the subdomain, domain, and top-level domain (TLD) components.

## Description

The `parseDomain` function takes a domain string (e.g., `sub.example.com`) and returns an object containing the following properties:

- `subdomain`: The subdomain portion of the domain, if present.
- `domain`: The main domain name.
- `tld`: The top-level domain.

This function is useful for extracting and analyzing different parts of a domain name in web applications, middleware, or services that need to process or validate domain information.

## Parameters

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| urlPath  | string | The full domain string to parse (e.g., `sub.example.com`). |

## Returns

| Type   | Description                                                                                 |
|--------|---------------------------------------------------------------------------------------------|
| object | An object with the properties: `subdomain` (string), `domain` (string), and `tld` (string). |

### Returned Object Properties

| Name      | Type   | Description                                         |
|-----------|--------|-----------------------------------------------------|
| subdomain | string | The subdomain portion, or an empty string if absent.|
| domain    | string | The main domain name.                               |
| tld       | string | The top-level domain.                               |

## Example

```javascript
const parseDomain = require('./parseDomain');

const result = parseDomain('blog.example.com');
console.log(result);
// Output:
// {
//   subdomain: 'blog',
//   domain: 'example',
//   tld: 'com'
// }

const result2 = parseDomain('example.com');
console.log(result2);
// Output:
// {
//   subdomain: '',
//   domain: 'example',
//   tld: 'com'
// }
```

## Notes

- This function assumes the input is a simple domain string and does not handle complex cases such as multi-part TLDs (e.g., `.co.uk`), internationalized domains, or URLs with protocols and paths.
- If the input does not contain a subdomain, the `subdomain` property will be an empty string.

---

**Exported by:**  
```js
module.exports = parseDomain;
```
Use `require('./parseDomain')` to import this function in CommonJS modules.
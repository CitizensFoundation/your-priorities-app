# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [14.0.0-canary.53b3cad2f.0](https://github.com/material-components/material-components-web/compare/v13.0.0...v14.0.0-canary.53b3cad2f.0) (2022-04-27)


### Bug Fixes

* **typography:** Fixes typography `theme-styles` mixin... the value being retreived from the `$theme` map and css property name was swapped. The mixin would request `font-size`/`font-weight`/`letter-spacing` from the `$theme` map (which expects `size`/`weight`/`tracking`)... so these values would always be `null`. ([32b3913](https://github.com/material-components/material-components-web/commit/32b391398aa70f2fbb917cd4649b84d87876cd8e))


### Features

* **chips:** Added elevation tint layer color support in chips ([c78ff04](https://github.com/material-components/material-components-web/commit/c78ff042967de7cf823a9f9826f8f613be9e4846))

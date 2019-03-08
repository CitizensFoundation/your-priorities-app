/*
 * There doesn't seem to be documentation on what helpers are available, or
 * which helpers are required for which transforms. The
 * source is here:
 * https://github.com/babel/babel/tree/master/packages/babel-helpers
 *
 * You can usually tell what the helpers are used for by searching the babel
 * source to find out which plugin packages make an `addHelper` call for it.
 *
 * All helpers are listed here, with some commented out, so it's clear what
 * we've excluded.
 */
const mainHelpers = [
  // __proto__ assignment
  'defaults',
  'extends',

  // es2015 classes
  'assertThisInitialized',
  'classCallCheck',
  'construct',
  'createClass',
  'get',
  'getPrototypeOf',
  'inherits',
  'isNativeFunction',
  // 'inheritsLoose',
  'possibleConstructorReturn',
  'set',
  'setPrototypeOf',
  'superPropBase',
  'wrapNativeSuper',

  // es2015 array-spread
  'slicedToArray',
  // 'slicedToArrayLoose',
  'toArray',
  'toConsumableArray',
  'arrayWithoutHoles',
  'arrayWithHoles',
  'iterableToArray',
  'iterableToArrayLimit',
  // 'iterableToArrayLimitLoose',
  'nonIterableSpread',
  'nonIterableRest',

  // es2015 instanceof
  'instanceof',

  // es2015 arrow-functions
  'newArrowCheck',

  // es2015 typeof-symbol
  'typeof',

  // es2015 computed-properties
  'defineEnumerableProperties',
  'defineProperty',

  // es2015 block-scoping
  'readOnlyError',
  'temporalRef',
  'temporalUndefined',

  // es2015 destructuring
  'objectDestructuringEmpty',
  'objectWithoutProperties',

  // es2015 template-literals
  'taggedTemplateLiteral',
  // 'taggedTemplateLiteralLoose',

  // es2017 async-to-generator
  'asyncToGenerator',

  // es2018 proposal-async-generator-functions
  'AsyncGenerator',
  'AwaitValue',
  'asyncGeneratorDelegate',
  'asyncIterator',
  'awaitAsyncGenerator',
  'wrapAsyncGenerator',

  // es2018 proposal-object-rest-spread
  'objectSpread',
  'toPropertyKey'

  // proposal-function-sent
  // 'skipFirstGeneratorNext',

  // proposal-class-properties
  // 'classNameTDZError',

  // proposal-decorators
  // 'applyDecoratedDescriptor',
  // 'initializerDefineProperty',
  // 'initializerWarningHelper',

  // react-inline-elements
  // 'jsx',
];

/**
 * Babel helpers needed only for ES module transformation. We bundle these with
 * the require.js AMD module loader instead so that the AMD transform does not
 * depend on loading all Babel helpers.
 */
const amdHelpers = ['interopRequireDefault', 'interopRequireWildcard'];

module.exports = [...mainHelpers, ...amdHelpers];

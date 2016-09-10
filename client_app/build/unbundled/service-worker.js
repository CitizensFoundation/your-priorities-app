/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';





/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["/bower_components/app-layout/app-drawer-layout/app-drawer-layout.html","a7474857c8dd25d6a9e5aabe763ec01f"],["/bower_components/app-layout/app-drawer/app-drawer.html","3949fa70e3797c54269a4abf7f361180"],["/bower_components/app-layout/app-header-layout/app-header-layout.html","180db0000b27f96610bf1a8de988a3ab"],["/bower_components/app-layout/app-header/app-header.html","e4a8a8d2985df42fad5c12ccd241e0c8"],["/bower_components/app-layout/app-scroll-effects/app-scroll-effects-behavior.html","6f59d3f5116eca983a1a375b77ad0fb5"],["/bower_components/app-layout/app-scroll-effects/app-scroll-effects.html","1eaa9e05144414be49e4ee23e16ceca2"],["/bower_components/app-layout/app-scroll-effects/effects/blend-background.html","4723ce7f6429640a812ad866ddddb719"],["/bower_components/app-layout/app-scroll-effects/effects/fade-background.html","3929482c600a21680def557965850501"],["/bower_components/app-layout/app-scroll-effects/effects/material.html","271fe6e745f1a9581a6e01cb3aadce21"],["/bower_components/app-layout/app-scroll-effects/effects/parallax-background.html","391d025dcffee3f042c9d2bdd83be377"],["/bower_components/app-layout/app-scroll-effects/effects/resize-snapped-title.html","fad90269cea2f83e1f4df1950bb2b053"],["/bower_components/app-layout/app-scroll-effects/effects/resize-title.html","1b99a57f871235783db6dfb812d7f3e0"],["/bower_components/app-layout/app-scroll-effects/effects/waterfall.html","6cbd757de769cd5af213aaebb8780745"],["/bower_components/app-layout/app-scrollpos-control/app-scrollpos-control.html","bc1ca312eb9192253e0c8a2a267eb45e"],["/bower_components/app-layout/app-toolbar/app-toolbar.html","bde0a79d3265bef565ee86c699b6bbae"],["/bower_components/app-layout/helpers/helpers.html","95b52c0c05f77b65bc1b5dc0715d2495"],["/bower_components/app-route/app-location.html","52b3d8b5ecbb838b41bd9bd0ae556cca"],["/bower_components/app-route/app-route-converter-behavior.html","0e5b36ae9988a88bb30729fdb99a5d94"],["/bower_components/app-route/app-route.html","624ca199d36389f3db04597a593548ec"],["/bower_components/file-upload/file-upload.html","2c61e1df6c6f294d02ab1e7614f0635f"],["/bower_components/font-roboto/roboto.html","09500fd5adfad056ff5aa05e2aae0ec5"],["/bower_components/google-apis/google-maps-api.html","e4eb1641cec251f631cec2f569e8a551"],["/bower_components/google-map/google-map-marker.html","d4432d8c2b75325d455c0f975d76107a"],["/bower_components/google-map/google-map-search.html","ea5cc3f3955c743c125bd9ea63cfa935"],["/bower_components/google-map/google-map.html","534168cabc1c04eb05da60af3b687a10"],["/bower_components/google-streetview-pano/google-streetview-pano.html","c0a8c0b455152e111244117a45c4d0b1"],["/bower_components/instafeed.js/instafeed.min.js","3be2fcf0c3a7bd3ce730239771340517"],["/bower_components/iron-a11y-announcer/iron-a11y-announcer.html","a3bd031e39dde38cb8e619f670ee50f7"],["/bower_components/iron-a11y-keys-behavior/iron-a11y-keys-behavior.html","b9a8e766d0ab03a5d13e275754ec3d54"],["/bower_components/iron-a11y-keys/iron-a11y-keys.html","fd2760ee5676b7615aaa24d695c5295d"],["/bower_components/iron-ajax/iron-ajax.html","d606b330d7bd040660a53a5cda7f8acf"],["/bower_components/iron-ajax/iron-request.html","c2d289c4b20653353cff315cf247a45e"],["/bower_components/iron-autogrow-textarea/iron-autogrow-textarea.html","d4e3d1fbafdabe66a7b95e1048b711ce"],["/bower_components/iron-behaviors/iron-button-state.html","6565a80d1af09299c1201f8286849c3b"],["/bower_components/iron-behaviors/iron-control-state.html","1c12ee539b1dbbd0957ae26b3549cc13"],["/bower_components/iron-checked-element-behavior/iron-checked-element-behavior.html","6fd1055c2c04382401dc910a0db569c6"],["/bower_components/iron-dropdown/iron-dropdown-scroll-manager.html","70904f32a519b07ec427d1a9a0c71528"],["/bower_components/iron-dropdown/iron-dropdown.html","0e2352a228fb17f90c345a4ffcca4b30"],["/bower_components/iron-fit-behavior/iron-fit-behavior.html","8d3799ca2f619ed4f31261bb03284671"],["/bower_components/iron-flex-layout/classes/iron-flex-layout.html","97fcf4e52b1c44a78f360d436bd4e1e0"],["/bower_components/iron-flex-layout/classes/iron-shadow-flex-layout.html","8d36ab2f6e4b1d1373be99ac0f3a4980"],["/bower_components/iron-flex-layout/iron-flex-layout-classes.html","90471c0acb830c41b01e02a2507bed3c"],["/bower_components/iron-flex-layout/iron-flex-layout.html","3987521c615734e4fe403f9acecfea54"],["/bower_components/iron-form-element-behavior/iron-form-element-behavior.html","a64177311979fc6a6aae454cb85ea2be"],["/bower_components/iron-form/iron-form.html","ea4f57a2ca7dddb62def43e77a82e680"],["/bower_components/iron-icon/iron-icon.html","5da6bac1d18d267691395cdc75820761"],["/bower_components/iron-icons/av-icons.html","b69fba5107077e3c4448351591a7cef5"],["/bower_components/iron-icons/communication-icons.html","d6bbe1fe8badd9faaee6344e0b0da330"],["/bower_components/iron-icons/hardware-icons.html","ff29c05b924ec665bd07449d0a8bc762"],["/bower_components/iron-icons/image-icons.html","30ef0224c9cf6acd66c506818396ccf7"],["/bower_components/iron-icons/iron-icons.html","c8f9154ae89b94e658e4a52eee690a16"],["/bower_components/iron-icons/notification-icons.html","ea39ef4c42e134cb11e7832334d05022"],["/bower_components/iron-icons/places-icons.html","a1058f61542ccfd3d44b5cadc6e5fa78"],["/bower_components/iron-icons/social-icons.html","7c0d7482ea9c4ff9b2b76dac1198d9a9"],["/bower_components/iron-iconset-svg/iron-iconset-svg.html","8fb45b1b4668dae069f5efb5004c2af4"],["/bower_components/iron-image/iron-image.html","72175f3ce2bc8e6bf3436ab8749b470e"],["/bower_components/iron-input/iron-input.html","3e393eda6c241be2817ce0acc512bcf6"],["/bower_components/iron-jsonp-library/iron-jsonp-library.html","2278dab473da8287511ea8f8eb30144d"],["/bower_components/iron-list/iron-list.html","8f76d0ce7cedef219c95a9b4e8c3cbae"],["/bower_components/iron-location/iron-location.html","b999e8754a2e8fdde266884e47cefa04"],["/bower_components/iron-location/iron-query-params.html","065a00285a46f8483c74e363945499c9"],["/bower_components/iron-media-query/iron-media-query.html","7436f9608ebd2d31e4b346921651f84b"],["/bower_components/iron-menu-behavior/iron-menu-behavior.html","ebd9e4f4121fe7691f20f0656cb24e5d"],["/bower_components/iron-menu-behavior/iron-menubar-behavior.html","a0cc6674fc6d9d7ba0b68ff680b4e56b"],["/bower_components/iron-meta/iron-meta.html","dd4ef14e09c5771e70292d70963f6718"],["/bower_components/iron-overlay-behavior/iron-overlay-backdrop.html","35013b4b97041ed6b63cf95dbb9fbcb4"],["/bower_components/iron-overlay-behavior/iron-overlay-behavior.html","d7b9e877877c2ca1156c4c9fdd775e16"],["/bower_components/iron-overlay-behavior/iron-overlay-manager.html","7f741ba06ffd837bf1697e8778b94731"],["/bower_components/iron-pages/iron-pages.html","5872a2ad58225c94b14ddea747f67cbd"],["/bower_components/iron-range-behavior/iron-range-behavior.html","34f5b83882b6b6c5cfad7543caab080e"],["/bower_components/iron-resizable-behavior/iron-resizable-behavior.html","e93449ccd4312e4e30060c87bd52ed25"],["/bower_components/iron-scroll-target-behavior/iron-scroll-target-behavior.html","0185cbe8d7139c9e92af3a9af67feb17"],["/bower_components/iron-scroll-threshold/iron-scroll-threshold.html","1851201e710b8a648cd7c8c1e72cbb5c"],["/bower_components/iron-selector/iron-multi-selectable.html","46d6620acd7bad986d81097d9ca91692"],["/bower_components/iron-selector/iron-selectable.html","65b04f3f5f1b551d91a82b36f916f6b6"],["/bower_components/iron-selector/iron-selection.html","83545b7d1eae4020594969e6b9790b65"],["/bower_components/iron-selector/iron-selector.html","4d2657550768bec0788eba5190cddc66"],["/bower_components/iron-signals/iron-signals.html","ccf3900a308223d95e33deec42dabe5f"],["/bower_components/iron-validatable-behavior/iron-validatable-behavior.html","02bf0434cc1a0d09e18413dea91dcea1"],["/bower_components/lodash-element/lodash.js.html","1fc7492dfade0eaf588ab5941f41923a"],["/bower_components/lodash/lodash.min.js","7ff2358183ba964abe7a9d36b5a3e9f5"],["/bower_components/moment/min/moment-with-locales.min.js","798a4f3de78128e54bd1ba97c2c05c9d"],["/bower_components/neon-animation/animations/cascaded-animation.html","3a5a8c22afe014a904557b66938c44ba"],["/bower_components/neon-animation/animations/fade-in-animation.html","b814c818dbcffe2bb50563e1406497df"],["/bower_components/neon-animation/animations/fade-out-animation.html","44988226230af0e6d92f0988fc8688e2"],["/bower_components/neon-animation/animations/hero-animation.html","4feaf331f46d411ce9ad465da1dbb65e"],["/bower_components/neon-animation/animations/opaque-animation.html","8e2f63bbc648796f3ed96834a5553d07"],["/bower_components/neon-animation/animations/reverse-ripple-animation.html","1e08f758cb172f8fb19fabffc163a180"],["/bower_components/neon-animation/animations/ripple-animation.html","4d33252f387c84d0702efaaf510990b0"],["/bower_components/neon-animation/animations/scale-down-animation.html","e9cedffa151b388200cb2a610b2252fc"],["/bower_components/neon-animation/animations/scale-up-animation.html","20059304b9b7e9377379ad75110ef2fc"],["/bower_components/neon-animation/animations/slide-down-animation.html","31286bfe0b2cb6f28ef5e1f9d181f641"],["/bower_components/neon-animation/animations/slide-from-bottom-animation.html","12eea18013bf5b89c642fde725469a62"],["/bower_components/neon-animation/animations/slide-from-left-animation.html","cb18058340412077b0b0a8a7228a79a6"],["/bower_components/neon-animation/animations/slide-from-right-animation.html","79f28e3d4580cef016e6ae8c63384e98"],["/bower_components/neon-animation/animations/slide-from-top-animation.html","565391366846573f1725585d15b9baad"],["/bower_components/neon-animation/animations/slide-left-animation.html","a44c677c010daf7872b77f53bcd86e58"],["/bower_components/neon-animation/animations/slide-right-animation.html","b9908b67414ba0dfc7442eb1207d05fc"],["/bower_components/neon-animation/animations/slide-up-animation.html","bee63970c6ffc2706419533c9b2bd65e"],["/bower_components/neon-animation/animations/transform-animation.html","c64feaff2d50eb6f6633c644063c6aa3"],["/bower_components/neon-animation/neon-animatable-behavior.html","270f52231303cae4cb8e3fadb5a805c1"],["/bower_components/neon-animation/neon-animatable.html","a0ca09f4fb19c4c83a2e501f666aa9b7"],["/bower_components/neon-animation/neon-animated-pages.html","8bb61cb8467f755163cec87e954425fc"],["/bower_components/neon-animation/neon-animation-behavior.html","eb1cdd9cd9d780a811fd25e882ba1f8e"],["/bower_components/neon-animation/neon-animation-runner-behavior.html","782cac67e6cb5661d36fb32d9129ff03"],["/bower_components/neon-animation/neon-animation.html","64a31fddf24983589825e7f0feaedbb8"],["/bower_components/neon-animation/neon-animations.html","3b6524b3cc95f27b4b6d7821a7097137"],["/bower_components/neon-animation/neon-shared-element-animatable-behavior.html","d891492be81d44fcf6dfb54fd8d73ae2"],["/bower_components/neon-animation/neon-shared-element-animation-behavior.html","59b343c52eef4ff93901a3cba99577d6"],["/bower_components/neon-animation/web-animations.html","b310811179297697d51eac3659df7776"],["/bower_components/paper-badge/paper-badge.html","ac75e03e003db29b5d49ea08a8254bda"],["/bower_components/paper-behaviors/paper-button-behavior.html","edddd3f97cf3ea944f3a48b4154939e8"],["/bower_components/paper-behaviors/paper-checked-element-behavior.html","59702db25efd385b161ad862b8027819"],["/bower_components/paper-behaviors/paper-inky-focus-behavior.html","51a1c5ccd2aae4c1a0258680dcb3e1ea"],["/bower_components/paper-behaviors/paper-ripple-behavior.html","b6ee8dd59ffb46ca57e81311abd2eca0"],["/bower_components/paper-button/paper-button.html","3f061a077ee938fac479622156071296"],["/bower_components/paper-card/paper-card.html","c057c1a99e521f817eab9af733ce2471"],["/bower_components/paper-checkbox/paper-checkbox.html","6a891a16405b9578c46dab7dbdcda1c9"],["/bower_components/paper-dialog-behavior/paper-dialog-behavior.html","b9cf5384b29cd12a724965080916b6f1"],["/bower_components/paper-dialog-behavior/paper-dialog-shared-styles.html","8fb5282b6149bc429b6baef5c077a285"],["/bower_components/paper-dialog-scrollable/paper-dialog-scrollable.html","49e3023a68129496c360dc9613f34bfc"],["/bower_components/paper-dialog/paper-dialog.html","7a8d86ed89c215baf8cc42e4d7335271"],["/bower_components/paper-dropdown-menu/paper-dropdown-menu-icons.html","d309383cfdcf6733d4e6827c3b877c72"],["/bower_components/paper-dropdown-menu/paper-dropdown-menu-shared-styles.html","7bf40756c7cdf1557c25d16a54575b75"],["/bower_components/paper-dropdown-menu/paper-dropdown-menu.html","976f0cb55bd9810af92f7aa9d20456ae"],["/bower_components/paper-fab/paper-fab.html","b3ad1553b61ad0996a0371b94efe2164"],["/bower_components/paper-header-panel/paper-header-panel.html","b883923e580ff87f152f354358fc324b"],["/bower_components/paper-icon-button/paper-icon-button.html","2a75de00f858ae1e894ab21344464787"],["/bower_components/paper-input/paper-input-addon-behavior.html","de7b482dc1fb01847efba9016db16206"],["/bower_components/paper-input/paper-input-behavior.html","3960579058d3ba0a74ae7b67b78f53c2"],["/bower_components/paper-input/paper-input-char-counter.html","94c2003f281325951e3bf5b927a326bb"],["/bower_components/paper-input/paper-input-container.html","e3c61b8a6e35b134c99c09381ef48067"],["/bower_components/paper-input/paper-input-error.html","b90f3a86d797f1bdbbb4d158aeae06ab"],["/bower_components/paper-input/paper-input.html","3385511052db3467ca6ec155faa619ad"],["/bower_components/paper-input/paper-textarea.html","afa5fc740d96ea22ef90c6f9a34f6b3c"],["/bower_components/paper-item/paper-item-behavior.html","82636a7562fd8b0be5b15646ee461588"],["/bower_components/paper-item/paper-item-body.html","8b91d21da1ac0ab23442d05b4e377286"],["/bower_components/paper-item/paper-item-shared-styles.html","31466267014182098267f1b9303f656e"],["/bower_components/paper-item/paper-item.html","e614731572c425b144aa8a9da24ee3ea"],["/bower_components/paper-listbox/paper-listbox.html","bfbc631d72b3e7b2b611c9a32430e3c6"],["/bower_components/paper-material/paper-material-shared-styles.html","d0eeeb696e55702f3a38ef1ad0058f59"],["/bower_components/paper-material/paper-material.html","47301784c93c3d9989abfbab68ec9859"],["/bower_components/paper-menu-button/paper-menu-button-animations.html","a6d6ed67a145ca00d4487c40c4b06273"],["/bower_components/paper-menu-button/paper-menu-button.html","328142b62de76860bca169b4a2d12342"],["/bower_components/paper-menu/paper-menu-shared-styles.html","9b2ae6e8b26011a37194ea3b4bdd043d"],["/bower_components/paper-menu/paper-menu.html","5270d7b4b603d9fdfcfdb079c750a3cd"],["/bower_components/paper-more-button/paper-more-button.html","2536537a27a0376973fccf42212a2c99"],["/bower_components/paper-progress/paper-progress.html","5dd0b9f89efdfd4f3cce0a13bd67fe6f"],["/bower_components/paper-radio-button/paper-radio-button.html","35f34744145dba3b57cfee17943c74ef"],["/bower_components/paper-radio-group/paper-radio-group.html","a05f50c465653f06b7273664068d6684"],["/bower_components/paper-ripple/paper-ripple.html","e22bc21b61184cb28125d16f9d80fb59"],["/bower_components/paper-search/paper-filter-dialog.html","16bb9cc926e911bc622340918acb3e49"],["/bower_components/paper-search/paper-search-bar.html","6259ad4374df14c497da1f149f637356"],["/bower_components/paper-search/paper-search-panel.html","5247ff7ba00933c615661755ea897f9f"],["/bower_components/paper-search/paper-search.html","530928922daba0162bf2728c362ac88b"],["/bower_components/paper-share-buttons/paper-share-facebook.html","dd157bc33cc7f4784074dad328dd8f99"],["/bower_components/paper-share-buttons/paper-share-google.html","a97d76fda193672d03306c05bcb0b62d"],["/bower_components/paper-share-buttons/paper-share-twitter.html","3b1c5b6d8ef4bd4ec361bc79d6d3ac82"],["/bower_components/paper-spinner/paper-spinner-behavior.html","82e814c4460e8803f6f57cc457658adf"],["/bower_components/paper-spinner/paper-spinner-lite.html","1f3147475d9a3446bc78cdb44103defa"],["/bower_components/paper-spinner/paper-spinner-styles.html","a2122d2c0f3ac98e6911160d8886d31a"],["/bower_components/paper-spinner/paper-spinner.html","940e64bbde54dad918d0f5c0e247a8bd"],["/bower_components/paper-styles/color.html","430305db311431da78c0a6e1236f9ebe"],["/bower_components/paper-styles/default-theme.html","c910188e898624eb890898418de20ee0"],["/bower_components/paper-styles/paper-styles.html","3fd71f69f3adc823ef9c03611d296cfc"],["/bower_components/paper-styles/shadow.html","7fd97f2613eb356e1bb901e37c3e8980"],["/bower_components/paper-styles/typography.html","bdd7f31bb85f116ce97061c4135b74c9"],["/bower_components/paper-tabs/paper-tab.html","395fdc6be051eb7218b1c77a94eff726"],["/bower_components/paper-tabs/paper-tabs-icons.html","9fb57777c667562392afe684d85ddbe2"],["/bower_components/paper-tabs/paper-tabs.html","2bf908cedd6ff6e67c18dbf337787bcc"],["/bower_components/paper-toast/paper-toast.html","f64d10724104f3751cae8b764aef56ff"],["/bower_components/paper-toolbar/paper-toolbar.html","ff99e4e6d522685e7e4d04f290e8ac9b"],["/bower_components/polymer-instagram/polymer-instagram.html","bab407af6be8f2c172a5bef9e78be2e4"],["/bower_components/polymer/polymer-micro.html","7739e37db5581472b91925e5fa9bde55"],["/bower_components/polymer/polymer-mini.html","9e9dfb157eae29a59c98343288d4d120"],["/bower_components/polymer/polymer.html","2dce719d53b7ea549067d3d21a2b2c29"],["/bower_components/promise-polyfill/Promise.js","5afb14fd81497aca81bf25929d65b02d"],["/bower_components/promise-polyfill/promise-polyfill-lite.html","06470312beff013fc54695e0bdda2cb3"],["/bower_components/re-captcha/re-captcha.html","a573d8877cb82f114445e290598bae58"],["/bower_components/vaadin-grid/vaadin-grid.html","27802586debc69d6a69bb9ccc435d811"],["/bower_components/vaadin-grid/vaadin-grid.min.js","b2b8de4fee97047c203947df86517608"],["/bower_components/vaadin-icons/vaadin-icons.html","e9f675fdd4726a3eeed9fd519880ca3a"],["/bower_components/web-animations-js/web-animations-next-lite.min.js","04197e2ccec914fa460eef2ac140c853"],["/bower_components/webcomponentsjs/webcomponents-lite.min.js","f04ed23700daeb36f637bfe095960659"],["/bower_components/within-viewport/withinviewport.js","397c43fddccc1e16ada5cd3e599d0074"],["/index_yp.html","31168cd3bb91636ade86dbff32e28e3c"],["/src/ac-activities/ac-activities.html","816fc9a9221cc44a2437ac2a2077fda8"],["/src/ac-activities/ac-activity-group.html","bac42f42f75259b0a5c633ed027448ed"],["/src/ac-activities/ac-activity-header.html","3578eb991948fc02b9937d7e5e0da01c"],["/src/ac-activities/ac-activity-point-news-story.html","61f96d0fdb6e408e007fb6e343cd7c55"],["/src/ac-activities/ac-activity-point.html","5f2292c8c2e44577a532678c486545c4"],["/src/ac-activities/ac-activity-post-header.html","b5053003da8592d1d88825ac61f85b4a"],["/src/ac-activities/ac-activity-post-status-update.html","003b69ce8b59dca8ab08d41f8f2008e1"],["/src/ac-activities/ac-activity-post.html","1fc45e046c9595a460a577fb1ba89a21"],["/src/ac-notifications/ac-notification-selection.html","568063a8b3862a3b1b1df49577f053a0"],["/src/ac-notifications/ac-notification-settings.html","babfaed55b7e840dba618a0dac9c052c"],["/src/with-in-viewport/with-in-viewport.html","6d0c0f091275b9bad2688fb419efb7c0"],["/src/yp-ajax/yp-ajax-error-dialog.html","9be8c63da64c608452e808307749f861"],["/src/yp-ajax/yp-ajax.html","446be1fdeaf9f4f1d236a00212c67078"],["/src/yp-app-globals/yp-app-globals.html","1b6fc89b889827ffece48dc7cb62ec81"],["/src/yp-app-globals/yp-app-user.html","94984aeb01afbc7804f0892404d3ddea"],["/src/yp-app.html","1705fbf0891323864f7fb317ce183810"],["/src/yp-app/yp-app-drawer.html","e4bd12879ee4d8414b6550e3c478666d"],["/src/yp-app/yp-app-nav-drawer.html","660004ff80a20b8b847907968d8a6eee"],["/src/yp-app/yp-view-404.html","5e8a48285a4372ad9d8aea0d6556f95d"],["/src/yp-behaviors/access-helpers.html","5e6047b1da4ebe851b93f026a9dcc641"],["/src/yp-behaviors/app-helpers.html","ba7e7723f15042e01baa689efdca7276"],["/src/yp-behaviors/collection-helpers.html","3a5ce0747867d05abac1f62d9ff6d12f"],["/src/yp-behaviors/word-wrap.html","15d19e210c10cb38a87cff1fc2049902"],["/src/yp-behaviors/yp-collection-status-options.html","9a816782ee11e1af759ee506cd6104fc"],["/src/yp-behaviors/yp-got-admin-rights-behavior.html","bd77915864f9b6f51fe0a244a150707b"],["/src/yp-behaviors/yp-large-card-behaviors.html","4dc27e4e33be79056aac93fb833abcd4"],["/src/yp-behaviors/yp-logged-in-user-behavior.html","d29e6b044fe4db319922b4c78b5c7f5a"],["/src/yp-behaviors/yp-scroll-tab-behavior.html","2c0c9c8eff86377376a5a686667b5a4f"],["/src/yp-category/yp-category-edit.html","041e796626745b65e88e95ea6a05c393"],["/src/yp-community/yp-community-behaviors.html","f9ba5f782cf69b698ef2ed9caedd170d"],["/src/yp-community/yp-community-card-add.html","1ae759ccd4641b0a0d4ad315f77e60dc"],["/src/yp-community/yp-community-card.html","c6623a86be980336770fba330f99765b"],["/src/yp-community/yp-community-collection-behaviors.html","d482c851c627a9c53d96d0c027e2be25"],["/src/yp-community/yp-community-edit.html","1f6a0f6b58974948d9ac5a214e133825"],["/src/yp-community/yp-community-grid.html","be633a58545fb36bb18b2eaacaab6e94"],["/src/yp-community/yp-community-large-card.html","1b817fd9505a39de4ac1b4ce901e3066"],["/src/yp-community/yp-community-stats.html","2dc9790240ccd326541a160ef3754e8d"],["/src/yp-community/yp-community.html","ee038ff00f8d7d56a7b0fdaf65218af9"],["/src/yp-delete-dialog/yp-delete-dialog.html","d0bad48fce72ccbbcef9220346adbed8"],["/src/yp-dialog-container/yp-confirmation-dialog.html","68b68e1f0d8698510d399b17560d0909"],["/src/yp-dialog-container/yp-dialog-container-admin.html","d54f8e2ee7e544a7d1ac6e4407cbcd63"],["/src/yp-dialog-container/yp-dialog-container-logged-in.html","a5e546496b00a78a0603dacd1a9995f1"],["/src/yp-dialog-container/yp-dialog-container.html","5437a6762c774864dd75f159149a3c14"],["/src/yp-domain/yp-domain-edit.html","ac4c814dfa7d58e17f6dd76922210dc1"],["/src/yp-domain/yp-domain-large-card.html","5f1f1d640de93606ce0d26b01de42c78"],["/src/yp-domain/yp-domain-stats.html","2034ac0d2af46af20b383c93c7c31065"],["/src/yp-domain/yp-domain.html","5ceea3611d9441192cc299d98b7135ac"],["/src/yp-edit-dialog/yp-edit-dialog-behavior.html","76b3150c3ba49cbe837efa58dad75689"],["/src/yp-edit-dialog/yp-edit-dialog.html","fa0609dd4414992ff91f02288176747b"],["/src/yp-edit-dialog/yp-fullscreen-dialog.html","6d5be35e680dc6c2ea3c30bd3aaa6311"],["/src/yp-group/yp-group-behaviors.html","6bb9ccc566453637353d1e0ee559d446"],["/src/yp-group/yp-group-card-add.html","abc9b576cdebbf6b88d7a4c8e48ea0c7"],["/src/yp-group/yp-group-card-large.html","fe42a9430225f91567e719c77c333bb9"],["/src/yp-group/yp-group-card.html","fcc7840d2caffd23edaa0c6fc87c597c"],["/src/yp-group/yp-group-collection-behaviors.html","cd183a36f0f6d392a65dc9d831204600"],["/src/yp-group/yp-group-edit.html","339c709ce071ae52e5057f91604a6257"],["/src/yp-group/yp-group-grid.html","7742d7a5352133e774f90c542bfb4531"],["/src/yp-group/yp-group-stats.html","80600e9d94a2bbe72c9e369fd94a3c16"],["/src/yp-group/yp-group.html","6448407f733c2ea0eb4136a8ab4f1589"],["/src/yp-image-uploader/yp-image-uploader.html","91589e860cf1c38933a43455cdd09fb5"],["/src/yp-membership-button/yp-membership-button.html","4c68ac3fbcc34958b97f98701a4d4096"],["/src/yp-organization/yp-organization-edit.html","7a985d2f6a1298c90c015eb11f1dd112"],["/src/yp-other-social-media/yp-other-social-media.html","f16464a2a631ba12b308d832a45da772"],["/src/yp-page/yp-page-dialog.html","0fc87b081f179d43cfae562c97c8fbcb"],["/src/yp-page/yp-page.html","089f7a3a9077166af85d8541bc27ef48"],["/src/yp-page/yp-pages-grid.html","743999ada35574dc113882da4f458980"],["/src/yp-point/yp-point-actions.html","954bf338135670bab914aafb27bbe875"],["/src/yp-point/yp-point-comment-edit.html","9ef4de9273e2bd5d90332cdbb38ce3d0"],["/src/yp-point/yp-point-comment-list.html","568158f091d9ea989a5154861304e156"],["/src/yp-point/yp-point-comment.html","5e0a6137ded4e3b515f861db0d5f4a05"],["/src/yp-point/yp-point-news-story-edit.html","358fbc882264c30d59daa24fe9b8a86d"],["/src/yp-point/yp-point-news-story-embed.html","021e63704966d15425e8709d99022780"],["/src/yp-point/yp-point-news-story.html","d3ff1fd106a66853c2209af1c7087662"],["/src/yp-point/yp-point.html","9f391f5c6005183e4029f1ecccb3b36d"],["/src/yp-post/yp-post-actions.html","9bf8297d51012627eb0303d9787517e6"],["/src/yp-post/yp-post-behaviors.html","29e42877720c4576893363e8b3c19803"],["/src/yp-post/yp-post-card-add.html","1676d07fc3a550881da9d3d00b39645b"],["/src/yp-post/yp-post-card.html","48be1628319a6f400122d73533c2dbc6"],["/src/yp-post/yp-post-cover-media.html","afcec0224bcc353a82c399e378b5a1d7"],["/src/yp-post/yp-post-edit.html","f3457e48398c8015b02caec90499f9e3"],["/src/yp-post/yp-post-header.html","de2e946a3a4aa1940a2f82cff41eb4ba"],["/src/yp-post/yp-post-list.html","1a3699a53591427063a39f23edec37f4"],["/src/yp-post/yp-post-location.html","5016ed8e7fc554367c34b5db32909643"],["/src/yp-post/yp-post-map.html","d9ed5b983bef488b8c54cf4a3ef225f8"],["/src/yp-post/yp-post-move.html","bc527094e2994406cac3e2903ed0f82d"],["/src/yp-post/yp-post-points.html","c3d3bc542727e341916e69097c82bcca"],["/src/yp-post/yp-post-status-change-edit.html","9c50abedfdb763f4347a9377f1814766"],["/src/yp-post/yp-post-user-image-card.html","ce833433501be12460c45df32f061ef1"],["/src/yp-post/yp-post-user-image-edit.html","3842ea5a26de59d82cc8248b4db6bea9"],["/src/yp-post/yp-post-user-images.html","61e4c9b2b7ede180c1fbf65b81821c06"],["/src/yp-post/yp-post-users.html","8b3428658e103b245b4d3eebb359994a"],["/src/yp-post/yp-post.html","86d05d856695b2edd14a9a23b6ebd7eb"],["/src/yp-posts-filter/yp-posts-filter.html","83bac01171d981a98dc32bf189871500"],["/src/yp-session/yp-session.html","af9cb636eebfd05bbd43f0db7ee979c2"],["/src/yp-theme/yp-theme-behavior.html","b708257529b432c4daf01fd0d99183d0"],["/src/yp-theme/yp-theme-selector.html","a3f05490d4f77f2d2a03a809c3f00118"],["/src/yp-user/yp-accept-invite.html","015a23031c2a509eaedd9c9f20d415a9"],["/src/yp-user/yp-forgot-password.html","a5859a382f53aff35e499be3189b3f6f"],["/src/yp-user/yp-login.html","fdba4d8363469a39e10be9dc5e9f4ebe"],["/src/yp-user/yp-missing-email.html","1276182dc191d37bd6f048ed901d3e08"],["/src/yp-user/yp-reset-password.html","e1d19516f9c6d788921db0f79185e4dc"],["/src/yp-user/yp-user-edit.html","0ab6642428c0af253ea4ca36b966776a"],["/src/yp-user/yp-user-image.html","bbe46c6de27fdfbad56242177d40e6d8"],["/src/yp-user/yp-user-info.html","c935892d506924713df4e8b2b6bcb98f"],["/src/yp-user/yp-user-language-selector.html","a1f0b503457185d4ab95e8988ee0c6f6"],["/src/yp-user/yp-user-with-organization.html","36fcde50806802e06116f0fb7ba37c0a"],["/src/yp-user/yp-users-grid.html","820375af69b2ff569cfc90f209426c92"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1--' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var getCacheBustedUrl = function (url, param) {
    param = param || Date.now();

    var urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.search += (urlWithCacheBusting.search ? '&' : '') +
      'sw-precache=' + param;

    return urlWithCacheBusting.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var populateCurrentCacheNames = function (precacheConfig,
    cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    // Take a look at each of the cache names we expect for this version.
    Promise.all(Object.keys(CurrentCacheNamesToAbsoluteUrl).map(function(cacheName) {
      return caches.open(cacheName).then(function(cache) {
        // Get a list of all the entries in the specific named cache.
        // For caches that are already populated for a given version of a
        // resource, there should be 1 entry.
        return cache.keys().then(function(keys) {
          // If there are 0 entries, either because this is a brand new version
          // of a resource or because the install step was interrupted the
          // last time it ran, then we need to populate the cache.
          if (keys.length === 0) {
            // Use the last bit of the cache name, which contains the hash,
            // as the cache-busting parameter.
            // See https://github.com/GoogleChrome/sw-precache/issues/100
            var cacheBustParam = cacheName.split('-').pop();
            var urlWithCacheBusting = getCacheBustedUrl(
              CurrentCacheNamesToAbsoluteUrl[cacheName], cacheBustParam);

            var request = new Request(urlWithCacheBusting,
              {credentials: 'same-origin'});
            return fetch(request).then(function(response) {
              if (response.ok) {
                return cache.put(CurrentCacheNamesToAbsoluteUrl[cacheName],
                  response);
              }

              console.error('Request for %s returned a response status %d, ' +
                'so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          }
        });
      });
    })).then(function() {
      return caches.keys().then(function(allCacheNames) {
        return Promise.all(allCacheNames.filter(function(cacheName) {
          return cacheName.indexOf(CacheNamePrefix) === 0 &&
            !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    var navigateFallback = '/index.html';
    // Ideally, this would check for event.request.mode === 'navigate', but that is not widely
    // supported yet:
    // https://code.google.com/p/chromium/issues/detail?id=540967
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1209081
    if (!cacheName && navigateFallback && event.request.headers.has('accept') &&
        event.request.headers.get('accept').includes('text/html') &&
        /* eslint-disable quotes, comma-spacing */
        isPathWhitelisted([], event.request.url)) {
        /* eslint-enable quotes, comma-spacing */
      var navigateFallbackUrl = new URL(navigateFallback, self.location);
      cacheName = AbsoluteUrlToCacheName[navigateFallbackUrl.toString()];
    }

    if (cacheName) {
      event.respondWith(
        // Rely on the fact that each cache we manage should only have one entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              if (response) {
                return response;
              }
              // If for some reason the response was deleted from the cache,
              // raise and exception and fall back to the fetch() triggered in the catch().
              throw Error('The cache ' + cacheName + ' is empty.');
            });
          });
        }).catch(function(e) {
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});





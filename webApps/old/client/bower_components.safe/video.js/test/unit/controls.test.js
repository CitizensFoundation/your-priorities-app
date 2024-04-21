/* eslint-env qunit */
import VolumeControl from '../../src/js/control-bar/volume-control/volume-control.js';
import MuteToggle from '../../src/js/control-bar/mute-toggle.js';
import VolumeBar from '../../src/js/control-bar/volume-control/volume-bar.js';
import PlayToggle from '../../src/js/control-bar/play-toggle.js';
import PlaybackRateMenuButton from '../../src/js/control-bar/playback-rate-menu/playback-rate-menu-button.js';
import Slider from '../../src/js/slider/slider.js';
import FullscreenToggle from '../../src/js/control-bar/fullscreen-toggle.js';
import ControlBar from '../../src/js/control-bar/control-bar.js';
import TestHelpers from './test-helpers.js';
import document from 'global/document';
import sinon from 'sinon';

QUnit.module('Controls', {
  beforeEach(assert) {
    this.clock = sinon.useFakeTimers();
  },
  afterEach(assert) {
    this.clock.restore();
  }
});

QUnit.test('should hide volume and mute toggle control if it\'s not supported', function(assert) {
  assert.expect(2);

  const player = TestHelpers.makePlayer();

  player.tech_.featuresVolumeControl = false;
  player.tech_.featuresMuteControl = false;

  const volumeControl = new VolumeControl(player);
  const muteToggle = new MuteToggle(player);

  assert.ok(volumeControl.hasClass('vjs-hidden'), 'volumeControl is not hidden');
  assert.ok(muteToggle.hasClass('vjs-hidden'), 'muteToggle is not hidden');

  player.dispose();
});

QUnit.test('should show replay icon when video playback ended', function(assert) {
  assert.expect(1);

  const player = TestHelpers.makePlayer();

  const playToggle = new PlayToggle(player);

  player.trigger('ended');

  assert.ok(playToggle.hasClass('vjs-ended'), 'playToogle is in the ended state');

  player.dispose();
});

QUnit.test('should show replay icon when video playback ended and replay option is set to true', function(assert) {
  assert.expect(1);

  const player = TestHelpers.makePlayer();

  const playToggle = new PlayToggle(player, {replay: true});

  player.trigger('ended');

  assert.ok(playToggle.hasClass('vjs-ended'), 'playToogle is in the ended state');

  player.dispose();
});

QUnit.test('should not show the replay icon when video playback ended', function(assert) {
  assert.expect(1);

  const player = TestHelpers.makePlayer();

  const playToggle = new PlayToggle(player, {replay: false});

  player.trigger('ended');

  assert.equal(playToggle.hasClass('vjs-ended'), false, 'playToogle is not in the ended state');

  player.dispose();
});

QUnit.test('should test and toggle volume control on `loadstart`', function(assert) {
  const player = TestHelpers.makePlayer();

  player.tech_.featuresVolumeControl = true;
  player.tech_.featuresMuteControl = true;

  const volumeControl = new VolumeControl(player);
  const muteToggle = new MuteToggle(player);

  assert.equal(volumeControl.hasClass('vjs-hidden'), false, 'volumeControl is hidden initially');
  assert.equal(muteToggle.hasClass('vjs-hidden'), false, 'muteToggle is hidden initially');

  player.tech_.featuresVolumeControl = false;
  player.tech_.featuresMuteControl = false;
  player.trigger('loadstart');

  assert.equal(volumeControl.hasClass('vjs-hidden'), true, 'volumeControl does not hide itself');
  assert.equal(muteToggle.hasClass('vjs-hidden'), true, 'muteToggle does not hide itself');

  player.tech_.featuresVolumeControl = true;
  player.tech_.featuresMuteControl = true;
  player.trigger('loadstart');

  assert.equal(volumeControl.hasClass('vjs-hidden'), false, 'volumeControl does not show itself');
  assert.equal(muteToggle.hasClass('vjs-hidden'), false, 'muteToggle does not show itself');

  player.dispose();
});

QUnit.test('calculateDistance should use changedTouches, if available', function(assert) {
  const player = TestHelpers.makePlayer();

  player.tech_.featuresVolumeControl = true;

  const slider = new Slider(player);

  document.body.appendChild(slider.el_);
  slider.el_.style.position = 'absolute';
  slider.el_.style.width = '200px';
  slider.el_.style.left = '0px';

  const event = {
    pageX: 10,
    changedTouches: [{
      pageX: 100
    }]
  };

  assert.equal(slider.calculateDistance(event), 0.5, 'we should have touched exactly in the center, so, the ratio should be half');

  player.dispose();
});

QUnit.test('should hide playback rate control if it\'s not supported', function(assert) {
  assert.expect(1);

  const player = TestHelpers.makePlayer();
  const playbackRate = new PlaybackRateMenuButton(player);

  assert.ok(playbackRate.el().className.indexOf('vjs-hidden') >= 0, 'playbackRate is not hidden');

  player.dispose();
});

QUnit.test('Fullscreen control text should be correct when fullscreenchange is triggered', function(assert) {
  const player = TestHelpers.makePlayer();
  const fullscreentoggle = new FullscreenToggle(player);

  player.isFullscreen(true);
  player.trigger('fullscreenchange');
  assert.equal(fullscreentoggle.controlText(), 'Non-Fullscreen', 'Control Text is correct while switching to fullscreen mode');

  player.isFullscreen(false);
  player.trigger('fullscreenchange');
  assert.equal(fullscreentoggle.controlText(), 'Fullscreen', 'Control Text is correct while switching back to normal mode');

  player.dispose();
});

QUnit.test('Clicking MuteToggle when volume is above 0 should toggle muted property and not change volume', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const muteToggle = new MuteToggle(player);

  assert.equal(player.volume(), 1, 'volume is above 0');
  assert.equal(player.muted(), false, 'player is not muted');

  muteToggle.handleClick();

  assert.equal(player.volume(), 1, 'volume is same');
  assert.equal(player.muted(), true, 'player is muted');

  player.dispose();
});

QUnit.test('Clicking MuteToggle when volume is 0 and muted is false should set volume to lastVolume and keep muted false', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const muteToggle = new MuteToggle(player);

  player.volume(0);
  assert.equal(player.lastVolume_(), 1, 'lastVolume is set');
  assert.equal(player.muted(), false, 'player is muted');

  muteToggle.handleClick();

  assert.equal(player.volume(), 1, 'volume is set to lastVolume');
  assert.equal(player.muted(), false, 'muted remains false');

  player.dispose();
});

QUnit.test('Clicking MuteToggle when volume is 0 and muted is true should set volume to lastVolume and sets muted to false', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const muteToggle = new MuteToggle(player);

  player.volume(0);
  player.muted(true);
  player.lastVolume_(0.5);

  muteToggle.handleClick();

  assert.equal(player.volume(), 0.5, 'volume is set to lastVolume');
  assert.equal(player.muted(), false, 'muted is set to false');

  player.dispose();
});

QUnit.test('Clicking MuteToggle when volume is 0, lastVolume is less than 0.1, and muted is true sets volume to 0.1 and muted to false', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const muteToggle = new MuteToggle(player);

  player.volume(0);
  player.muted(true);
  player.lastVolume_(0.05);

  muteToggle.handleClick();

  // `Number.prototype.toFixed()` is used here to circumvent rounding issues
  assert.equal(player.volume().toFixed(1), (0.1).toFixed(1), 'since lastVolume is less than 0.1, volume is set to 0.1');
  assert.equal(player.muted(), false, 'muted is set to false');

  player.dispose();
});

QUnit.test('ARIA value of VolumeBar should start at 100', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const volumeBar = new VolumeBar(player);

  this.clock.tick(1);

  assert.equal(volumeBar.el_.getAttribute('aria-valuenow'), 100, 'ARIA value of VolumeBar is 100');

  player.dispose();
});

QUnit.test('Muting with MuteToggle should set ARIA value of VolumeBar to 0', function(assert) {
  const player = TestHelpers.makePlayer({ techOrder: ['html5'] });
  const volumeBar = new VolumeBar(player);
  const muteToggle = new MuteToggle(player);

  this.clock.tick(1);

  assert.equal(player.volume(), 1, 'Volume is 1');
  assert.equal(player.muted(), false, 'Muted is false');
  assert.equal(volumeBar.el_.getAttribute('aria-valuenow'), 100, 'ARIA value of VolumeBar is 100');

  muteToggle.handleClick();

  // Because `volumechange` is triggered asynchronously, it doesn't end up
  // getting fired on `player` in the test environment, so we run it
  // manually.
  player.trigger('volumechange');

  assert.equal(player.volume(), 1, 'Volume remains 1');
  assert.equal(player.muted(), true, 'Muted is true');
  assert.equal(volumeBar.el_.getAttribute('aria-valuenow'), 0, 'ARIA value of VolumeBar is 0');

  player.dispose();
});

QUnit.test('controlbar children to false individually, does not cause an assertion', function(assert) {
  const defaultChildren = ControlBar.prototype.options_.children;

  defaultChildren.forEach((childName) => {
    const options = {controlBar: {}};

    options.controlBar[childName] = false;

    const player = TestHelpers.makePlayer(options);

    this.clock.tick(1000);
    player.triggerReady();
    player.dispose();
    assert.ok(true, `${childName}: false. did not cause an assertion`);
  });
});

QUnit.test('all controlbar children to false, does not cause an assertion', function(assert) {
  const defaultChildren = ControlBar.prototype.options_.children;
  const options = {controlBar: {}};

  defaultChildren.forEach((childName) => {
    options.controlBar[childName] = false;
  });

  const player = TestHelpers.makePlayer(options);

  this.clock.tick(1000);
  player.triggerReady();
  player.dispose();
  assert.ok(true, 'did not cause an assertion');
});

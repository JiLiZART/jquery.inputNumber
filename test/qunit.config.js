
// Configure QUnit
QUnit.config.autostart = false;

if (typeof jQuery === 'undefined') {
    QUnit.test('jQuery is loaded', function(assert) {
      assert.ok(false, 'jQuery is not loaded');
    });
}

// Start QUnit tests
// QUnit.start();
QUnit.module('jQuery.inputNumber', {
  beforeEach: function() {
    // Create a fresh input element for each test
    this.input = jQuery('<input type="text">').appendTo('#qunit-fixture');
  },
  afterEach: function() {
    // Clean up after each test
    this.input.remove();
  }
});

QUnit.test('Plugin initialization', function(assert) {
  this.input.inputNumber();
  assert.ok(this.input.data('inputNumber'), 'Plugin initialized successfully');
});

QUnit.test('Set and get value', function(assert) {
  this.input.inputNumber({
    min: 0,
    max: 100
  });
  
  this.input.val(50);
  this.input.trigger('change');
  
  assert.equal(this.input.val(), 50, 'Value set and retrieved correctly');
});

QUnit.test('Min and max constraints', function(assert) {
  this.input.inputNumber({
    min: 0,
    max: 100
  });
  
  this.input.val(150);
  this.input.trigger('change');
  
  assert.equal(this.input.val(), 100, 'Value capped at maximum');
  assert.equal(this.input.data('inputNumber').$up.attr('disabled'), 'disabled', 'Up button disabled');
  
  this.input.val(-50);
  this.input.trigger('change');
  
  assert.equal(this.input.val(), 0, 'Value capped at minimum');
  assert.equal(this.input.data('inputNumber').$down.attr('disabled'), 'disabled', 'Down button disabled');
});

QUnit.test('Decimal precision', function(assert) {
  this.input.inputNumber({
    decimal: 2
  });
  
  this.input.val('10.123');
  this.input.trigger('change');
  
  assert.equal(this.input.val(), '10.12', 'Decimal precision maintained');
});
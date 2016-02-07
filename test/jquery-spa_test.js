(function ($) {
  module('jQuery#jquerySpa', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.jquerySpa(), this.elems, 'should be chainable');
  });

  test('is jquerySpa', function () {
    expect(1);
    strictEqual(this.elems.jquerySpa().text(), 'jquerySpa0jquerySpa1jquerySpa2', 'should be jquerySpa');
  });

}(jQuery));

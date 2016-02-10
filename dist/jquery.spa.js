/*! jquery.spa - v0.0.1 - 2016-02-10
* https://github.com/cwasser/jquery-spa#readme
* Copyright (c) 2016 Christian Wasser; Licensed MIT */
(function ($) {
  $.fn.jquerySpa = function () {
    return this.each(function (i) {
      // Do something to each selected element.
      $(this).html('jquerySpa' + i);
    });
  };
}(jQuery));

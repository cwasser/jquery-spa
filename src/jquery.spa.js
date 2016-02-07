/*
 * 
 * 
 *
 * Copyright (c) 2016 Christian Wasser
 * Licensed under the MIT license.
 */
(function ($) {
  $.fn.jquerySpa = function () {
    return this.each(function (i) {
      // Do something to each selected element.
      $(this).html('jquerySpa' + i);
    });
  };
}(jQuery));

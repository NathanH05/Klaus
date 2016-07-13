(function ($) {
  var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  function AvailabilityCalendar(container, bookedDates) {
    this.date = new Date();
    this.date.setDate(1);

    this.container = container;
    this.bookedDates = bookedDates;

    this.createCalendar();
    this.renderMonth();
  }


  AvailabilityCalendar.prototype = {
    /**
     * Setup methods
     */
    __createToolbar: function () {
      var $toolbar = $('<div></div>').appendTo(this.container);
      $toolbar.addClass('availability-calendar-toolbar');

      this.$monthLabel = $('<span></span>').appendTo($toolbar);
      var $inputContainer = $('<span></span>').appendTo($toolbar);

      $inputContainer.append('<input type="button" title="This month" value="This Month">');
      $inputContainer.append('<input type="button" title="Previous month" value="&#10094;">');
      $inputContainer.append('<input type="button" title="Next month" value="&#10095;">');

      var $inputs = $inputContainer.children('input');
      var self = this;

      $inputs.eq(0).on('click', function () {
        self.date = new Date();
        self.date.setDate(1);
        self.renderMonth();
      });

      $inputs.eq(1).on('click', function () {
        self.date.setMonth(self.date.getMonth() - 1);
        self.renderMonth();
      });

      $inputs.eq(2).on('click', function () {
        self.date.setMonth(self.date.getMonth() + 1);
        self.renderMonth();
      });
    },
    __createTable: function () {
      var $table = $('<table></table>').appendTo(this.container);
      $table.addClass('availability-calendar');

      // Weekday headers
      var $tr = $('<tr></tr>').appendTo($table);

      weekdays.forEach(function (day) {
        $('<th></th>').html(day).appendTo($tr);
      });

      // Day cells
      for (var i = 0; i < 6; ++i) {
        $tr = $('<tr></tr>').appendTo($table);
        $tr.append('<td></td><td></td><td></td><td></td><td></td><td></td><td></td>');
      }

      this.$cells = $table.find('td');
    },
    createCalendar: function () {
      this.__createToolbar();
      this.__createTable();
    },


    /**
     * Month rendering methods
     */
    __addPreviousMonthDays: function (date, cellIndexes, dates) {
      var firstWeekdayOfMonth = date.getDay() - 1;
      if (firstWeekdayOfMonth < 0) firstWeekdayOfMonth = 6;

      if (firstWeekdayOfMonth > 0) {
        date.setDate(0);
        var numDays = date.getDate();

        for (var i = numDays - firstWeekdayOfMonth + 1; i <= numDays; ++i) {
          this.$cells.eq(dates.length).html(i).addClass('ex-month');

          date.setDate(i);
          var dateInt = date.valueOf();

          cellIndexes[dateInt] = dates.length;
          dates.push(dateInt);
        }
      }
    },
    __addThisMonthDays: function (date, year, month, cellIndexes, dates) {
      date.setFullYear(year, month + 1, 0); // Need to reset year
      var numDays = date.getDate();

      for (var i = 1; i <= numDays; ++i) {
        this.$cells.eq(dates.length).html(i);

        date.setDate(i);
        var dateInt = date.valueOf();

        cellIndexes[dateInt] = dates.length;
        dates.push(dateInt);
      }
    },
    __addNextMonthDays: function (date, month, cellIndexes, dates) {
      if (dates.length < 42) {
        date.setMonth(month + 1, 1);
        var remainingDays = 42 - dates.length;

        for (var i = 1; i <= remainingDays; ++i) {
          this.$cells.eq(dates.length).html(i).addClass('ex-month');

          date.setDate(i);
          var dateInt = date.valueOf();

          cellIndexes[dateInt] = dates.length;
          dates.push(dateInt);
        }
      }
    },
    __addEvents: function (cellIndexes, dates) {
      var firstDate = dates[0];
      var lastDate = dates[dates.length - 1];
      var self = this;

      this.bookedDates.forEach(function (date) {
        if (date.start <= lastDate && date.end >= firstDate) {
          var startIndex = cellIndexes[date.start];
          var endIndex = cellIndexes[date.end];

          if (startIndex !== undefined) {
            self.$cells.eq(startIndex).addClass('unavailable').append('<div class="first"></div>');
            ++startIndex;
          }
          else {
            startIndex = cellIndexes[firstDate];
          }

          if (endIndex !== undefined) {
            self.$cells.eq(endIndex).addClass('unavailable').append('<div class="last"></div>');
            --endIndex;
          }
          else {
            endIndex = cellIndexes[lastDate];
          }

          self.$cells.slice(startIndex, endIndex + 1).addClass('unavailable').append('<div></div>');
        }
      });
    },
    renderMonth: function () {
      var cellIndexes = {};
      var dates = [];

      var year = this.date.getFullYear();
      var month = this.date.getMonth();
      var date = new Date(year, month, 1);

      this.$monthLabel.html(months[month] + ' ' + year);
      this.$cells.removeClass('ex-month');
      this.$cells.filter('.unavailable').removeClass('unavailable').children().remove();

      this.__addPreviousMonthDays(date, cellIndexes, dates);
      this.__addThisMonthDays(date, year, month, cellIndexes, dates);
      this.__addNextMonthDays(date, month, cellIndexes, dates);

      this.__addEvents(cellIndexes, dates);
    }
  };


  $.fn.availabilityCalendar = function (bookedDates) {
    var dates = [];

    bookedDates.forEach(function (date) {
      var start = new Date(date.start);
      var end = new Date(date.end);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      start = start.valueOf();
      end = end.valueOf();

      if (start <= end) {
        dates.push({
          start: start,
          end: end
        });
      }
    });

    this.each(function () {
      new AvailabilityCalendar(this, dates);
    });

    return this;
  };
})(jQuery);





(function($"#form", window, undefined) {
  "use strict";

  $.fn.tabslet = function(options) {

    var defaults = {
      mouseevent:   'click',
      activeclass:  'active',
      attribute:    'href',
      animation:    false,
      autorotate:   false,
      deeplinking:  false,
      pauseonhover: true,
      delay:        2000,
      active:       1,
      container:    false,
      controls:     {
        prev: '.prev',
        next: '.next'
      }
    };

    var options = $.extend(defaults, options);

    return this.each(function() {

      var $this      = $(this), _cache_li = [], _cache_div = [];
      var _container = options.container ? $(options.container) : $this;
      var _tabs      = _container.find('> div');

      // Caching
      _tabs.each(function() { _cache_div.push($(this).css('display')); });

      // Autorotate
      var elements = $this.find('> ul > li'), i = options.active - 1; // ungly

      if ( !$this.data( 'tabslet-init' ) ) {

        $this.data( 'tabslet-init', true );

        $this.opts = [];

        $.map( ['mouseevent', 'activeclass', 'attribute', 'animation', 'autorotate', 'deeplinking', 'pauseonhover', 'delay', 'container'], function( val, i ) {
          $this.opts[val] = $this.data(val) || options[val];
        });

        $this.opts['active'] = $this.opts.deeplinking ? deep_link() : ( $this.data('active') || options.active )

        _tabs.hide();

        if ( $this.opts.active ) {
          _tabs.eq($this.opts.active - 1).show();
          elements.eq($this.opts.active - 1).addClass(options.activeclass);
        }

        var fn = eval(

          function(e, tab) {
            var _this = tab ? elements.find('a[' + $this.opts.attribute + '=' + tab +']').parent() : $(this);

            _this.trigger('_before');

            elements.removeClass(options.activeclass);
            _this.addClass(options.activeclass);
            _tabs.hide();

            i = elements.index(_this);

            var currentTab = tab || _this.find('a').attr($this.opts.attribute);

            if ($this.opts.deeplinking) location.hash = currentTab;

            if ($this.opts.animation) {

              _container.find(currentTab).animate( { opacity: 'show' }, 'slow', function() {
                _this.trigger('_after');
              });

            } else {

              _container.find(currentTab).show();
              _this.trigger('_after');

            }

            return false;

          }

        );

        var init = eval("elements." + $this.opts.mouseevent + "(fn)");

        init;

        var t;

        var forward = function() {

          i = ++i % elements.length; // wrap around

          $this.opts.mouseevent == 'hover' ? elements.eq(i).trigger('mouseover') : elements.eq(i).click();

          if ($this.opts.autorotate) {

            clearTimeout(t);

            t = setTimeout(forward, $this.opts.delay);

            $this.mouseover(function () {

              if ($this.opts.pauseonhover) clearTimeout(t);

            });

          }

        }

        if ($this.opts.autorotate) {

          t = setTimeout(forward, $this.opts.delay);

          $this.hover(function() {

            if ($this.opts.pauseonhover) clearTimeout(t);

          }, function() {

            t = setTimeout(forward, $this.opts.delay);

          });

          if ($this.opts.pauseonhover) $this.on( "mouseleave", function() { clearTimeout(t); t = setTimeout(forward, $this.opts.delay); });

        }

        function deep_link() {

          var ids = [];

          elements.find('a').each(function() { ids.push($(this).attr($this.opts.attribute)); });

          var index = $.inArray(location.hash, ids)

          if (index > -1) {

            return index + 1

          } else {

            return ($this.data('active') || options.active)

          }

        }

        var move = function(direction) {

          if (direction == 'forward') i = ++i % elements.length; // wrap around

          if (direction == 'backward') i = --i % elements.length; // wrap around

          elements.eq(i).click();

        }

        $this.find(options.controls.next).click(function() {
          move('forward');
        });

        $this.find(options.controls.prev).click(function() {
          move('backward');
        });

        $this.on ('show', function(e, tab) {
          fn(e, tab);
        });

        $this.on ('next', function() {
          move('forward');
        });

        $this.on ('prev', function() {
          move('backward');
        });

        $this.on ('destroy', function() {
          $(this)
            .removeData()
            .find('> ul li').each( function(i) {
              $(this).removeClass(options.activeclass);
            });
          _tabs.each( function(i) {
            $(this).removeAttr('style').css( 'display', _cache_div[i] );
          });
        });

      }

    });

  };

  $(document).ready(function () { $('[data-toggle="tabslet"]').tabslet(); });

})(jQuery);

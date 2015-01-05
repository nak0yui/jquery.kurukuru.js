(function($) {
  'use strict';
  
  var
  /**
   * Default Options
   */
  defaultOptions = {
    debug: false,
    width: 480,
    height: 327,
    defaultCurrent: 3,
    pixelChange: 8,
    loadingHtml: '<p>Now Loading...</p>',
    image: [],
    selectorZIndex: 0,
    reverse: false,
    maskZIndex: 1000
  },
  /**
   * Arguments to Array
   * @param {*} args arguments
   */
  argumentsToArray = function(args) {
    var tmp = [];
    tmp = tmp.concat.apply(tmp, args);
    return tmp;
  },
  /**
   * Method which stops event propagation
   * @param e:Event
   */
  stopPropagation = function(e) {
    if(e.preventDefault) {
      e.preventDefault();
    } else {
      e.stop();
    }
    e.returnValue = false;
    e.stopPropagation();
  },
  /**
   * get Current pageX
   * @param e:Event
   */
  getPageX = function(e) {
    var pageX, event = e.originalEvent;
    if(event.targetTouches) {
      pageX = event.targetTouches[0].pageX;
    } else {
      pageX = e.pageX;
    }
    return pageX;
  };
  
  var preLoadImage = function(images, onLoaded, onProcessed) {
    var preloader = {
      images: [],
      length: images.length,
      onLoaded: onLoaded,
      onProcessed: onProcessed,
      count: 0,
      errorCount: 0
    };
    var i;
    var processed = function() {
      preloader.count++;
      if ($.isFunction(preloader.onProcessed)) {
        preloader.onProcessed.apply(preloader);
      }
      if (preloader.count >= preloader.length) {
        if ($.isFunction(preloader.onLoaded)) {
          preloader.onLoaded.apply(preloader);
        }
      }
    };
    var load = function() {
      processed();
    };
    var error = function() {
      preloader.errorCount++;
      processed();
    };
    for (i = 0; i < preloader.length; i++) {
      var image = $('<img>');
      image.load(load);
      image.error(error);
      image.attr('src',images[i]);
      preloader.images.push(image);
    }
    return preloader;
  };
  
  $.preLoadImage = function(images, onLoaded, onProcessed) {
    return preLoadImage(images, onLoaded, onProcessed);
  };
  
  var kurukuru = function(_elem, _option) {
    var
    kurukuru = {},
    _opt = $.extend(true, {}, defaultOptions, _option),
    _$elem = $(_elem),
    _$mask,
    _current = _opt.defaultCurrent,
    _loadedImages = false,
    _downPos = -1,
    _iDown = -1,
    _loaded = false;
    
    var publicMethods = {
      init: function() {
        var style = {
          width: _opt.width,
          height: _opt.height
        };
        _$elem.css(style).css({
          position:'relative',
          zIndex: _opt.selectorZIndex
        });
        // Append the mask
        _$mask = $('<div class="mask"></div>').css(style).css({
          backgroundColor: 'white',
          filter: 'alpha(opacity=0)',
          opacity: 0,
          position:'absolute',
          zIndex: _opt.maskZIndex
        });
        removeLoadingHtml();
        _$elem.append(
          $(_opt.loadingHtml).addClass('loading').css({
            zIndex: _opt.maskZIndex + 1
          })
        );
        _$elem.append(_$mask);
        // Load images
        loadImage(_opt.images);
      },
      
      update: function(images, option) {
        if (_loaded === false) {
          return false;
        }
        if (typeof option !== 'undefined') {
          $.extend(true, _opt, option);
          kurukuru.destroy();
          kurukuru.init();
        } else {
          kurukuru.cleanup();
          loadImage(images);
        }
        return true;
      },

      getCurrentIndex: function() {
        return _current;
      },

      cleanupOnlyNotCurrentImage: function() {
        _$elem.children('img').filter(function(index) {
          return index !== _current;
        }).remove();
      },
      
      cleanupOnlyCurrentImage: function() {
        _$elem.children('img:first').remove();
      },
      
      cleanup: function() {
        _$elem.children('img').remove();
      },
      
      destroy: function() {
        _$elem.html('');
      }
    };
    
    var loadImage = function(images) {
      appendLoadingHtml();
      _loaded = false;
      $.preLoadImage(images, function() {
        _loadedImages = this.images;
        $.each(_loadedImages, function(index) {
          this.css({
            position:'absolute',
            zIndex: _opt.selectorZIndex + 1
          });
          _$elem.append(this);
          if (_current !== index) {
              this.hide();
          }
          _loaded = true;
          // Add mouse events
          _$mask.unbind('mousedown');
          _$mask.unbind("touchstart");
          _$mask.bind('mousedown', _handle.mouseDown);
          _$mask.bind("touchstart", _handle.mouseDown);
        });
        removeLoadingHtml();
      });
    };
    
    var appendLoadingHtml = function() {
      _$elem.children('.loading').show();
    };
    
    var removeLoadingHtml = function() {
      _$elem.children('.loading').hide();
    };
    
    var 
    _handle = {
      /**
       * handles the mouse down event
       * @param e:Event
       */
      mouseDown: function(e) {
        var pageX = getPageX(e);
        stopPropagation(e);
        // Don't do anything
        if(!_loaded) {
          return;
        }
        // Save the position
        _downPos = pageX;
        _iDown = _current;
        // Add event listeners
        $(document).bind("mouseup", _handle.mouseUp);
        $(document).bind("mousemove", _handle.mouseMove);
        $(document).bind("touchmove", _handle.mouseMove);
        $(document).bind("touchend", _handle.mouseUp);
        
      },
      /**
       * Handles the mouse up event
       * @param e:Event
       */
      mouseUp: function(e) {
        stopPropagation(e);
        // Remove event listeners
        $(document).unbind("mouseup", _handle.mouseUp);
        $(document).unbind("mousemove", _handle.mouseMove);
        $(document).unbind("touchmove", _handle.mouseMove);
        $(document).unbind("touchend", _handle.mouseUp);
        _iDown = -1;
      },
      /**
       * Method which handles the moving of the mouse
       * @param e:Event
       */
      mouseMove: function(e) {
        var pageX = getPageX(e);
        // If the loaded image does not exist yet, return!
        if(!_loadedImages[_current]) {
          return;
        }
        // Calculate the base range
        var positive = (pageX - _downPos < 0) ? -1 : 1;
        positive = _opt.reverse ? positive * -1 : positive;
        var distance = Math.abs(pageX - _downPos);
        var length = _loadedImages.length;
        var moveToIndex = (distance / _opt.pixelChange);
        moveToIndex = Math.floor(moveToIndex % _loadedImages.length);
        // Hide current active image
        _loadedImages[_current].hide();
        // Calculate the current index
        _current = _iDown + positive * moveToIndex;
        if (_current >= length || _current < 0) {
          _current = _current + -1 * positive * length;
        }
        // Show the new image
        _loadedImages[_current].show();
      }
    };
    
    // setting public methods
    $.extend(kurukuru, publicMethods);
    return kurukuru;
  };
  
  $.fn.kurukuru = function(option) {
    var ret;
    return this.each(function() {
      ret = kurukuru(this, option);
      ret.init();
      $(this).data('kurukuru', ret);
    });
  };

}(jQuery));

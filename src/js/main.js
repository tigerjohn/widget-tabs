(function ($) {

    var _setTabsIndex = function(settings, defaultTabs){
        for ( var i = 0, item; ( item = defaultTabs[ i ] ); i++ ) {

            $(item).attr({
                role: "tab",
                tabIndex: i
            });
        }
    };

    var _triggerOnClick = function(defaultTabs, index){
        var click = index <= -1 ? " " : defaultTabs.eq(index).trigger('click');
        return click;

    };

    var _scrollToContent = function(href, scrollSpeed){
        var target = $('#'+href).offset().top;
        $('html, body').animate({scrollTop: target}, scrollSpeed);
    };


    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this),
                    settings = $this.data('widgetTabs');

                if (typeof(settings) == 'undefined') {
                    var defaults = {
                        // These are the defaults.
                        tabsNav: ".tabs-nav",
                        tabs: "a",
                        tabsContent: ".tabs-panel",
                        activeTab: 1,               //Number or 0/false
                        animationSpeed: 300,
                        scrollToContent: false,
                        scrollSpeed: 500,
                        onClick: function(){}
                    };

                    settings = $.extend({}, defaults, options);
                    $this.data('widgetTabs', settings);
                } else {
                    settings = $.extend({}, settings, options);
                }

                var tabs_nav = $this.find(settings.tabsNav),
                    tabs = tabs_nav.length == 0 ? $this.find(settings.tabs) : tabs_nav.find(settings.tabs),
                    index = settings.activeTab - 1,
                    tabs_history = [],
                    lastEl, prevEl;

                if(!$(settings.tabsContent).hasClass('active')){
                    $(settings.tabsContent).removeClass('active').hide();
                }

                tabs.on('click', function (e) {
                    e.preventDefault();
                    var $this_tabs = $(this),
                        href = $this_tabs.attr('href').split('#')[1];
                    tabs_history.push(href);
                    lastEl = tabs_history[tabs_history.length - 1];
                    prevEl = tabs_history[tabs_history.length - 2];
                    if (!$this_tabs.hasClass('active')) {
                        $this.removeClass("active-" + prevEl);
                        $this.addClass("active-" + href);
                        tabs.removeClass('active');
                        $this_tabs.addClass('active');
                        $(settings.tabsContent).removeClass('active').hide();
                        $('#' + href).stop().fadeIn(settings.animationSpeed).addClass('active');
                    }else {
                        $('#' + href).show().addClass('active');
                    }

                    if (settings.onClick) {
                        settings.onClick();
                    }

                    if(settings.scrollToContent){
                        _scrollToContent(href, settings.scrollSpeed)
                    }

                });
                _setTabsIndex(settings, tabs);
                _triggerOnClick(tabs, index);

            });
        },

        destroy: function () {
            return this.each(function () {
                var $this = $(this);
            })
        }

    };

    $.fn.widgetTabs = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.widgetTabs');
        }
    };
})(jQuery);
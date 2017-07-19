/**
 * Created by erdiertas on 4.04.2017.
 */
var game = {
    data: {},
    selectCategory: null,
    hangmanList: [],
    allowCharSelect: true,
    alpha: function () {
        return Array.from("QWERTYUIOPĞÜASDFGHJKLŞİZXCVBNMÖÇ");
    },
    getAlpha: function (max) {
        var a = this.alpha();
        var selectAlpha = [];
        for (var i = 0; i < max; i++) {
            var index = this.getRandomInt(0, a.length - 1);
            selectAlpha.push(a[index]);
            a.splice($.inArray(a[index], a), 1);
        }
        return selectAlpha;
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clone: function (d) {
        return JSON.parse(JSON.stringify(d));
    },
    openPage: function (page) {
        this.template.hideIcons();
        if (page === 'category') {
            if ($(".select-category .scroll-area .item").length === 0) {
                $.each(this.data, function (i, v) {
                    $(".select-category .scroll-area").append('<div class="item" data-go="play" data-category="' + i + '">' + i + '</a>');
                });
            }
            initCustomScrollbar();
        } else if (page === 'play') {
            this.allowCharSelect = true;
            var s = this.selectCategory;
            var keys = this.data[s];
            var c = $.cookie('game');
            if (c === undefined) {
                c = {}
                c[s] = 0;
            }
            if (c[s] === undefined) {
                c[s] = 0;
            }
            var l = c[s];
            if (keys[l] === undefined) {
                c[s] = 0;
                $.cookie('game', c);
                this.openPage('play');
                return false;
            }
            $.cookie('game', c);
            this.hangmanList = ["right-leg", "left-leg", "right-hand", "left-hand", "body", "head"];
            var k = Array.from(keys[l]);
            var u_k = $.unique(this.clone(k));
            var al = this.getAlpha(k.length + 6);
            var f_k = this.clone(u_k);
            var n_al = [];
            var e_l = $(" .letters");
            var e_sL = $(".select-letters");
            this.template.hideIcons();
            $(".level span").text(l + 1);
            $.each(u_k, function (i, v) {
                if (jQuery.inArray(v, al) !== -1) {
                    f_k.splice(jQuery.inArray(v, f_k), 1);
                }
            });
            $.each(al, function (i, v) {
                if (jQuery.inArray(v, u_k) === -1) {
                    if (f_k.length > 0) {
                        al[i] = f_k[0];
                        f_k.splice(0, 1);
                    }
                }
            });
            var c_al = this.clone(al.length);
            for (var i = 0; i < c_al; i++) {
                var index = this.getRandomInt(0, al.length - 1);
                n_al[i] = al[index];
                //console.log(al[index], i)
                al.splice(index, 1);
            }
            e_l.html('');
            $.each(k, function (i, v) {
                e_l.append('<div data-value="' + v + '">' + v + '</div>')
            });
            e_sL.html('');
            $.each(n_al, function (i, v) {
                e_sL.append('<div data-value="' + v + '">' + v + '</div>')
            });
            $(".letters, .select-letters").delay(500).fadeIn(400);
            $($(".personality > div").get(l % 3)).slideDown(500);
            $($(".backgrounds > div").get(l % 3)).slideDown(700);
        }
        // game.resize();
    },
    selectChar: function (c) {
        if (this.allowCharSelect) {
            this.allowCharSelect = false;
            var e = $(".letters").find("div[data-value='" + c + "']");
            if (e.length > 0) {
                e.addClass('open');
                if ($(".letters div:not(.open)").length === 0) {
                    $("#ok").slideDown(500);
                    setTimeout(function () {
                        var s = game.selectCategory;
                        var c = $.cookie('game');
                        c[s] = c[s] + 1;
                        $.cookie('game', c);
                        game.openPage('play');
                    }, 2000)
                } else {
                    this.template.showTrue();
                    this.allowCharSelect = true;
                }
            } else {
                var h = this.hangmanList[0];
                if (h !== undefined) {
                    this.hangmanList.splice(0, 1);
                    $("." + h).fadeOut();
                    this.template.showFalse();
                    if (this.hangmanList.length == 0) {
                        $("#cross").fadeIn(500);
                    } else {
                        game.allowCharSelect = true;
                    }
                }
            }
        }
    },
    load: function () {
        $.cookie.json = true;
        $.getJSON("game-data.json", function (data) {
            game.data = data;
        });
    },
    template: {
        showFalse: function () {
            $("#false-shadow").fadeIn(100).delay(100).fadeOut(50).delay(50).fadeIn(30).fadeOut(300)
        },
        showTrue: function () {
            $("#true-shadow").fadeIn(100).delay(100).fadeOut(300)
        },
        hideIcons: function () {
            $("#cross, #ok").slideUp();
            $(".personality svg g").show();
            $(".letters, .select-letters, .personality > div, .backgrounds > div").stop(true, true).slideUp(700);
        },
        resize: function () {
            $(".personality > div").each(function () {
                var t = $(this);
                var svg = t.find("svg");
                t.css("height", $(window).height())
                svg.css("height", $(window).height())
            });
        },
        goPage: function (page) {
            $("#container > div.active").removeClass('active');
            $("#page-" + page).addClass('active');
            game.openPage(page);
        },
    }
};


$(window).resize(function () {
    game.template.resize();
});

$(document).ready(function () {
    game.load();
    game.template.resize();
});

$(document).on("click", "[data-go]", function () {
    var t = $(this);
    var p = t.attr("data-go");
    if (t.data("category") !== undefined) {
        game.selectCategory = t.data("category");

    }
    game.template.goPage(p);
});


$(document).on("click", ".select-letters div:not(.click)", function () {
    if (game.allowCharSelect) {
        game.selectChar($(this).text());
        $(this).addClass('click').text('X');
    }
});


var _initCustomScrollbar = $("#select-category-list");
var initCustomScrollbarFirst = true;
function initCustomScrollbar() {
    if (!initCustomScrollbarFirst) {
        _initCustomScrollbar.mCustomScrollbar('destroy');
    }
    initCustomScrollbarFirst = false;
    _initCustomScrollbar.mCustomScrollbar({theme: "rounded"});
}


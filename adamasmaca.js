/**
 * Created by erdiertas on 4.04.2017.
 */
var erdiAdamAsmaca = {
        data: {},
        selectCategory: null,
        alpha: function () {
            return Array.from("QWERTYUIOPĞÜASDFGHJKLŞİZXCVBNMÖÇ");
        },
        getAlpha: function () {
            var a = this.alpha();
            var selectAlpha = [];
            for (var i = 0; i <= 10; i++) {
                var index = this.getRandomInt(0, a.length);
                if (a[index] !== undefined) {
                    selectAlpha.push(a[index]);
                    a.splice($.inArray(a[index], a), 1);
                } else {
                    i--;
                }
            }
            return selectAlpha;
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        e_gameArea: function () {
            return $("#erdi-adamasmaca .game-area");
        },
        e_backgroundImage: function () {
            return $("#erdi-adamasmaca .background-image");
        },
        resize: function () {
            this.e_backgroundImage().css("height", this.get_gameAreaHeight()).css("bottom", this.get_gameAreaHeight());
        },
        get_gameAreaHeight: function () {
            return this.e_gameArea().height();
        },
        clone: function (d) {
            return JSON.parse(JSON.stringify(d));
        },
        openPage: function (page) {
            this.closeAllPage();
            $("#erdi-adamasmaca .game-area ." + page + "-page").show();
            if (page == 'category') {
                $("#erdi-adamasmaca .category-page .list").html("");
                $.each(this.data, function (i, v) {
                    $("#erdi-adamasmaca .category-page .list").append('<a class="item">' + i + '</a>');
                })
            } else if (page == 'play') {
                var al = this.getAlpha();
                var s = this.selectCategory;
                var keys = this.data[s];
                var c = $.cookie('erdiAdamAsmaca');
                if (c === undefined) {
                    c = {}
                    c[s] = 0;
                }
                if (c[s] === undefined) {
                    c[s] = 0;
                }
                $.cookie('erdiAdamAsmaca', c);
                var l = c[s];
                var k = Array.from(keys[l]);
                var u_k = $.unique(this.clone(k));
                var f_k = this.clone(u_k);
                var n_al = [];
                var e_l = $("#erdi-adamasmaca .play-page .letters");
                var e_sL = $("#erdi-adamasmaca .play-page .select-letters");
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
                for (var i = 0; i < al.length; i++) {
                    var index = this.getRandomInt(0, al.length);
                    n_al[i] = f_k[index];
                    f_k.splice(index, 1);
                }
                e_l.html('');
                $.each(k, function (i, v) {
                    e_l.append('<div data-value="' + v + '">' + v + '</div>')
                });
                e_sL.html('');
                $.each(al, function (i, v) {
                    e_sL.append('<div data-value="' + v + '">' + v + '</div>')
                });
                console.log(al)
                console.log(k)
                console.log(u_k)
                console.log(f_k)
            }
            erdiAdamAsmaca.resize();
        },
        closeAllPage: function () {
            $("#erdi-adamasmaca .game-area > div:visible").hide();
        },
        selectChar: function (c) {
            $("#erdi-adamasmaca .play-page .letters").find("div[data-value='" + c + "']").addClass('open');
        },
        load: function () {
            $.cookie.json = true;
            $.getJSON("game-data.json", function (data) {
                erdiAdamAsmaca.data = data;
            });
        }
    };



$(window).resize(function () {
    erdiAdamAsmaca.resize();
});

$(document).ready(function () {
    erdiAdamAsmaca.load();
    erdiAdamAsmaca.resize();
});

$("#erdi-adamasmaca .start-page .play").click(function () {
    erdiAdamAsmaca.openPage('category');
});

$(document).on("click", ".list .item", function () {
    erdiAdamAsmaca.selectCategory = $(this).text();
    erdiAdamAsmaca.openPage('play');
});


$(document).on("click", "#erdi-adamasmaca .play-page .select-letters div:not(.click)", function () {
    erdiAdamAsmaca.selectChar($(this).text());
    $(this).addClass('click');
});


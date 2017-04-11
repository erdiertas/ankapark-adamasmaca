/**
 * Created by erdiertas on 4.04.2017.
 */
var erdiAdamAsmaca = {
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
            this.allowCharSelect = true;
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
            var l = c[s];
            if (keys[l] === undefined) {
                c[s] = 0;
                $.cookie('erdiAdamAsmaca', c);
                this.openPage('play');
                return false;
            }
            $.cookie('erdiAdamAsmaca', c);
            this.hangmanList = ["right-leg", "left-leg", "right-hand", "left-hand", "body", "head"];
            var k = Array.from(keys[l]);
            var u_k = $.unique(this.clone(k));
            var al = this.getAlpha(k.length + 6);
            var f_k = this.clone(u_k);
            var n_al = [];
            var e_l = $("#erdi-adamasmaca .play-page .letters");
            var e_sL = $("#erdi-adamasmaca .play-page .select-letters");
            $("#erdi-adamasmaca .cross, #erdi-adamasmaca .ok").css("display","none");
            $("#erdi-adamasmaca .play-page .head").css({
                top: '28px',
                left: '109px'
            });
            $("#erdi-adamasmaca .play-page .body").css({
                top: '123px',
                left: '90px'
            });
            $("#erdi-adamasmaca .play-page .left-hand").css({
                top: '88px',
                left: '38px'
            });
            $("#erdi-adamasmaca .play-page .right-hand").css({
                top: '71px',
                left: '201px'
            });
            $("#erdi-adamasmaca .play-page .left-leg").css({
                top: '197px',
                left: '99px'
            });
            $("#erdi-adamasmaca .play-page .right-leg").css({
                top: '193px',
                left: '165px'
            });
            $("#erdi-adamasmaca .level span").text(l+1);
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
                console.log(al[index], i)
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
        }
        erdiAdamAsmaca.resize();
    },
    closeAllPage: function () {
        $("#erdi-adamasmaca .game-area > div:visible").hide();
    },
    selectChar: function (c) {
        if (this.allowCharSelect) {
            this.allowCharSelect = false;
            var e = $("#erdi-adamasmaca .play-page .letters").find("div[data-value='" + c + "']");
            if (e.length > 0) {
                e.addClass('open');
                if ($(".letters div:not(.open)").length === 0) {
                    $("#erdi-adamasmaca .ok").fadeIn(500);
                    setTimeout(function () {
                        var s = erdiAdamAsmaca.selectCategory;
                        var c = $.cookie('erdiAdamAsmaca');
                        c[s] = c[s]+1;
                        $.cookie('erdiAdamAsmaca', c);
                        erdiAdamAsmaca.openPage('play');
                    },2000)
                }else{
                    this.allowCharSelect = true;
                }
            } else {
                var h = this.hangmanList[0];
                if (h !== undefined) {
                    this.hangmanList.splice(0, 1);
                    var o = $("." + h).offset();
                    var f_l = o.left;
                    var f_t = (500 - o.top - 95) * -1;
                    $(".finger").css("left", f_l).css("top", f_t);
                    setTimeout(function () {
                        $(".finger").css("top", -800);
                        $("." + h).css("top", -800);
                    }, 1000);
                    if (this.hangmanList.length == 0) {
                        $("#erdi-adamasmaca .cross").fadeIn(500);
                    }else{
                        setTimeout(function () {
                            erdiAdamAsmaca.allowCharSelect = true;
                        }, 1300);
                    }
                }
            }
        }
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
    if (erdiAdamAsmaca.allowCharSelect) {
        erdiAdamAsmaca.selectChar($(this).text());
        $(this).addClass('click');
    }
});


$(document).on("click", "#erdi-adamasmaca .play-page .home", function () {
    erdiAdamAsmaca.selectCategory = $(this).text();
    erdiAdamAsmaca.openPage('start');
});

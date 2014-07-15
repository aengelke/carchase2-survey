jQuery(function() {
    var texts = {
        intro0: "<p>Diese Umfrage wird ca. 1,5 Minuten Zeit in Anspruch nehmen.</p>",
        intro1: "<p>Im folgenden werden Sie vier Videos mit Audiokommentar " +
                "sehen. Das Video (eine Autoverfolgung) sowie der Kommentar " +
                "sind getrennt automatisch erzeugt worden. Das heißt, dass " +
                "das System, das den Audiokommentar erzeugt, auch nur das Bild " +
                "\"sieht\" und nicht vorher weiß, was passieren wird.</p>",
        intro2: "<p>Die Kommentare sind von unterschiedlichen Systemen erzeugt " +
                "worden. Uns interessiert, wie diese unterschiedlichen " +
                "Systeme auf Sie wirken. Sie werden vier Szenen mit " +
                "Kommentar gezeigt bekommen, und sollen dann spontan sagen, ob " +
                "Ihnen der Kommentar gefallen hat. Gehen Sie dabei nach Ihrem " +
                "ersten Eindruck, und bem&uuml;hen Sie sich nicht, im Einzelnen " +
                "Unterschiede zu finden.</p>"
    };
    for (var text in texts) texts[text] = texts[text].replace(/ß/g, "&szlig;");
    var nElementsOf = function(array, count) {
        var newArray = [];
        for (var i = 0; i < count; i++) {
            var index = Math.floor(array.length * Math.random());
            newArray.push(array[index]);
            array.splice(index, 1);
        }
        return newArray;
    };
    var Survey = function() {
        var self = this;
        if (window.localStorage) {
            if (window.localStorage.getItem("participated")) {
                this.participated = true;
            }
        }
        $("#container").html("<div class='intro'></div>");
        $("#container .intro").hide()
            .html("<h1>Umfrage</h1>")
            .append(texts.intro0)
            .append(texts.intro1)
            .append(texts.intro2);
        $("#container .intro").append("<p class='border margin'>E-Mail Adresse (nur bei Interesse an Ergebnissen):</p>")
            .append("<div class='input'><input type='text' id='email' /></div>")
            .append("<p class='border margin'></p>")
            .append("<div id='startbutton' class='button startbutton' style='display:none;'>Jetzt Teilnehmen</div>");
        $("#container .intro").fadeIn(500);
        if (!this.participated) {
            $("#container #startbutton").delay(500)
                    .width(0)
                    .height(0)
                    .css("background", "#777")
                    .css("color", "#777")
                    .show()
                    .animate({width: 240}, 3000, function() {
                $(this).animate({height: 22}, 500, function() {
                    $(this).animate({backgroundColor: "#00a5eb", color: "#fff"}, 700)
                            .on("click", function() {
                        self.start();
                    });
                });
            });
        } else {
            $("#container #startbutton").delay(500).fadeIn(500).on("click", function() {
                self.start();
            });
        }
    };
    Survey.prototype.start = function() {
        $(".intro").hide();
        this.videos = nElementsOf([0,1,2,5,6,7], 4);
        this.email = $("#email").val();
        this.data = [];
        if (window.localStorage) {
            window.localStorage.setItem("participated", "true");
        }
        this.shown = 0;
        this.showNextVideo();
    };
    Survey.prototype.showNextVideo = function() {
        if (this.shown >= this.videos.length) {
            this.sendAndThank();
            return;
        }
        var self = this;
        var video = this.videos[this.shown];
        $("#container").html("<div class='video'><div class='title'></div></div>");
        $(".video").append("<video id='video' width='700' height='525'>" +
                           "<source src='videos/video" + video + ".webm' type='video/webm'>" +
                           "<source src='videos/video" + video + ".mp4' type='video/mp4'>" +
                           "</video>");
        var htmlVideo = document.getElementById("video");
        htmlVideo.play();
        htmlVideo.addEventListener('ended', function() {
            self.showQuestionUI();
        });
        this.shown++;
    };
    Survey.prototype.showQuestionUI = function() {
        var self = this;
        $("video").fadeOut(500, function() {
            $(".video").html("<table><tr></tr></table>")
                       .prepend("<div class='question'>Welchen Eindruck hat dieser " +
                                "Kommentar bei Ihnen hinterlassen?</div>");
            $("tr").hide().append("<td><div data-value='#' class='button like'>Positiv</div>")
                          .append("<td><div data-value='+' class='button semilike'>Eher positiv</div>")
                          .append("<td><div data-value='-' class='button semidislike'>Eher negativ</div>")
                          .append("<td><div data-value='=' class='button dislike'>Negativ</div>")
                          .fadeIn(500);
            $(".video .button").on("click", function() {
                self.data.push($(this).attr("data-value"));
                self.showNextVideo();
            });
        });
    };
    Survey.prototype.sendAndThank = function() {
        $.post("data/store.php", {videos: this.videos.join(""), data: this.data.join(""), email: this.email});
        $("#container").html("<div class='center margin'><h1>Vielen Dank!</h1></div><div class='center margin border'>Die Daten wurden gespeichert.</div>");
        if (window.localStorage) {
            window.localStorage.setItem("participated", "true");
        }
    };
    (function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true;}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")";};});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f;}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])];}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)];}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)];}}function c(g,e){var f;do{f=d.css(g,e);if(f!==""&&f!="transparent"||d.nodeName(g,"body")){break;}e="backgroundColor";}while(g=g.parentNode);return b(f);}})(jQuery);
    new Survey();
});

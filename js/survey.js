jQuery(function() {
    var texts = {
        intro1: "<p>Im folgenden werden Sie einige Videos mit Audiokommentar " +
                "sehen. Das Video (eine Autoverfolgung) sowie der Kommentar " +
                "sind getrennt automatisch erzeugt worden. Das heißt, dass " +
                "das System, das den Audiokommentar erzeugt, auch nur das Bild " +
                "\"sieht\" und nicht vorher weiß, was passieren wird.</p>",
        intro2: "<p>Die Kommentare sind von unterschiedlichen Systemen erzeugt " +
                "worden. Uns interessiert, wie diese unterschiedlichen " +
                "Systeme auf Sie wirken. Sie werden einzelne Szenen mit " +
                "Kommentar gezeigt bekommen, und sollen dann spontan sagen, ob " +
                "Ihnen der Kommentar gefallen hat. Gehen Sie dabei nach Ihrem " +
                "ersten Eindruck, und bem&uuml;hen Sie sich nicht, im Einzelnen " +
                "Unterschiede zu finden.</p>"
    };
    for (var text in texts) texts[text] = texts[text].replace(/ß/g, "&szlig;");
    var nElementsOf = function(array, count) {
        var newArray = [];
        for (var i = 0; i < count; i++) {
            var index = Math.floor(Math.random(8));
            newArray.push(array[index]);
            array = array.splice(index, 1);
        }
        return newArray;
    };
    var Survey = function() {
        var self = this;
        $("#container").html("<div class='intro'></div>");
        $("#container .intro").hide()
            .html("<h1>Umfrage</h1>")
            .append(texts.intro1)
            .append(texts.intro2)
            .append("<p class='border margin'>E-Mail Adresse (nur bei Interesse an Ergebnissen):</p>")
            .append("<div class='input'><input type='text' id='email' /></div>")
            .append("<p class='border margin'></p>")
            .append("<div id='startbutton' class='button startbutton'>Jetzt Teilnehmen</div>")
            .fadeIn(500);
        $("#container #startbutton").on("click", function() {
            self.start();
        });
    };
    Survey.prototype.start = function() {
        $(".intro").hide();
        this.videos = nElementsOf([0], 1);
        //this.videos = nElementsOf([0,1,2,3,4,5,6,7], 4);
        this.email = $("#email").val();
        this.data = [];
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
        $(".video").append("<video id='video' width='500' height='375'>" +
                           "<source src='videos/video" + video + ".webm' type='video/webm'>" +
                           "<source src='videos/video" + video + ".mp4' type='video/mp4'>" +
                           "</video>");
        var htmlVideo = document.getElementById("video");
        htmlVideo.play();
        htmlVideo.onended = function() {
            self.showQuestionUI();
        }
        this.shown++;
    }
    Survey.prototype.showQuestionUI = function() {
        var self = this;
        $("video").fadeOut(500, function() {
            $(".video").html("<table><tr></tr></table>")
                       .prepend("<div class='question'>Welchen Eindruck hat dieses " +
                                "Video bei Ihnen hinterlassen?</div>");
            $("tr").hide().append("<td><div data-value='3' class='button like'>Positiv</div>")
                          .append("<td><div data-value='2' class='button semilike'>Negativ</div>")
                          .append("<td><div data-value='1' class='button semidislike'>Negativ</div>")
                          .append("<td><div data-value='0' class='button dislike'>Negativ</div>")
                          .fadeIn(500);
            $(".video .button").on("click", function() {
                self.data.push(parseInt($(this).attr("data-value")));
                self.showNextVideo();
            })
        })
    }
    Survey.prototype.sendAndThank = function() {
        $.post("data/store.php", {data: this.data.join(""), email: this.email});
        $("#container").html("Thank you! Your data will be saved.");
    }
    new Survey();
    // Do stuff here.
});

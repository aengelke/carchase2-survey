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
    var Survey = function() {
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
        $("#container #startbutton").on("click", this.start);
    };
    Survey.prototype.start = function() {
    };
    new Survey();
    // Do stuff here.
});

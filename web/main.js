/*eslint-disable */
'use strict';

(function($) {
    $.ajax('http://localhost:8080/restaurants')
    .done(function(data) {
        populateData(data);
    });
    // error handling omitted purposefully

    // watch for changes to the form selects and update the page accordingly
    $('select').change(function() {
        var str = "";
        var request = {};
        $("select").each(function() {
            if ($(this).val()) {
                var name = $(this).attr('id');
                request[name] = $(this).val();
            }
        });
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/restaurants',
            data: request
        })
        .done(function(data) {
            $('#result-box').empty();
            populateData(data);
        });
    });

    function populateData(data) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
            addListingToPage(data[i]);
        }
    }

    function addListingToPage(data) {
        var insertNode = '<div class="text-center bpush-40 bordered tpad-10 rpad-10 lpad-10 bpad-20">'
            + '<p class="bold">' + data.name + '</p><p>'
            + data.address
            + '</p></div>';
        var insertHTML = $.parseHTML(insertNode);
        $('#result-box').append(insertHTML);
    }
})(jQuery);
/* eslint-enable */

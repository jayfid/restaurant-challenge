/*eslint-disable */
'use strict';

(function($) {
    var endpoint = 'http://localhost:8080/search';

    function updateData() {
        var append_params = [];
        $("select").each(function() {
            if ($(this).val()) {
                append_params.push($(this).attr('id') + '=' + encodeURIComponent($(this).val()));
            }
        });
        var search_url = endpoint;
        if (append_params.length) {
            var search_url = search_url + '?' + append_params.join('&');
        }

        $.ajax(search_url)
        .done(function(data) {
            $('#result-box').empty();
            populateData(data);
        });
    }
    // error handling omitted purposefully

    // watch for changes to the form selects and update the page accordingly
    $('select').change(function() {
        updateData();
    });

    $(document).ready( () => {
        updateData();
    });

    function populateData(data) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
            addListingToPage(data[i]);
        }
    }

    function addListingToPage(data) {
        var grades = {
                1 : 'A',
                2:  'B',
                3:  'c',
                10: 'Z',
                15: 'P',
                20: "Not Yet Graded"
        };
        var grade = grades.hasOwnProperty(data.grade) ? grades[data.grade] : 'N/A';
        var insertNode = '<div class="text-center bpush-40 bordered tpad-10 rpad-10 lpad-10 bpad-20">'
            + '<p class="bold">' + data.name + '</p><p>'
            + '<p class="tpad-20 bpad-20 uppercase">' + data.type + '</p>'
            + '<p class="bpush-20">' + data.address + '<br />' + data.boro + " " + ", NY " + data.postal_code + '</p>'
            + '<p>Phone: ' + data.phone + '</p>'
            + '<p>Grade: ' + grade + '</p>'
            + '</div>';

        var insertHTML = $.parseHTML(insertNode);
        $('#result-box').append(insertHTML);
    }
})(jQuery);
/* eslint-enable */

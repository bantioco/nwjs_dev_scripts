$(document).ready(function(){

    load_data_details();
    load_data_list();

    // BT add data
    $('body').on('click', '.bt-add-data', function(e){

        e.stopPropagation();

        $('.js-load-add-data').show(500);

        load_add_data();

        $(this).css({
            '-webkit-transform':'rotate(45deg)',
            '-ms-transform':'rotate(45deg)',
            'transform':'rotate(45deg)',
            'color':'#c0392b',
            '-webkit-transition':'transform 0.5s, color 1s',
            'transition':'transform 0.5s, color 1s'
        }).addClass('bt-add-data-close').removeClass('bt-add-data');

        $('body').on('click', '.bt-add-data-close', function(e){

            $('#add_data_bloc').remove();
            $('.js-load-add-data').hide(500);

            $(this).css({
                '-webkit-transform':'rotate(0deg)',
                '-ms-transform':'rotate(0deg)',
                'transform':'rotate(0deg)',
                'color':'#2c3e50',
                '-webkit-transition':'transform 0.5s, color 1s',
                'transition':'transform 0.5s, color 1s'
            }).removeClass('bt-add-data-close').addClass('bt-add-data');
        });
    });

    function load_data_list(){
        $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
    }

    // Load data page
    function load_data_details(){
        $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); });
    }

    // Load add_data page
    function load_add_data(){
        $.post('./load/load_add_data.html', function( dataadd ){ $('.js-load-add-data').html( dataadd ); });
    }

});

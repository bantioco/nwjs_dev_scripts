$(document).ready(function(){

    var fs          = require('fs');
    var date_now    = getDate("y-m-d H:M:S");
    var shell_exec = require('shell_exec').shell_exec;

    load_data_details();
    load_data_list();

    // Date
    function getDate(format) {
        var gDate       = new Date();
        var mDate       = {
            'S': gDate.getSeconds(),
            'M': gDate.getMinutes(),
            'H': gDate.getHours(),
            'd': gDate.getDate(),
            'm': gDate.getMonth() + 1,
            'y': gDate.getFullYear(),
        }
        return format.replace(/([SMHdmy])/g, function(key){return (mDate[key] < 10 ? '0' : '') + mDate[key];});
        return getDate(str);
    };

    // search data
    $('#data_search').on('keypress', function(e){

        var data_search = $(this).val();

        if(data_search.length == 1){
            $.post('./load/load_search_result.html', function( dataresult ){ $('.js-load-data-list').html( dataresult ); });
            $('.js-load-page').html("");
        }
        if( data_search.length >= 3 ){

            var results = [];
            $.getJSON( 'data/data_scripts.json',function( getdata ){

                $.each( getdata.data, function( key, val ) {
                    var valtext = val.text;
                    var valtitle = val.title;

                    if (valtext.indexOf( data_search ) >= 0 || valtitle.indexOf( data_search ) >= 0 ){

                        for( var i=0; i<results.length; i++){
                            console.log(results[i])
                        }

                        var bloc_list =
                            "<div id='searchbloclist_" + key + "' class='bloc-list'>"+
                                "<div class='bloc-list-icon'><i class='devicon-" +val.category+ "-plain colored'></i></div>"+
                                "<div class='bloc-list-text'>"+
                                    "<div class='bloc-list-title'>" + val.title + "</div>"+
                                    "<div class='bloc-list-category'>" + val.category + "</div>"+
                                "</div>"+
                            "</div>";

                        var i = results.indexOf(bloc_list);
                        if(i != -1) { results.splice(i, 1); }

                        setTimeout(function(){ results.push( bloc_list ); },500);

                    }
                });


            });
        }
        else if(data_search.length <= 1){
            $.post('./load/load_search_result.html', function( dataresult ){ $('.js-load-data-list').html( dataresult ); });
        }

        setTimeout(function(){ $('.append-data').html( results ); },2000);
    });
    $('body').on('keydown', '#data_search', function(e){

        var data_search = $(this).val();
        if( data_search.length === 0 ){

            load_data_list();
            setTimeout(function(){
                $('.js-load-page').html("");
            },500)
        }
    });
    // Bloc list nav
    $('body').on('click', '.bloc-list', function(){
        $('.bloc-list').removeClass('selected-list');
        $('.selected-list-view').remove();
        $(this).addClass('selected-list');
        $(this).append('<div class="selected-list-view"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></div>');

        $.post('./load/load_data.html', function( datadetail ){
            $('.js-load-page').html("");
            $('.js-load-page').html( datadetail );
        });
    });
    // Load data list
    function load_data_list(){ $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); }); }
    // Load data page
    function load_data_details(){ $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); }); }

    // BT add data
    $('body').on('click', '.bt-add-data', function(e){
        e.stopPropagation();

        load_add_data();

        // Remove nav list selected
        $('.bloc-list').removeClass('selected-list');
        $('.selected-list-view').remove();

        // Button add data effect
        $(this).css({
            '-webkit-transform':'rotate(45deg)',
            '-ms-transform':'rotate(45deg)',
            'transform':'rotate(45deg)',
            'color':'#c0392b',
            '-webkit-transition':'transform 0.5s, color 1s',
            'transition':'transform 0.5s, color 1s'
        }).addClass('bt-add-data-close').removeClass('bt-add-data');
        // Button add data close
        $('body').on('click', '.bt-add-data-close', function(e){
            $('#add_data_bloc').remove();
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
    // Load add_data page
    function load_add_data(){ $.post('./load/load_add_data.html', function( dataadd ){ $('.js-load-page').html( dataadd ); }); }

    // Parameters
    $('.js-bt-parameters').on('click', function(){

        load_parameters();

        $('#add_data_bloc').remove();

        $('.bt-add-data-close').css({
            '-webkit-transform':'rotate(0deg)',
            '-ms-transform':'rotate(0deg)',
            'transform':'rotate(0deg)',
            'color':'#2c3e50',
            '-webkit-transition':'transform 0.5s, color 1s',
            'transition':'transform 0.5s, color 1s'
        }).removeClass('bt-add-data-close').addClass('bt-add-data');
    });
    // Load parameters page
    function load_parameters(){ $.post('./load/load_parameters.html', function( dataparameters ){ $('.js-load-page').html( dataparameters ); }); }


    // Data list nav
    window.load_data_list_js = function(){
        //var fs = require('fs');
        fs.open('data/data_scripts.json', 'r+', function(err, fd) {
            if( err || fd == undefined ){
                console.log(" No data");
            }
            else{
                $.getJSON( 'data/data_scripts.json',function( getdata ){
                    $.each( getdata.data, function( key, val ) {
                        var bloc_list =
                            "<div id='bloclist_" + key + "' class='bloc-list'>"+
                                "<div class='bloc-list-icon'><i class='devicon-" +val.category+ "-plain colored'></i></div>"+
                                "<div class='bloc-list-text'>"+
                                    "<div class='bloc-list-title'>" + val.title + "</div>"+
                                    "<div class='bloc-list-category'>" + val.category + "</div>"+
                                "</div>"+
                            "</div>";
                        $('.append-data').prepend( bloc_list );
                    });
                });
            }
        });
    }
    // Add data
    window.load_add_data_js = function(){
        $.post('./load/load_category_select.html', function( datacategory ){ $('.load-category').html( datacategory ); });

        tinymce.remove('textarea')
        tinymce.init({
            selector: '#add_data_text',
            height: 350,
            theme: 'modern',
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
            ],
            codesample_languages: [
                {text:'HTML/XML',value:'markup'},
                {text:"XML",value:"xml"},
                {text:"HTML",value:"html"},
                {text:"mathml",value:"mathml"},
                {text:"SVG",value:"svg"},
                {text:"CSS",value:"css"},
                {text:"Clike",value:"clike"},
                {text:"Javascript",value:"javascript"},
                {text:"ActionScript",value:"actionscript"},
                {text:"apacheconf",value:"apacheconf"},
                {text:"apl",value:"apl"},
                {text:"applescript",value:"applescript"},
                {text:"asciidoc",value:"asciidoc"},
                {text:"aspnet",value:"aspnet"},
                {text:"autoit",value:"autoit"},
                {text:"autohotkey",value:"autohotkey"},
                {text:"bash",value:"bash"},
                {text:"basic",value:"basic"},
                {text:"batch",value:"batch"},
                {text:"c",value:"c"},
                {text:"brainfuck",value:"brainfuck"},
                {text:"bro",value:"bro"},
                {text:"bison",value:"bison"},
                {text:"C#",value:"csharp"},
                {text:"C++",value:"cpp"},
                {text:"CoffeeScript",value:"coffeescript"},
                {text:"ruby",value:"ruby"},
                {text:"d",value:"d"},
                {text:"dart",value:"dart"},
                {text:"diff",value:"diff"},
                {text:"docker",value:"docker"},
                {text:"eiffel",value:"eiffel"},
                {text:"elixir",value:"elixir"},
                {text:"erlang",value:"erlang"},
                {text:"fsharp",value:"fsharp"},
                {text:"fortran",value:"fortran"},
                {text:"git",value:"git"},
                {text:"glsl",value:"glsl"},
                {text:"go",value:"go"},
                {text:"groovy",value:"groovy"},
                {text:"haml",value:"haml"},
                {text:"handlebars",value:"handlebars"},
                {text:"haskell",value:"haskell"},
                {text:"haxe",value:"haxe"},
                {text:"http",value:"http"},
                {text:"icon",value:"icon"},
                {text:"inform7",value:"inform7"},
                {text:"ini",value:"ini"},
                {text:"j",value:"j"},
                {text:"jade",value:"jade"},
                {text:"java",value:"java"},
                {text:"JSON",value:"json"},
                {text:"jsonp",value:"jsonp"},
                {text:"julia",value:"julia"},
                {text:"keyman",value:"keyman"},
                {text:"kotlin",value:"kotlin"},
                {text:"latex",value:"latex"},
                {text:"less",value:"less"},
                {text:"lolcode",value:"lolcode"},
                {text:"lua",value:"lua"},
                {text:"makefile",value:"makefile"},
                {text:"markdown",value:"markdown"},
                {text:"matlab",value:"matlab"},
                {text:"mel",value:"mel"},
                {text:"mizar",value:"mizar"},
                {text:"monkey",value:"monkey"},
                {text:"nasm",value:"nasm"},
                {text:"nginx",value:"nginx"},
                {text:"nim",value:"nim"},
                {text:"nix",value:"nix"},
                {text:"nsis",value:"nsis"},
                {text:"objectivec",value:"objectivec"},
                {text:"ocaml",value:"ocaml"},
                {text:"oz",value:"oz"},
                {text:"parigp",value:"parigp"},
                {text:"parser",value:"parser"},
                {text:"pascal",value:"pascal"},
                {text:"perl",value:"perl"},
                {text:"PHP",value:"php"},
                {text:"processing",value:"processing"},
                {text:"prolog",value:"prolog"},
                {text:"protobuf",value:"protobuf"},
                {text:"puppet",value:"puppet"},
                {text:"pure",value:"pure"},
                {text:"python",value:"python"},
                {text:"q",value:"q"},
                {text:"qore",value:"qore"},
                {text:"r",value:"r"},
                {text:"jsx",value:"jsx"},
                {text:"rest",value:"rest"},
                {text:"rip",value:"rip"},
                {text:"roboconf",value:"roboconf"},
                {text:"crystal",value:"crystal"},
                {text:"rust",value:"rust"},
                {text:"sas",value:"sas"},
                {text:"sass",value:"sass"},
                {text:"scss",value:"scss"},
                {text:"scala",value:"scala"},
                {text:"scheme",value:"scheme"},
                {text:"smalltalk",value:"smalltalk"},
                {text:"smarty",value:"smarty"},
                {text:"SQL",value:"sql"},
                {text:"stylus",value:"stylus"},
                {text:"swift",value:"swift"},
                {text:"tcl",value:"tcl"},
                {text:"textile",value:"textile"},
                {text:"twig",value:"twig"},
                {text:"TypeScript",value:"typescript"},
                {text:"verilog",value:"verilog"},
                {text:"vhdl",value:"vhdl"},
                {text:"wiki",value:"wiki"},
                {text:"YAML",value:"yaml"}
            ],
            toolbar1: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | link | preview | forecolor backcolor emoticons | codesample',
            toolbar2: '',
            image_advtab: true
        });

        setTimeout(function(){

            $('form#add_data').on('submit', function( e ){
                e.preventDefault();
                //var form_post = new FormData( $(this)[0] );

                // Get data form
                var data_title      = $('#add_data_title').val();
                var data_category   = $('#add_data_category').val();
                var data_text       = $('#add_data_text').val();
                var date_insert      = date_now;


                // Controle lenght post data_title
                if( data_title.length >= 1 ){
                    // Controle lenght post data_category
                    if( data_category.length >= 1 ){
                        // Controle lenght post data_text
                        if( data_text.length >= 1){
                            fs.open('data/data_scripts.json', 'r+', function(err, fd){
                                if( err || fd == undefined ){ create_file( data_title, data_category, data_text, date_insert ); }
                                else{ add_data_in_file( data_title, data_category, data_text, date_insert ); }
                            });
                        }
                        // Notice lenght post data_text
                        else{
                            $('#add_data_text').val('required');
                            setTimeout(function(){ $('#add_data_text').val(''); },1000);
                        }
                    }
                    else{}
                }
                // Notice lenght post data_title
                else{
                    $('#add_data_title').val('required');
                    setTimeout(function(){ $('#add_data_title').val(''); },1000);
                }

            });

            // Create file & add data
            function create_file( title, category, text, dateinsert ){
                var json_data = { data: [ { title:title, category:category, text:text, dateinsert:dateinsert } ] };
                fs.writeFile('data/data_scripts.json', JSON.stringify( json_data ), function(err) {
                  if (err) throw err;
                  console.log('It\'s saved!');
                  $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
                });
            }

            // Add data in file
            function add_data_in_file( title, category, text, dateinsert ){
                $.getJSON( 'data/data_scripts.json',function(getdata){
                    getdata.data.push( { title:title, category:category, text:text, dateinsert:dateinsert } );
                    fs.writeFile('data/data_scripts.json', JSON.stringify( getdata ), function(err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                      $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
                    });
                });
            }

        },200);
    }
    // Load data
    window.load_data_js = function(){
        $('.data').fadeIn(500);

        // variables
        //var fs          = require('fs');
        //var date_now    = getDate("y-m-d H:M:S");

        $('#add_data_bloc').remove();

        $('.bt-add-data-close').css({
            '-webkit-transform':'rotate(0deg)',
            '-ms-transform':'rotate(0deg)',
            'transform':'rotate(0deg)',
            'color':'#2c3e50',
            '-webkit-transition':'transform 0.5s, color 1s',
            'transition':'transform 0.5s, color 1s'
        }).removeClass('bt-add-data-close').addClass('bt-add-data');

        // Open file
        fs.open('data/data_scripts.json', 'r+', function(err, fd) {
            if( err || fd == undefined ){ file_not_exist(); }
            else{ view_data(); }
        });

        // View data
        function view_data(){

            var selected0 = $('.selected-list').attr('id');
            if( selected0 != null && selected0 != undefined ){

                var selected1 = selected0.split('_'), selected = selected1[1];

                $.getJSON( 'data/data_scripts.json',function( getdata ){
                    $.each( getdata.data, function( key, val ) {
                        if(key == selected){
                            append_bloc_data(key, val, getdata);
                        }
                    });
                });

            }
            else{

                $.getJSON( 'data/data_scripts.json',function( getdata ){

                    selected = getdata.data.length-1;

                    $.each( getdata.data, function( key, val ) {
                        if(key == selected){
                            append_bloc_data(key, val, getdata);
                            setTimeout(function(){
                                $('.bloc-list').removeClass('selected-list');
                                $('.selected-list-view').remove();
                                $("#bloclist_"+selected).addClass('selected-list');
                                $("#bloclist_"+selected).append('<div class="selected-list-view"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></div>')
                            },500);
                        }
                    });
                });
            }

            // Append bloc data function
            function append_bloc_data(key, val, getdata){

                // Add var bloc title json object
                var data_bloc_title =
                    "<div class='data-bloc-title-i'>"+
                        "<i class='devicon-" +val.category+ "-plain colored'></i>"+
                    "</div>"+
                    "<div class='data-bloc-title-s'>" + val.title + " <small>" + val.category + "</small></div>";
                $('.data-bloc-title').html( data_bloc_title );

                // Add var bloc data json object
                var bloc_data =
                    "<div id='blocdata_" + key + "' class='bloc-data'>"+
                        "<form id='edit_bloc_"+key+"'>"+
                            "<div class='bloc-data-date'>" + val.dateinsert + "</div>"+
                            "<div class='bloc-data-topbar'>"+
                                "<div class='bloc-data-topbar-r'><i class='fa fa-trash bt-bloc-delete' aria-hidden='true'></i></div>"+
                                "<div class='bloc-data-topbar-r'><i class='fa fa-pencil bt-bloc-edit' aria-hidden='true'></i></div>"+
                            "</div>"+
                            "<div id='deletebloc_" + key + "' class='bloc-data-confirm-delete'>"+
                                "<span>Delete data ?</span> <button class='delete-confirm'>YES</button> <button class='delete-cancel'>NO</button>"+
                            "</div>"+
                            "<div class='bloc-data-content'>"+
                                "<div class='bloc-data-title-edit'><input type='text' id='edit_title_"+key+"' value='"+val.title+"' /></div>"+
                                 "<div class='bloc-data-category-edit'></div>"+
                                "<div class='bloc-data-text'>" + val.text + "</div>"+
                                "<div class='bloc-data-text-edit'>"+
                                    "<textarea name='edit_text_"+key+"' id='edit_text'>" + val.text + "</textarea>"+
                                "</div>"+
                                "<div class='bloc-data-button-edit'><button type='submit' id='edit_button_"+key+"'>UPDATE</button></div>"+
                            "</div>"+
                        "</form>"+
                    "</div>";
                $('.data-load-bloc').append( bloc_data );

                // Add class line-numbers to pre
                $('pre').addClass('line-numbers');

                // Edit bloc data
                $('.bt-bloc-edit').on('click', function(){

                    if( $('.bloc-data-title-edit').is(':hidden') ){

                        //$('pre').removeClass('line-numbers');
                        //$('pre').removeClass('language-markup');

                        $('.bloc-data-title-edit').show()
                        $('.bloc-data-category').hide()
                        $('.bloc-data-category-edit').show()
                        $('.bloc-data-text').hide()
                        $('.bloc-data-text-edit').show();

                        $('.bloc-data-button-edit').show();

                        tinymce.remove('textarea');
                        tinymce.init({
                            selector: '#edit_text',
                            height: 300,
                            theme: 'modern',
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                                'searchreplace wordcount visualblocks visualchars code fullscreen',
                                'insertdatetime media nonbreaking save table contextmenu directionality',
                                'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
                            ],
                            codesample_languages: [
                                {text:'HTML/XML',value:'markup'},
                                {text:"XML",value:"xml"},
                                {text:"HTML",value:"html"},
                                {text:"mathml",value:"mathml"},
                                {text:"SVG",value:"svg"},
                                {text:"CSS",value:"css"},
                                {text:"Clike",value:"clike"},
                                {text:"Javascript",value:"javascript"},
                                {text:"ActionScript",value:"actionscript"},
                                {text:"apacheconf",value:"apacheconf"},
                                {text:"apl",value:"apl"},
                                {text:"applescript",value:"applescript"},
                                {text:"asciidoc",value:"asciidoc"},
                                {text:"aspnet",value:"aspnet"},
                                {text:"autoit",value:"autoit"},
                                {text:"autohotkey",value:"autohotkey"},
                                {text:"bash",value:"bash"},
                                {text:"basic",value:"basic"},
                                {text:"batch",value:"batch"},
                                {text:"c",value:"c"},
                                {text:"brainfuck",value:"brainfuck"},
                                {text:"bro",value:"bro"},
                                {text:"bison",value:"bison"},
                                {text:"C#",value:"csharp"},
                                {text:"C++",value:"cpp"},
                                {text:"CoffeeScript",value:"coffeescript"},
                                {text:"ruby",value:"ruby"},
                                {text:"d",value:"d"},
                                {text:"dart",value:"dart"},
                                {text:"diff",value:"diff"},
                                {text:"docker",value:"docker"},
                                {text:"eiffel",value:"eiffel"},
                                {text:"elixir",value:"elixir"},
                                {text:"erlang",value:"erlang"},
                                {text:"fsharp",value:"fsharp"},
                                {text:"fortran",value:"fortran"},
                                {text:"git",value:"git"},
                                {text:"glsl",value:"glsl"},
                                {text:"go",value:"go"},
                                {text:"groovy",value:"groovy"},
                                {text:"haml",value:"haml"},
                                {text:"handlebars",value:"handlebars"},
                                {text:"haskell",value:"haskell"},
                                {text:"haxe",value:"haxe"},
                                {text:"http",value:"http"},
                                {text:"icon",value:"icon"},
                                {text:"inform7",value:"inform7"},
                                {text:"ini",value:"ini"},
                                {text:"j",value:"j"},
                                {text:"jade",value:"jade"},
                                {text:"java",value:"java"},
                                {text:"JSON",value:"json"},
                                {text:"jsonp",value:"jsonp"},
                                {text:"julia",value:"julia"},
                                {text:"keyman",value:"keyman"},
                                {text:"kotlin",value:"kotlin"},
                                {text:"latex",value:"latex"},
                                {text:"less",value:"less"},
                                {text:"lolcode",value:"lolcode"},
                                {text:"lua",value:"lua"},
                                {text:"makefile",value:"makefile"},
                                {text:"markdown",value:"markdown"},
                                {text:"matlab",value:"matlab"},
                                {text:"mel",value:"mel"},
                                {text:"mizar",value:"mizar"},
                                {text:"monkey",value:"monkey"},
                                {text:"nasm",value:"nasm"},
                                {text:"nginx",value:"nginx"},
                                {text:"nim",value:"nim"},
                                {text:"nix",value:"nix"},
                                {text:"nsis",value:"nsis"},
                                {text:"objectivec",value:"objectivec"},
                                {text:"ocaml",value:"ocaml"},
                                {text:"oz",value:"oz"},
                                {text:"parigp",value:"parigp"},
                                {text:"parser",value:"parser"},
                                {text:"pascal",value:"pascal"},
                                {text:"perl",value:"perl"},
                                {text:"PHP",value:"php"},
                                {text:"processing",value:"processing"},
                                {text:"prolog",value:"prolog"},
                                {text:"protobuf",value:"protobuf"},
                                {text:"puppet",value:"puppet"},
                                {text:"pure",value:"pure"},
                                {text:"python",value:"python"},
                                {text:"q",value:"q"},
                                {text:"qore",value:"qore"},
                                {text:"r",value:"r"},
                                {text:"jsx",value:"jsx"},
                                {text:"rest",value:"rest"},
                                {text:"rip",value:"rip"},
                                {text:"roboconf",value:"roboconf"},
                                {text:"crystal",value:"crystal"},
                                {text:"rust",value:"rust"},
                                {text:"sas",value:"sas"},
                                {text:"sass",value:"sass"},
                                {text:"scss",value:"scss"},
                                {text:"scala",value:"scala"},
                                {text:"scheme",value:"scheme"},
                                {text:"smalltalk",value:"smalltalk"},
                                {text:"smarty",value:"smarty"},
                                {text:"SQL",value:"sql"},
                                {text:"stylus",value:"stylus"},
                                {text:"swift",value:"swift"},
                                {text:"tcl",value:"tcl"},
                                {text:"textile",value:"textile"},
                                {text:"twig",value:"twig"},
                                {text:"TypeScript",value:"typescript"},
                                {text:"verilog",value:"verilog"},
                                {text:"vhdl",value:"vhdl"},
                                {text:"wiki",value:"wiki"},
                                {text:"YAML",value:"yaml"}
                            ],
                            toolbar1: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | link | preview | forecolor backcolor emoticons | codesample',
                            toolbar2: '',
                            image_advtab: true
                        });
                    }
                    else{
                        $('.bloc-data-title-edit').hide()
                        $('.bloc-data-category').show()
                        $('.bloc-data-category-edit').hide()
                        $('.bloc-data-text').show()
                        $('.bloc-data-text-edit').hide();

                        $('.bloc-data-button-edit').hide();

                        tinymce.remove('textarea');
                    }

                    $.post('./load/load_category_select.html', function( editcategory ){
                        $('.bloc-data-category-edit').html( editcategory );
                        $('#add_data_category').prepend('<option value="'+val.category+'" selected>'+val.category+'</option>')
                    });

                    setTimeout(function(){
                        $('#edit_bloc_'+key).on('submit', function(e){
                            e.preventDefault();
                            var edit_title      = $('#edit_title_'+key).val();
                            var edit_category   = $('#add_data_category').val();
                            var edit_text       = $('textarea#edit_text').val();

                            $.getJSON( "data/data_scripts.json", function( datajson ){
                                $.each( datajson.data, function( editkey, editval ) {
                                    if(editkey == key){

                                        editval.title       = edit_title;
                                        editval.category    = edit_category;
                                        editval.text        = edit_text;
                                        editval.dateinsert   = date_now;

                                        setTimeout(function(){
                                            fs.writeFile('data/data_scripts.json', JSON.stringify( datajson ), function(err) {
                                                if (err) throw err;
                                                console.log('It\'s saved!');
                                                $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
                                                $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); });
                                            });
                                        },500);
                                    }
                                });
                            });
                        });
                    },500);
                });

                // Prism hightlight code
                setTimeout(function(){
                    Prism.highlightAll();
                },100);

                // Delete bloc data
                setTimeout(function(){
                    $('.bt-bloc-delete').on('click', function(){

                        var id0 = $(this).parent().parent().parent().parent().attr('id'), id1 = id0.split('_'), id = id1[1];

                        if( $('#deletebloc_' + id).is(':hidden') ){
                            $('#deletebloc_' + id).slideDown(500);
                            $('.delete-cancel').on('click', function(){ $('#deletebloc_' + id).slideUp(500); });

                            $('.delete-confirm').on('click', function(e){
                                e.preventDefault();
                                getdata.data.splice(id,1);
                                setTimeout(function(){
                                   fs.writeFile('data/data_scripts.json', JSON.stringify( getdata ), function(err){
                                      if (err) throw err;
                                      console.log('It\'s saved!');
                                      $.post('./load/load_data_list.html', function( datalist ){ $('.js-load-data-list').html( datalist ); });
                                      $.post('./load/load_data.html', function( datadetail ){ $('.js-load-page').html( datadetail ); });
                                    });
                                },500);
                            });

                        }
                        else{ $('#deletebloc_' + id).slideUp(500); }
                    });
                },200);
            }
        }

        // File not exist
        function file_not_exist(){
            console.log('file not exist');
            var first_start = "<div class='first-start'><span>Hey ! It's your first boot ?</span> OK, start to add data in your app...</div>";
            $('.js-load-page').html(first_start);
        }
    }
    // Load parameters
    window.load_parameters_js = function(){
        $('.data').show();

        // Open file
        fs.open('parameters/parameters.json', 'r+', function(err, fd) {
            if( err || fd == undefined ){
                console.log("file parameters not exist");
                create_file_parameters();
            }
            else{
                console.log("file parameters exist");
                view_file_parameters_github();
            }
        });

        $('form#github_clone').on('submit', function(e){
            e.preventDefault();
            var url_clone = $('input#github_clone').val();
            if( url_clone.length >=1 ){

                var execcmd = shell_exec('cd data && git clone ' + url_clone);
                console.log( execcmd );
                var gitpull = shell_exec('cd data/githubdata && git pull --force');
                console.log( gitpull );
                var gitpush = shell_exec('cp data/data_scripts.json data/githubdata/');
                console.log( gitpush );
                var gitadd = shell_exec('cd data/githubdata && git add data_scripts.json');
                console.log( gitadd );
                var gitcommit = shell_exec('cd data/githubdata && git commit -m "update"');
                console.log( gitcommit );
                //var gitremote = shell_exec('cd data/githubdata && git remote add origin git@'+url_clone)
                //var gitpush = shell_exec('cd data/githubdata && git push origin master');
                //console.log( gitpush );
                //var gitremote = shell_exec('cd data/githubdata && git remote add origin git@'+url_clone)
                var gitpush = shell_exec('cd data/githubdata && git push https://bantioco:DRbjkuR45wZy@github.com/bantioco/githubdata.git');



                /*
                var gitcommit = shell_exec('cd data/githubdata && git commit -m "update"');
                console.log( gitcommit );
                var gitpull = shell_exec('cd data/githubdata && git push origin master');
                console.log( gitpull );
                */


            }
            else{
                $('input#github_clone').attr('placeholder','required');
                setTimeout(function(){ $('input#github_clone').attr('placeholder','Github clone https..'); },2000)
            }
        });

        $('form#github_configure').on('submit',function(e){
            e.preventDefault();
            var githubclone     = $('#github_clone').val();
            var githubusername  = $('#github_username').val();
            var githubpassword  = $('#github_password').val();

            if(githubclone.length >= 1 && githubusername.length >= 1 && githubpassword.length >=1 ){

                $.getJSON( "parameters/parameters.json", function( getparameters ){
                        $.each( getparameters.parameters, function( editkey, editval ) {

                            editval['github'][0].clone      = githubclone;
                            editval['github'][0].username   = githubusername;
                            editval['github'][0].password   = githubpassword;
                            editval['github'][0].status     = "1";

                            setTimeout(function(){
                                fs.writeFile('parameters/parameters.json', JSON.stringify( getparameters ), function(err) {
                                    if (err) throw err;
                                    console.log('It\'s saved!');
                                    load_parameters()
                                });
                            },500);
                        });
                    });

            }
            else if( githubclone.length < 1 ){
                $('#github_clone').val("required");
                setTimeout(function(){ $('#github_clone').val(""); },2000)
            }
            else if( githubusername.length < 1 ){
                $('#github_username').val("required");
                setTimeout(function(){ $('#github_username').val(""); },2000)
            }
            else if( githubpassword.length < 1 ){
                $('#github_password').val("required");
                setTimeout(function(){ $('#github_password').val(""); },2000)
            }
        });
    }

    // Create file & add data
    function create_file_parameters(){
        var json_data_parameters =
            { parameters:
                [
                    {
                        github:
                        [
                            {
                                clone:"",
                                username:"",
                                password:"",
                                status:"0",
                                dateadd:date_now
                            }
                        ]
                    }
                ]
            };

        fs.writeFile('parameters/parameters.json', JSON.stringify( json_data_parameters ), function(err) {
          if (err) throw err;
          console.log('Github file parameters created..');
          load_parameters();
        });
    }

    function view_file_parameters_github(){

        $('.parameters-git').show(300);

        setTimeout(function(){
            $.getJSON( 'parameters/parameters.json',function(getparameters){
                //getdata.data.push( { title:title, category:category, text:text, dateinsert:dateinsert } );
                $.each( getparameters.parameters, function( key, val ) {
                    var githubstatus = val['github'][0].status;
                    if( githubstatus === "0" ){
                        console.log("github null");
                        $('.parameters-git').show(300);
                    }
                    else if( githubstatus === "1" ){
                        console.log("github valid");

                        $( '.parameters-git-inp-button' ).text( 'update' );
                        $('.parameters-github-action').show();

                        var clonedata       = val['github'][0].clone;
                        var usernamedata    = val['github'][0].username;
                        var passworddata    = val['github'][0].password;
                        view_file_parameters_configured(clonedata, usernamedata, passworddata);



                        setTimeout(function(){

                            var gitstatus = shell_exec('cd data/githubdata && git status');
                            console.log( gitstatus );
                            $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git status</h3>"+gitstatus+"</div>" );

                            $('.parameters-git-github-configure-title').fadeOut(100);
                            $('.parameters-git-github-configure-notice').fadeOut(100);

                            var repo0 = clonedata.split('https://'), repo = repo0[1];

                            $('.bt-github-pull').on('click',function(){
                                var gitpull = shell_exec('cd data/githubdata && git pull');
                                console.log( gitpull );
                                $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git pull</h3>"+gitpull+"</div>" );
                                var gitsave = shell_exec('cp data/data_scripts.json data/data_save/'+getDate('ymdHMS')+'_data_scripts.json');

                                setTimeout(function(){
                                    var gitsync = shell_exec('cp data/githubdata/data_scripts.json data/');
                                },1000);
                            });

                            $('.bt-github-push').on('click',function(){

                                var gitcopy = shell_exec('cp data/data_scripts.json data/githubdata/');
                                console.log( gitcopy );

                                var gitstatus = shell_exec('cd data/githubdata && git status');
                                console.log( gitstatus );

                                setTimeout(function(){

                                    var gitstatus = shell_exec('cd data/githubdata && git status -s');
                                    console.log( gitstatus );
                                    $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git status -s</h3>"+gitstatus+"</div>" );
                                    //$('.parameters-git-return-js').html( "<div class='parameters-git-return-view'>"+gitstatus+"</div>" );
                                    // My local data is not commited
                                    if( gitstatus != ""){

                                        setTimeout(function(){
                                            var gitadd = shell_exec('cd data/githubdata && git add data_scripts.json');
                                            console.log( gitadd );
                                            $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git add</h3>"+gitadd+"</div>" );
                                        },500);

                                        setTimeout(function(){
                                            var gitcommit = shell_exec('cd data/githubdata && git commit -m "update_'+getDate('ymdHMS')+'"');
                                            console.log( gitcommit );
                                            $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git commit</h3>"+gitcommit+"</div>" );
                                        },1500);

                                        setTimeout(function(){
                                            var gitpush = shell_exec('cd data/githubdata && git push https://'+usernamedata+':'+passworddata+'@'+repo);
                                            console.log( gitpush );
                                        },2000);

                                        setTimeout(function(){
                                            var gitstatus = shell_exec('cd data/githubdata && git status');
                                            console.log( gitstatus );
                                            $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git status</h3>"+gitstatus+"</div>" );
                                        },3000);
                                    }
                                    else{
                                        var gitstatus = shell_exec('cd data/githubdata && git status');
                                        console.log( gitstatus );
                                        $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'><h3>Git status</h3>"+gitstatus+"</div>" );
                                        /*
                                        var gitstatus = shell_exec('cd data/githubdata && git pull');
                                        console.log( gitstatus );
                                        $('.parameters-git-return-js').html( "<div class='parameters-git-return-view'>"+gitstatus+"</div>" );
                                        var gitsave = shell_exec('cp data/data_scripts.json data/data_save/'+getDate('ymdHMS')+'_data_scripts.json');

                                        setTimeout(function(){
                                            var gitsync = shell_exec('cp data/githubdata/data_scripts.json data/');
                                        },500);
                                        */
                                    }
                                },1000);
                            });







                            /*
                            var gitpull = shell_exec('cd data/githubdata && git pull --force');
                            console.log( gitpull );
                            $('.parameters-git-return-js').html( gitpull );

                            var gitcopy = shell_exec('cp data/data_scripts.json data/githubdata/');
                            console.log( gitpush );
                            $('.parameters-git-return-js').html( gitpush );

                            var gitadd = shell_exec('cd data/githubdata && git add data_scripts.json');
                            console.log( gitadd );
                            $('.parameters-git-return-js').html( gitadd );
                            */

                            /*
                            var gitcommit = shell_exec('cd data/githubdata && git commit -m "update"');
                            console.log( gitcommit );
                            $('.parameters-git-return-js').html( gitcommit );
                            */

                            /*
                            var gitpush = shell_exec('cd data/githubdata && git push https://'+usernamedata+':'+passworddata+'@'+repo);
                            console.log( gitpush );
                            $('.parameters-git-return-js').html( gitpush );
                            */


                        },1000);
                    }
                    else{
                        console.log("github error")
                    }
                });
            });
        },500);
    }

    function view_file_parameters_configured(clonedata, usernamedata, passworddata){
        $('#github_clone').val( clonedata );
        $('#github_username').val( usernamedata );
        $('#github_pasword').val( passworddata );
    }


});

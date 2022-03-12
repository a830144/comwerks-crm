
 // includes/plugin_social/js/social.js

ucm.social = {

    modal_url: '',
    init: function(){
        var p = $('#social_modal_popup');
        p.dialog({
            autoOpen: false,
            width: 700,
            height: 600,
            modal: true,
            buttons: {
                Close: function() {
                    $(this).dialog('close');
                }
            },
            open: function(){
                var t = this;
                $.ajax({
                    type: "GET",
                    url: ucm.social.modal_url+(ucm.social.modal_url.match(/\?/) ? '&' : '?')+'display_mode=ajax',
                    dataType: "html",
                    success: function(d){
                        $('.modal_inner',t).html(d);
                        $('input[name=_redirect]',t).val(window.location.href);
                        init_interface();
                        $('.modal_inner iframe.autosize',t).height($('.modal_inner',t).height()-41); // for firefox
                    }
                });
            },
            close: function() {
                $('.modal_inner',this).html('');
            }
        });
        $('body').delegate('.social_modal','click',function(){
            ucm.social.open_modal($(this).attr('href'), $(this).data('modal-title'));
            return false;
        });
    },
    close_modal: function(){
        var p = $('#social_modal_popup');
        p.dialog('close');
    },
    open_modal: function(url, title){
        var p = $('#social_modal_popup');
        p.dialog('close');
        ucm.social.modal_url = url;
        p.dialog('option', 'title', title);
        p.dialog('open');
    }

};

 // includes/plugin_quote/js/quote.js

ucm.quote = {

    ajax_task_url: '',
    create_invoice_popup_url: '',
    create_invoice_url: '',

    // init called from the quote edit page
    init: function(){
        var t = this;
        t.update_quote_tax();
    },
    toggle_task_complete: function(task_id){

    },
    update_quote_tax: function(){
        if($('#quote_tax_holder .dynamic_block').length > 1)$('.quote_tax_increment').show(); else $('.quote_tax_increment').hide();
    },
    generate_invoice_done: false,
    generate_invoice: function(title){
        var t = this;

        $('#create_invoice_options_inner').load(t.create_invoice_popup_url,function(){
            $('#create_invoice_options').dialog({
                autoOpen: true,
                height: 560,
                width: 350,
                modal: true,
                title: title,
                buttons: {
                    Create: function() {
                        var url = t.create_invoice_url;
                        var items = $('.invoice_create_task:checked');
                        if(items.length>0){
                            items.each(function(){
                                url += '&task_id[]=' + $(this).data('taskid');
                            });
                            window.location.href=url;
                        }else{
                            $(this).dialog('close');
                        }
                    }
                }
            });
        });
    }
};

$(function(){
    ucm.quote.init();
});

 // includes/plugin_pin/js/pin.js

$(function(){
    $('#top_menu_pin').hover(function(){
        $('#top_menu_pin_options').show();
    },function(){
        $('#top_menu_pin_options').hide();
    });
    $('#pin_current_page').click(function(){
        $('#pin_action').val('add');
        $('#pin_current_title').val(document.title);
        $('#pin_action_form')[0].submit();
        return false;
    });
    $('.top_menu_pin_delete').click(function(){
        $('#pin_action').val('delete');
        $('#pin_id').val($(this).parent().parent().attr('rel'));
        $('#pin_action_form')[0].submit();
        return false;
    });
    $('.top_menu_pin_edit').click(function(){
        var newtitle = prompt('New title:',$(this).parent().parent().find('.top_menu_pin_item').text());
        if(newtitle){
            $('#pin_action').val('modify');
            $('#pin_id').val($(this).parent().parent().attr('rel'));
            $('#pin_current_title').val(newtitle);
            $('#pin_action_form')[0].submit();
        }
        return false;
    });
});

 // includes/plugin_social_facebook/js/social_facebook.js

ucm.social.facebook = {
    api_url: '',
    init: function(){

        $('body').delegate('.facebook_reply_button','click',function(){
            var f = $(this).parents('.facebook_comment').first().next('.facebook_comment_replies').find('.facebook_comment_reply_box');
            f.show();
            f.find('textarea')[0].focus();
        }).delegate('.facebook_comment_reply textarea','keyup',function(){
            var a = this;
            if (!$(a).prop('scrollTop')) {
                do {
                    var b = $(a).prop('scrollHeight');
                    var h = $(a).height();
                    $(a).height(h - 5);
                }
                while (b && (b != $(a).prop('scrollHeight')));
            }
            $(a).height($(a).prop('scrollHeight') + 10);
        }).delegate('.facebook_comment_reply button','click',function(){
            // send a message!
            var p = $(this).parent();
            var txt = $(p).find('textarea');
            var message = txt.val();
            if(message.length > 0){
                //txt[0].disabled = true;
                // show a loading message in place of the box..
                $.ajax({
                    url: ucm.social.facebook.api_url,
                    type: 'POST',
                    data: {
                        action: 'send-message-reply',
                        id: $(this).data('id'),
                        facebook_id: $(this).data('facebook-id'),
                        message: message,
                        debug: $(p).find('.reply-debug')[0].checked ? 1 : 0,
                        form_auth_key: ucm.form_auth_key
                    },
                    dataType: 'json',
                    success: function(r){
                        if(r && typeof r.redirect != 'undefined'){
                            window.location = r.redirect;
                        }else if(r && typeof r.message != 'undefined'){
                            p.html("Info: "+ r.message);
                        }else{
                            p.html("Unknown error, please try reconnecting to Facebook in settings. "+r);
                        }
                    }
                });
                p.html('Sending...');
            }
            return false;
        }).delegate('.socialfacebook_message_action','click',ucm.social.facebook.message_action);
        $('.facebook_message_summary a').click(function(){
            var p = $(this).parents('tr').first().find('.socialfacebook_message_open').click();
            return false;
        });
        /*$('.pagination_links a').click(function(){
            $(this).parents('.ui-tabs-panel').first().load($(this).attr('href'));
            return false;
        });*/
    },
    message_action: function(link){
        $.ajax({
            url: ucm.social.facebook.api_url,
            type: 'POST',
            data: {
                action: $(this).data('action'),
                id: $(this).data('id'),
                form_auth_key: ucm.form_auth_key
            },
            dataType: 'script',
            success: function(r){
                ucm.social.close_modal();
            }
        });
        return false;
    }
};

 // includes/plugin_product/js/product.js

ucm.product = {

    product_name_search: '',
    text_box: false,
    task_id: '',
    selected_product_id: 0,

    init: function(){
        var t = this;
        $('body').delegate('.edit_task_description','change',function(){
            t.text_change(this);
        }).delegate('.edit_task_description','keyup',function(){
            t.text_change(this);
        });
    },
    text_change: function(txtbox){
        // look up a product based on this value
        this.text_box = txtbox;
        if(txtbox.value.length > 2 && txtbox.value != this.product_name_search){
            // grep the id out of this text box.
            this.task_id = $(this.text_box).data('id') ? $(this.text_box).data('id') : $(this.text_box).attr('id').replace(/task_desc_/,'');
            //console.log(this.task_id);
            // search!

            // TODO: don't keep hitting ajax if the previous subset string search didn't return any results.

            this.product_name_search = txtbox.value;
            // search for results via ajax, if any are found we show them.
            try{ this.ajax_job.abort();}catch(err){}
            this.ajax_job = $.ajax({
                type: "POST",
                url: window.location.href,
                data: {
                    'product_name': this.product_name_search,
                    '_products_ajax': 'products_ajax_search'
                },
                success: function(result){
                    result = $.trim(result);
                    if(result != ''){
                        //$(ucm.product.text_box).attr('autocomplete','off');
                        ucm.product.show_dropdown(result);
                    }else{
                        ucm.product.hide_dropdown();
                    }
                }
            });
        }
    },
    /* called when the dropdown button is clicked */
    do_dropdown: function(task_id,btn){
        this.task_id = task_id;
        if($('.product_select_dropdown').length>=1){
            this.hide_dropdown();
            return false;
        }
        this.text_box = $(btn).parent().parent().find('.edit_task_description');
        this.product_name_search = ''; // so we show everyting
        this.show_dropdown();
        return false;
    },
    show_dropdown: function(products){
        var t = this;
        if($('.product_select_dropdown').length>=1){
            t.hide_dropdown();
        }
        if(t.text_box){
            $(t.text_box).before('<div class="product_select_dropdown">Loading...</div>');
            if(typeof products != 'undefined'){
                $(ucm.product.text_box).attr('autocomplete','off');
                $('.product_select_dropdown').html(products);

                $('.product_category_parent').bind('click',function(e){
                    $(this).next('ul').toggle();
//                    e.stopImmediatePropagation();
//                    e.stopPropagation();
//                    e.preventDefault();
                    return false;
                });
            }else{
                // todo - clean this ajax up into a single external call
                try{ this.ajax_job.abort();}catch(err){}
                this.ajax_job = $.ajax({
                    type: "POST",
                    url: window.location.href,
                    data: {
                        'product_name': '',
                        '_products_ajax': 'products_ajax_search'
                    },
                    success: function(result){
                        result = $.trim(result);
                        if(result != ''){
                            //$(ucm.product.text_box).attr('autocomplete','off');
//                            $('.product_select_dropdown').html(result);
                            ucm.product.show_dropdown(result);

                        }else{
                            ucm.product.hide_dropdown();
                        }
                    }
                });
            }
            if(!t.clickbound){
                t.clickbound=true;
                setTimeout(function(){$('body').bind('click', t.hide_dropdown);},150);
            }
        }
    },
    clickbound: false,
    hide_dropdown: function(){
        if($('.product_select_dropdown').length>=1){
            $('.product_select_dropdown').remove();
        }
        $('body').unbind('click', this.hide_dropdown);
        ucm.product.clickbound=false;
    },
    select_product: function(product_id){
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: {
                'product_id': product_id,
                '_products_ajax': 'products_ajax_get'
            },
            dataType: 'json',
            success: function(product_data){
                //console.debug(product_data);
                /*amount: "1.00"
                currency_id: "1"
                date_created: "2013-01-28"
                date_updated: "2013-01-28"
                description: "asdfasdf"
                name: "test product"
                product_category_id: "0"
                product_id: "1"
                quantity: "4.00"*/
                if(product_data && product_data.product_id){
                    // hack for invoice support as well...

                    var product_type = 'job';
                    if($('#invoice_product_id_'+ucm.product.task_id).length > 0)product_type = 'invoice';

                    $('#task_product_id_'+ucm.product.task_id).val(product_data.product_id);
                    $('#invoice_product_id_'+ucm.product.task_id).val(product_data.product_id);
                    //etc...
                    if(typeof product_data.name != 'undefined'){
                        var n = product_data.name;
                        if(typeof product_data.product_category_id != 'undefined' && product_data.product_category_id > 0 && typeof product_data.product_category_name != 'undefined'){
                            n = product_data.product_category_name + " > " + n;
                        }
                        $('#task_desc_'+ucm.product.task_id).val(n);
                        $('#invoice_item_desc_'+ucm.product.task_id).val(n);
                    }
                    if(typeof product_data.quantity != 'undefined' && parseFloat(product_data.quantity)>0){
                        $('#task_hours_'+ucm.product.task_id).val(product_data.quantity);
                        $('#'+ucm.product.task_id+'invoice_itemqty').val(product_data.quantity);
                    }else{
                        $('#task_hours_'+ucm.product.task_id).val('');
                        $('#'+ucm.product.task_id+'invoice_itemqty').val('');
                    }
                    if(typeof product_data.amount != 'undefined' && parseFloat(product_data.amount)>0){
                        $('#'+ucm.product.task_id+'taskamount').val(product_data.amount);
                        $('#'+ucm.product.task_id+'invoice_itemrate').val(product_data.amount);
                    }else{
                        $('#'+ucm.product.task_id+'taskamount').val('');
                        $('#'+ucm.product.task_id+'invoice_itemrate').val('');
                    }
                    if(typeof product_data.default_task_type != 'undefined'){
                        $('#manual_task_type_' + ucm.product.task_id).val( parseInt(product_data.default_task_type) );
                    }
                    if(typeof product_data.taxable != 'undefined'){
                        $('#invoice_taxable_item_' + ucm.product.task_id).val( parseInt(product_data.taxable) >= 1 ? 1 : 0).prop('checked',parseInt(product_data.taxable) >= 1 );
                        $('#taxable_t_' + ucm.product.task_id).val( parseInt(product_data.taxable) >= 1 ? 1 : 0 ).prop('checked',parseInt(product_data.taxable) >= 1 );
                    }
                    if(typeof product_data.billable != 'undefined'){
                        // no billable option on invoices.
                        $('#billable_t_' + ucm.product.task_id).val( parseInt(product_data.billable) >= 1 ? 1 : 0 ).prop('checked',parseInt(product_data.billable) >= 1);
                    }
                    if(typeof product_data.description != 'undefined'){
                        $('#task_long_desc_'+ucm.product.task_id).val(product_data.description);
                        $('#'+ucm.product.task_id+'_task_long_description').val(product_data.description);
                        if(product_data.description.length > 0){
                            $(ucm.product.text_box).parent().find('.task_long_description').slideDown();
                        }
                    }else{
                        $('#task_long_desc_'+ucm.product.task_id).val('');
                        $('#'+ucm.product.task_id+'_task_long_description').val('');
                    }
                }
            }
        });
        return false;
    }
};

$(function(){
    ucm.product.init();
});

 // includes/plugin_backup/js/backup.js

ucm.backup = {
    file_list: [],
    database_list: [],
    backup_url: '',
    backup_post_data: {},
    backup_delay: 1000,
    lang:{
        pending:'Pending',
        process:'Processing',
        success:'Successfully backed up %s items',
        error:'Error',
        retry:'Retrying...'
    },
    init: function(){
        var db = $('#database_backup');
        for(var i in ucm.backup.database_list){
            if(ucm.backup.database_list.hasOwnProperty(i) && typeof ucm.backup.database_list[i].name != 'undefined'){
                ucm.backup.database_list[i].html = $('<li><span class="database_table">'+ucm.backup.database_list[i].name+'</span> <span class="backup_status">'+ucm.backup.lang.pending+'</span></li>');
                db.append(ucm.backup.database_list[i].html);
            }
        }
        var fs = $('#files_backup');
        for(var i in ucm.backup.file_list){
            if(ucm.backup.file_list.hasOwnProperty(i) && typeof ucm.backup.file_list[i].name != 'undefined'){
                ucm.backup.file_list[i].html = $('<li><span class="file_name">'+ucm.backup.file_list[i].name+'</span> <span class="backup_status">'+ucm.backup.lang.pending+'</span></li>');
                fs.append(ucm.backup.file_list[i].html);
            }
        }
    },
    start_backup: function(){
        this.backup_next_database();
        //this.backup_next_file();
    },
    backup_database_index: 0,
    backup_next_database: function(){
        if(typeof ucm.backup.database_list[ucm.backup.backup_database_index] != 'undefined'){
            $('.backup_status',ucm.backup.database_list[ucm.backup.backup_database_index].html).html(ucm.backup.lang.process);
            // ajax this one and wait for it to finish.
            var post_data = {};
            for(var i in ucm.backup.backup_post_data){
                if(ucm.backup.backup_post_data.hasOwnProperty(i)){
                    post_data[i] = ucm.backup.backup_post_data[i];
                }
            }
            post_data.backup_type = 'database';
            post_data.name = ucm.backup.database_list[ucm.backup.backup_database_index].name;
            $.ajax({
                url: ucm.backup.backup_url + (ucm.backup.backup_url.indexOf('?') > 0 ? '&' : '?' ) + (new Date).getTime(),
                type: 'POST',
                dataType: 'json',
                data: post_data,
                success: function(d){
                    // did it work? update the status..
                    if(typeof d.retry != 'undefined'){
                        $('.backup_status',ucm.backup.database_list[ucm.backup.backup_database_index].html).html(ucm.backup.lang.retry);
                        setTimeout(function(){
                            ucm.backup.backup_next_database();
                        },5000);
                        return;
                    }else if(typeof d.count != 'undefined'){
                        $('.backup_status',ucm.backup.database_list[ucm.backup.backup_database_index].html).html(ucm.backup.lang.success.replace('%s', d.count)).addClass('success');
                    }else{
                        $('.backup_status',ucm.backup.database_list[ucm.backup.backup_database_index].html).html(ucm.backup.lang.error).addClass('error');
                    }
                    ucm.backup.backup_database_index++;
                    setTimeout(function(){
                            ucm.backup.backup_next_database();
                        },ucm.backup.backup_delay);
                    //ucm.backup.backup_next_database();
                },
                error: function(d){
                    alert('Failed to backup this database table ('+ucm.backup.database_list[ucm.backup.backup_database_index].name+'). Maybe it is too large? Skipping to next table...');
                    $('.backup_status',ucm.backup.database_list[ucm.backup.backup_database_index].html).html(ucm.backup.lang.error).addClass('error');
                    ucm.backup.backup_database_index++;
                    ucm.backup.backup_next_database();
                }
            });

        }else{
            // finished backing up all available databases.
            ucm.backup.completed_backup('database');
        }
    },
    backup_file_index: 0,
    backup_next_file: function(){
        if(typeof ucm.backup.file_list[ucm.backup.backup_file_index] != 'undefined'){
            $('.backup_status',ucm.backup.file_list[ucm.backup.backup_file_index].html).html(ucm.backup.lang.process);
            // ajax this one and wait for it to finish.
            var post_data = {};
            for(var i in ucm.backup.backup_post_data){
                if(ucm.backup.backup_post_data.hasOwnProperty(i)){
                    post_data[i] = ucm.backup.backup_post_data[i];
                }
            }
            post_data.backup_type = 'file';
            post_data.path = ucm.backup.file_list[ucm.backup.backup_file_index].path;
            post_data.recurisive = ucm.backup.file_list[ucm.backup.backup_file_index].recurisive;
            $.ajax({
                url: ucm.backup.backup_url + (ucm.backup.backup_url.indexOf('?') > 0 ? '&' : '?' ) + (new Date).getTime(),
                type: 'POST',
                dataType: 'json',
                data: post_data,
                success: function(d){
                    // did it work? update the status..
                    if(typeof d.retry != 'undefined'){
                        $('.backup_status',ucm.backup.file_list[ucm.backup.backup_file_index].html).html(ucm.backup.lang.retry);
                        setTimeout(function(){
                            ucm.backup.backup_next_file();
                        },5000);
                        return;
                    }else if(typeof d.count != 'undefined'){
                        $('.backup_status',ucm.backup.file_list[ucm.backup.backup_file_index].html).html(ucm.backup.lang.success.replace('%s', d.count)).addClass('success');
                    }else{
                        $('.backup_status',ucm.backup.file_list[ucm.backup.backup_file_index].html).html(ucm.backup.lang.error).addClass('error');
                    }
                    ucm.backup.backup_file_index++;
                    setTimeout(function(){
                            ucm.backup.backup_next_file();
                        },ucm.backup.backup_delay);
                },
                error: function(d){
                    alert('Failed to backup this folder ('+ucm.backup.file_list[ucm.backup.backup_file_index].path+'). Maybe it is too large? Skipping to next folder...');
                    $('.backup_status',ucm.backup.file_list[ucm.backup.backup_file_index].html).html(ucm.backup.lang.error).addClass('error');
                    ucm.backup.backup_file_index++;
                    ucm.backup.backup_next_file();
                }
            });
        }else{
            // finished backing up all available databases.
            ucm.backup.completed_backup('file');
        }
    },
    completed_backup_count:0,
    completed_backup: function(type){
        this.completed_backup_count++;
        if(this.completed_backup_count == 1){
            // start the file backup process..
            this.backup_next_file();
        }
        if(this.completed_backup_count>=2){
            // finished both files and database backup. refresh the page.
            window.location.href = window.location.href + '&completed';
        }
    }
};

 // includes/plugin_ticket/js/tickets.js



ucm.ticket = {
    ticket_message_text_is_html: false,
    ticket_url: '',
    init_main: function(){
        // for the main page listing
        $('#bulk_operation_all').change(function(){
            $('.ticket_bulk_check').prop('checked', $(this).is(":checked") );
        });
    },
    init: function(){
        $("#ticket_container").attr({ scrollTop: $("#ticket_container").attr("scrollHeight") });
        //$("#ticket_container").animate({ scrollTop: $("#ticket_container").attr("scrollHeight") },1500);
        $('#show_previous_button').click(function(){
            $('#show_previous_box').html('Loading...');
            $.post( ucm.ticket.ticket_url, {show_only_hidden: 1}, function( data ) {
                $('#show_previous_box').html('');
              $( "#show_previous_box" ).after( data );
            });
            return false;
        });
        $('#save_saved').click(function () {
            $.ajax({
                url: ucm.ticket.ticket_url,
                type: 'POST',
                data: '_process=save_saved_response&saved_response_id=' + $('#canned_response_id').val() + '&value=' + escape($('#new_ticket_message').val()),
                dataType: 'json',
                success: function (r) {
                    alert('Saved successfully');
                }
            });
        });
        $('#insert_saved').click(function () {
            $.ajax({
                url: ucm.ticket.ticket_url,
                data: '_process=insert_saved_response&saved_response_id=' + $('#canned_response_id').val(),
                dataType: 'json',
                success: function (r) {
                    ucm.ticket.add_to_message(r.value);
                }
            });
        });
        $('#private_message').change(function(){
            if(this.checked){
                $(this).parents('.ticket_message').first().addClass('ticket_message_private');
                $('#change_status_id').val(5);
            }else{
                $(this).parents('.ticket_message').first().removeClass('ticket_message_private');
                $('#change_status_id').val($('#data_change_status_id').data('status'));
            }
        }).change();
        $('#change_to_me').click(function(){
            $(this).parent().hide();
            $('#change_assigned_user_id').val($(this).data('user-id'));
            return false;
        });
    },
    add_to_message: function(content){
        if(ucm.ticket.ticket_message_text_is_html) {
            content = content.replace(/\n/g, "<br/>\n");
            tinyMCE.activeEditor.execCommand('mceInsertContent', false, content);
        }else {
            $('#new_ticket_message').val(
                $('#new_ticket_message').val() + content
            );
        }
        return false;
    }
};

$(function(){
    ucm.ticket.init_main();

});

 // includes/plugin_timer/js/timer.js

ucm.timer = {

    timer_ajax_url: '',
    mode: 1, // 1 = one timer at a time (new version), 2 = multiple active timers at a time (original version)
    timers: [], // array of active timers, obtained via ajax
    chunk_split: '||$|$||',
    split_chunk: '$$|$|$$',
    timer_index: {
        name: 0,
        url: 1,
        task_id: 2,
        start_time: 3,
        job_id: 5
    },
    lang: {
        pause: 'Pause',
        start: 'Start',
        resume: 'Resume',
        restart: 'Restart',
        complete: 'Complete'
    },
    init: function(){


        $(document).on('click','[data-task-timer]',function(e){
            e.preventDefault();
            ucm.timer.task_timer_clicked($(this).data('task-timer'));
            return false;
        });
        $(document).on('mouseenter','.timer_counter',function(){
            ucm.timer.timer_hover(this);
            return false;
        });

        // load any active timers from cookies.
        /*var cookietimers = this.tread();
        if(typeof cookietimers == 'string'){
            var bits = cookietimers.split(this.chunk_split);
            for (var i in bits){
                if (bits.hasOwnProperty(i)) {
                    var a = bits[i].split(this.split_chunk);
                    var this_timer={};
                    for(var t in this.timer_index){
                        if (this.timer_index.hasOwnProperty(t)) {
                            this_timer[t] = a[this.timer_index[t]];
                        }
                    }
                    this_timer['job_id'] = parseInt(this_timer['job_id']);
                    this_timer['task_id'] = parseInt(this_timer['task_id']);
                    if(!this_timer['job_id'] || !this_timer['task_id'])continue;
                    this_timer['start_time'] = parseInt(this_timer['start_time']);
                    this_timer['pause_time'] = parseInt(this_timer['pause_time']);
                    this.timers.push(this_timer);
                }
            }
        }*/
        // add a bit of pretty up in the header.
        // the theme must be able to style this so we leave it pretty generic

        $('#timer_menu_button').hover(function(){
            $('#timer_menu_options').show();
        },function(){
            $('#timer_menu_options').hide();
        });
        // start our ticker counter
        this.tick(true);
    },

    save_timers: function(){
        var timer_encoded=[];
        for(var i in this.timers){
            if (this.timers.hasOwnProperty(i)) {
                var arr = [];
                for(var t in this.timer_index){
                    if (this.timer_index.hasOwnProperty(t)) {
                        arr[this.timer_index[t]] = this.timers[i][t];
                    }
                }
                timer_encoded.push(arr.join(this.split_chunk));
            }
        }
        //this.twrite(timer_encoded.join(this.chunk_split));
    },
    // runs every second and updates any actively running timers:
    tick: function(recur){
        //var timer_count=0;
        for(var i in this.timers){
            if (this.timers.hasOwnProperty(i)) {

                if( typeof this.timers[i]['running'] != 'undefined' && this.timers[i]['running'] ) {
                    // timer is running
                    //timer_count++;
                    // update the timer with current time
                    var timer_elapsed = this.now() - this.timers[i]['timer_start'];
                }else{
                    var timer_elapsed = this.timers[i]['timer_length'];
                }

                var hours = Math.floor(timer_elapsed / 3600);
                var mins = Math.floor((timer_elapsed - (hours * 3600 )) / 60);
                var secs = Math.floor((timer_elapsed - (hours * 3600 ) - (mins * 60)));

                this.timers[i]['hours'] = hours;
                this.timers[i]['mins'] = mins;
                this.timers[i]['secs'] = secs;

                if (mins == 0) {
                    mins = '00';
                } else if (mins < 10) {
                    mins = '0' + mins;
                }

                if (secs < 10) {
                    secs = '0' + secs;
                }
                secs = ':' + secs;

                if (hours == 0) {
                    hours = '';
                } else {
                    hours = hours + ":";
                }

                this.timers[i]['timer_text'] = hours + mins + secs;

                if (typeof this.timers[i]['counter'] != 'undefined') {
                    this.timers[i]['counter'].find('.timer_number').html(this.timers[i]['timer_text']);
                }


            }
        }
        // header menu bits:
        /*if(timer_count>0){
            $('#timer_menu_button').show();
            $('#current_timer_count').html(timer_count);
        }else{
            $('#timer_menu_button').hide();
        }*/

        if(recur)setTimeout(function(){ucm.timer.tick(true);},500);
        ucm.timer.save_timers();// do this every second? sure!
    },
    now: function(){
        return Math.round(new Date().getTime() / 1000);
    },
    task_timer_clicked: function(task_timer_data){
        task_timer_data._process = 'task_timer_clicked';
        task_timer_data.form_auth_key = ucm.form_auth_key;
        $.post(
            ucm.timer.timer_ajax_url,
            task_timer_data,
            function(data){
                if(typeof data.timer != 'undefined'){
                    ucm.timer.init_timer(data.timer);
                }
            }
        );

    },
    automatic_page_timer: function(owner_table, owner_id){
        $.post(
            ucm.timer.timer_ajax_url,
            {
                _process: 'automatic_page_timer',
                form_auth_key: ucm.form_auth_key,
                owner_table: owner_table,
                owner_id: owner_id
            },
            function(data){
                if(typeof data.timers != 'undefined'){
                    for(var i in data.timers){
                        if(data.timers.hasOwnProperty(i)){
                            ucm.timer.init_timer(data.timers[i]);
                        }
                    }
                }
                setTimeout( function(){
                    ucm.timer.automatic_page_timer( owner_table, owner_id );
                }, 4000 );
            }
        );

    },
    init_timer: function(timer_data){
        // this will add or update an existing timer
        // data comes in from ajax.

        if( typeof timer_data.timer_display != 'undefined' ){
            $('[data-timer-field="duration"][data-timer-id="' + timer_data.timer_id + '"]').text( timer_data.timer_display );
        }

        timer_data.timer_start = ucm.timer.now() - timer_data.timer_length;

        // first we check if this is a new timer.
        var exists=0;
        for(var i in this.timers) {
            if (this.timers.hasOwnProperty(i)) {
                if ( typeof this.timers[i]['timer_id'] != 'undefined' && this.timers[i]['timer_id'] == timer_data.timer_id) {
                    exists = i;
                    for( var e in timer_data){
                        if(timer_data.hasOwnProperty(e)){
                            this.timers[i][e] = timer_data[e];
                        }
                    }
                    break;
                }
            }
        }

        if(!exists){
            this.timers.push(timer_data);
        }
        for(i in this.timers) {
            if (this.timers.hasOwnProperty(i)) {
                if ( typeof this.timers[i]['timer_id'] != 'undefined' && this.timers[i]['timer_id'] == timer_data.timer_id) {
                    exists = i;
                }
            }
        }
        if(!exists){
            return;
        }

        // find the ui element for this timer.
        if(typeof this.timers[exists].holder == 'undefined') {
            $timer_holder = $(this.timers[exists].selector);
            if ($timer_holder.length > 0) {

                if($timer_holder.next('.timer_counter').length){
                    console.log('Existing timer found for this item.');
                    return;
                }

                this.timers[exists].holder = $timer_holder;

                // this timer is on this page.
                $timer_holder.data('timer_data', this.timers[exists]);
                // update the ui for it.

                $timer_holder.show();
                var $timer_counter = $timer_holder.next('.timer_counter');

                if (!$timer_counter.length) {
                    $timer_counter = $('<span class="timer_counter"><span class="timer_number">00:00</span></span>');
                    $timer_holder.after($timer_counter);
                }

                $timer_counter.data('timer', this.timers[exists]);
                this.timers[exists].counter = $timer_counter;

            }
        }

        if( typeof this.timers[exists].counter != 'undefined' ) {
            if (typeof this.timers[exists].running != 'undefined' && this.timers[exists].running ) {
                // running.
                this.timers[exists].counter.addClass('timer-active');
            } else {
                this.timers[exists].counter.removeClass('timer-active');
            }
        }

    },
    load_page_timers_done: false,
    load_page_timers: function( owner_table, owner_id ){
        if(ucm.timer.load_page_timers_done){
            return;
        }
        ucm.timer.load_page_timers_done = true;
        // pull in all active/paused timers for this.
        ucm.set_var('timer_owner_table', owner_table);
        ucm.set_var('timer_owner_id', owner_id);

        $.post(
            ucm.timer.timer_ajax_url,
            {
                _process: 'load_page_timers',
                form_auth_key: ucm.form_auth_key,
                load_page_timers: {
                    owner_table: owner_table,
                    owner_id: owner_id
                }
            },
            function(data){
                if(typeof data.timers != 'undefined'){
                    for(var i in data.timers){
                        if(data.timers.hasOwnProperty(i)){
                            ucm.timer.init_timer(data.timers[i]);
                        }
                    }
                }
            }
        );

    },

    timer_delete: function(timer_object, from_server){

        for(var i in this.timers){
            if (this.timers.hasOwnProperty(i)) {
                if(this.timers[i].timer_id == timer_object.timer_id){

                    if( typeof timer_object.counter != 'undefined'){
                        timer_object.counter.remove();
                    }

                    if(from_server) {
                        // ajax delete timer.
                        ucm.timer.task_timer_clicked({
                            timer_id: timer_object.timer_id,
                            delete_completely: 1
                        });
                    }

                    delete(this.timers[i]);
                }
            }
        }

    },
    timer_finish: function(timer_object){


        ucm.timer.task_timer_clicked( {
            timer_id: timer_object.timer_id,
            finished: true
        } );

        if( timer_object['owner_table'] == 'job' && timer_object['owner_id'] && timer_object['owner_child_id']) {
            var job_id = timer_object['owner_id'];
            var task_id = timer_object['owner_child_id'];
            // if timer isn't finished, pause it now.
            edittask(task_id, null, function () {
                if (typeof $('#complete_t_' + task_id)[0] != 'undefined') {
                    // calculate how many hours this is in decimal
                    var time_decimal = timer_object['hours']; // eg: 0, 1, 2
                    if (timer_object['mins'] > 0) {
                        // 60 mins in an hour.
                        time_decimal += Math.floor((timer_object['mins'] / 60) * 100) / 100; // (eg: 0.25 for 15 mins)
                    }
                    // ignore seconds.
                    $('#complete_' + task_id).val(time_decimal);
                    $('#complete_t_' + task_id)[0].checked = true;
                } else {
                    alert('Failed to mark task as completed. Please try again.');
                }
            });
        }


        this.timer_delete(timer_object, false);
    },

    timer_hover: function(timerspan){
        var timer_object = $(timerspan).data('timer');
        $(timerspan).prepend('<div class="timer_hover">' +
            '<span class="timer_title">Timer</span>' +
            '<ul>' +
            '<li class="timer_number">'+ timer_object['timer_text'] +'</li>' +
            '</ul>' +
            '</div>');
        // add some buttons
console.log(timer_object);
        $(timerspan).find('.timer_hover ul').append($('<li class="timer_action" />').append($('<a href="#" class="timer_click">' + ( typeof timer_object['paused'] != 'undefined' && timer_object['paused'] ? 'Resume' : 'Pause') + '</a>').click(function(){
            ucm.timer.task_timer_clicked({
                timer_id: timer_object.timer_id
            });
            //ucm.timer.timer_hover(timerspan);
            $(timerspan).find('.timer_hover').remove();
            return false;
        })));
        // if we're in the header area then we don't show a 'record' button, just a view job button
        if($(timerspan).hasClass('timer_header')){
            //$(timerspan).find('.timer_hover ul').append($('<li class="timer_action" />').append($('<a href="'+timer_object['url']+'" class="timer_view">View Job</a>')));
        }else{
            $(timerspan).find('.timer_hover ul').append($('<li class="timer_action" />').append($('<a href="#" class="timer_finish">Finish</a>').click(function(){
                ucm.timer.timer_finish(timer_object);
                $(timerspan).find('.timer_hover').remove();
                return false;
            })));
        }
        $(timerspan).find('.timer_hover ul').append($('<li class="timer_action" />').append($('<a href="#" class="timer_cancel">Delete</a>').click(function(){
            if(confirm('Really delete this timer?')){
                ucm.timer.timer_delete(timer_object, true);
                $(timerspan).find('.timer_hover').remove();
            }
            return false;
        })));
        $(timerspan).on('mouseleave',function(){ $(timerspan).find('.timer_hover').remove(); });
    },

    link_to_dropdown: function( $textbox ){

        // this is called when the autocomplete textbox obtains focus
        // we dynamically change the lookuip box to search the appropriate link to object.

        var plugin = $('.timer_owner_table_change').val();
        if(plugin){
            ucm.set_var('timer_owner_table', plugin);
            var lookup = $textbox.data('lookup');
            /*lookup.plugin = plugin;
            $textbox.data('lookup', lookup);*/
        }

    },

    timer_object: function(){

        // this is the new timer we're using on the stopwatch.php page in the new timer section
        // I've adjusted some of the old code above to work with this new object, but more work needs to happen.

        var $timer_wrapper = false;

        var hours = minutes = seconds = milliseconds = 0;
        var prev_hours = prev_minutes = prev_seconds = prev_milliseconds = undefined;
        var timeUpdate;

        var totalOverallCounter = 0;

        // Start/Pause/Resume button onClick
        var $start_pause;

        // Update time in stopwatch periodically - every 25ms
        function updateTime(prev_hours, prev_minutes, prev_seconds, prev_milliseconds){
            var startTime = new Date();    // fetch current time

            timeUpdate = setInterval(function () {
                var timeElapsed = new Date().getTime() - startTime.getTime();    // calculate the time elapsed in milliseconds

                // calculate hours
                hours = parseInt(timeElapsed / 1000 / 60 / 60) + prev_hours;
                hours_total = parseInt( (timeElapsed + totalOverallCounter)  / 1000 / 60 / 60) + prev_hours;

                // calculate minutes
                minutes = parseInt(timeElapsed / 1000 / 60) + prev_minutes;
                if (minutes > 60) minutes %= 60;
                minutes_total = parseInt( ( timeElapsed + totalOverallCounter ) / 1000 / 60) + prev_minutes;
                if (minutes_total > 60) minutes_total %= 60;

                // calculate seconds
                seconds = parseInt(timeElapsed / 1000) + prev_seconds;
                if (seconds > 60) seconds %= 60;
                seconds_total = parseInt( ( timeElapsed + totalOverallCounter ) / 1000) + prev_seconds;
                if (seconds_total > 60) seconds_total %= 60;

                // calculate milliseconds
                // milliseconds = timeElapsed + prev_milliseconds;
                // if (milliseconds > 1000) milliseconds %= 1000;
                milliseconds = 0;

                // set the stopwatch
                setStopwatch(hours, minutes, seconds, milliseconds, hours_total, minutes_total, seconds_total);

            }, 200); // update time in stopwatch after every 25ms

        }

        // Set the time in stopwatch
        function setStopwatch(hours, minutes, seconds, milliseconds, hours_total, minutes_total, seconds_total){
            $timer_wrapper.find('.hours').html(prependZero(hours_total, 2));
            $timer_wrapper.find('.minutes').html(prependZero(minutes_total, 2));
            $timer_wrapper.find('.seconds').html(prependZero(seconds_total, 2));
            //$("#milliseconds").html(prependZero(milliseconds, 3));
            $('.ongoing-timer-segment').html( prependZero(hours, 2) + ':' + prependZero(minutes, 2) + ':' + prependZero(seconds, 2));
            $('.ongoing-total-time').html( prependZero(hours_total, 2) + ':' + prependZero(minutes_total, 2) + ':' + prependZero(seconds_total, 2));
        }

        // Prepend zeros to the digits in stopwatch
        function prependZero(time, length) {
            time = new String(time);    // stringify time
            return new Array(Math.max(length - time.length + 1, 0)).join("0") + time;
        }


        return {
            init: function($wrapper){
                $timer_wrapper = $wrapper;


                var totalSec = $timer_wrapper.data('duration');
                totalOverallCounter = parseInt( $timer_wrapper.data('total-time') * 1000 );
                // work out our js timer from this linux epoc time.
                var hours = parseInt( totalSec / 3600 ) % 24;
                var minutes = parseInt( totalSec / 60 ) % 60;
                var seconds = parseInt( totalSec % 60, 10);

                updateTime(hours,minutes,seconds,0);


                /*$start_pause = $timer_wrapper.find('.start_pause');
                $start_pause.click(function(){
                    // Start button
                    if(timer_status == 1){
                        timer_status = 2;
                        $(this).text(ucm.timer.lang.pause);
                        // todo - load in elapsed time from db:
                        updateTime(0,0,0,0);
                    }else if(timer_status == 2){
                        // timer is running, pause it.
                        clearInterval(timeUpdate);
                        timer_status = 3;
                        $(this).text(ucm.timer.lang.resume);
                    }else if(timer_status == 3){
                        // timer is paused.
                        // restart it from previous paused location.
                        prev_hours = parseInt($timer_wrapper.find('.hours').html());
                        prev_minutes = parseInt($timer_wrapper.find('.minutes').html());
                        prev_seconds = parseInt($timer_wrapper.find('.seconds').html());
                        // prev_milliseconds = parseInt($("#milliseconds").html());

                        updateTime(prev_hours, prev_minutes, prev_seconds, prev_milliseconds);

                        $(this).text(ucm.timer.lang.pause);
                    }
                });*/

                // Reset button onClick
                /*$timer_wrapper.find('.reset_time').click(function(){
                    if( confirm('Really?')) {
                        if (timeUpdate) clearInterval(timeUpdate);
                        setStopwatch(0, 0, 0, 0);
                        $start_pause.text(ucm.timer.lang.start);
                    }
                });
                $timer_wrapper.find('.timer_completed').click(function(){
                    // stop timer and save this as a timer segment.

                });*/
            }
        }
    }
};

$(function(){
    ucm.timer.init();
});

 // includes/plugin_subscription/js/subscription.js

ucm.subscription = {
    init: function(){
        $('.next_due_date_change').click(function(){
            $(this).after('<input type="text" name="subscription_next_due_date_change['+$(this).data('id')+']" value="'+$(this).text()+'" class="date_field">');
            $(this).hide();
            ucm.load_calendars();
        });
    }
};

jQuery(function(){
    ucm.subscription.init();
});

 // includes/plugin_social_twitter/js/social_twitter.js

ucm.social.twitter = {
    api_url: '',
    init: function(){

        $('body').delegate('.twitter_reply_button','click',function(){
            var f = $(this).parents('.twitter_comment').first().next('.twitter_comment_replies').find('.twitter_comment_reply_box');
            f.show();
            f.find('textarea')[0].focus();
        }).delegate('.twitter_comment_reply textarea','keyup',function(){
            var a = this;
            if (!$(a).prop('scrollTop')) {
                do {
                    var b = $(a).prop('scrollHeight');
                    var h = $(a).height();
                    $(a).height(h - 5);
                }
                while (b && (b != $(a).prop('scrollHeight')));
            }
            $(a).height($(a).prop('scrollHeight') + 10);
        }).delegate('.twitter_comment_reply button','click',function(){
            // send a message!
            var p = $(this).parent();
            var txt = $(p).find('textarea');
            if(txt.length > 0){
            var message = txt.val();
            if(message.length > 0){
                //txt[0].disabled = true;
                // show a loading message in place of the box..
                $.ajax({
                    url: ucm.social.twitter.api_url,
                    type: 'POST',
                    data: {
                        action: 'send-message-reply',
                        social_twitter_message_id: $(this).data('id'),
                        social_twitter_id: $(this).data('account-id'),
                        message: message,
                        debug: $(p).find('.reply-debug')[0].checked ? 1 : 0,
                        form_auth_key: ucm.form_auth_key
                    },
                    dataType: 'json',
                    success: function(r){
                        if(r && typeof r.redirect != 'undefined'){
                            window.location = r.redirect;
                        }else if(r && typeof r.message != 'undefined'){
                            p.html("Info: "+ r.message);
                        }else{
                            p.html("Unknown error, please try reconnecting to Twitter in settings. "+r);
                        }
                    }
                });
                    p.html('Sending... Please wait...');
            }
            }
            return false;
        }).delegate('.socialtwitter_message_action','click',
            ucm.social.twitter.message_action
        ).delegate('.twitter_comment_clickable','click',function(){
            ucm.social.open_modal($(this).data('link'), $(this).data('title'));
        });
        $('.twitter_message_summary a').click(function(){
            var p = $(this).parents('tr').first().find('.socialtwitter_message_open').click();
            return false;
        });
        /*$('.pagination_links a').click(function(){
            $(this).parents('.ui-tabs-panel').first().load($(this).attr('href'));
            return false;
        });*/


        jQuery('.twitter_compose_message').change(this.twitter_txt_change).keyup(this.twitter_txt_change).change();
        this.twitter_change_post_type();
        jQuery('[name=post_type]').change(this.twitter_change_post_type);

    },
    message_action: function(link){
        $.ajax({
            url: ucm.social.twitter.api_url,
            type: 'POST',
            data: {
                action: $(this).data('action'),
                social_twitter_message_id: jQuery(this).data('id'),
                social_twitter_id: $(this).data('social_twitter_id'),
                form_auth_key: ucm.form_auth_key
            },
            dataType: 'script',
            success: function(r){
                ucm.social.close_modal();
            }
        });
        return false;
    },
    twitter_limit: 140,
    twitter_set_limit: function(limit){
        ucm.social.twitter.twitter_limit = limit;
        jQuery('.twitter_compose_message').change();
    },
    charactersleft: function(tweet, limit) {
        var url, i, lenUrlArr;
        var virtualTweet = tweet;
        var filler = "0123456789012345678912";
        var extractedUrls = twttr.txt.extractUrlsWithIndices(tweet);
        var remaining = limit;
        lenUrlArr = extractedUrls.length;
        if ( lenUrlArr > 0 ) {
            for (i = 0; i < lenUrlArr; i++) {
                url = extractedUrls[i].url;
                virtualTweet = virtualTweet.replace(url,filler);
            }
        }
        remaining = remaining - virtualTweet.length;
        return remaining;
    },
    twitter_txt_change: function(){
        var remaining = ucm.social.twitter.charactersleft(jQuery(this).val(), ucm.social.twitter.twitter_limit);
        jQuery(this).parent().find('.twitter_characters_remain').first().find('span').text(remaining);
    },
    twitter_change_post_type: function(){
        var currenttype = jQuery('[name=post_type]:checked').val();
        jQuery('.twitter-type-option').each(function(){
            jQuery(this).parents('tr').first().hide();
        });
        jQuery('.twitter-type-'+currenttype).each(function(){
            jQuery(this).parents('tr').first().show();
        });
        if(currenttype == 'picture'){
            ucm.social.twitter.twitter_set_limit(118);
        }else{
            ucm.social.twitter.twitter_set_limit(140);
        }
    }
};

 // includes/plugin_job_discussion/js/job_discussion.js

$(function(){
    $('body').delegate('.task_job_discussion','click',function(){
        var holder = $(this).parents('td:first').find('.task_job_discussion_holder');
        holder.load($(this).attr('href'),function(){
            holder.toggle();
        });
        return false;
    });
    $('body').delegate('.task_job_discussion_add','click',function(){

        var job_id = $(this).data('jobid');
        var task_id = $(this).data('taskid');
        var holder = $(this).parents('td:first').find('.task_job_discussion_holder');
        var sendemail_customer = [];
        var sendemail_staff = [];
        if(typeof $(this).parent('div').find('.sendemail_customer')[0] != 'undefined'){
            $(this).parent('div').find('.sendemail_customer').each(function(){
                if($(this)[0].checked){
                    sendemail_customer.push($(this).val());
                }
            });
        }
        if(typeof $(this).parent('div').find('.sendemail_staff')[0] != 'undefined'){
            $(this).parent('div').find('.sendemail_staff').each(function(){
                if($(this)[0].checked){
                    sendemail_staff.push($(this).val());
                }
            });
        }
        $.ajax({
            type: 'POST',
            url: window.location.href, //$(this).attr('post_url'),
            data: {
                'note': $(this).parent('div').find('textarea').val(),
                'job_discussion_add_job_id': job_id,
                'job_discussion_add_task_id': task_id,
                'sendemail_customer': sendemail_customer,
                'sendemail_staff': sendemail_staff
            },
            dataType: 'json',
            success: function(h){
               var btn = $(holder).parents('td:first').find('.task_job_discussion');
                if(btn.length>0){
                    btn.click();
                    /*var count = parseInt(btn.html());
                    if(!count)count = 0;
                    count = count + 1;*/
                    btn.find('span').html(h.count);
                }
            },
            fail: function(){
                alert('Something went wrong, try again');
            }
        });
        holder.html('Loading...');
        return false;
    });
});

 // includes/plugin_encrypt/js/sjcl.js

"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
if(typeof module!="undefined"&&module.exports)module.exports=sjcl;
sjcl.cipher.aes=function(a){this.h[0][0][0]||this.w();var b,c,d,e,f=this.h[0][4],g=this.h[1];b=a.length;var h=1;if(b!==4&&b!==6&&b!==8)throw new sjcl.exception.invalid("invalid aes key size");this.a=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(a%b===0||b===8&&a%b===4){c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255];if(a%b===0){c=c<<8^c>>>24^h<<24;h=h<<1^(h>>7)*283}}d[a]=d[a-b]^c}for(b=0;a;b++,a--){c=d[b&3?a:a-4];e[b]=a<=4||b<4?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^
g[3][f[c&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(a){return this.H(a,0)},decrypt:function(a){return this.H(a,1)},h:[[[],[],[],[],[]],[[],[],[],[],[]]],w:function(){var a=this.h[0],b=this.h[1],c=a[4],d=b[4],e,f,g,h=[],i=[],k,j,l,m;for(e=0;e<0x100;e++)i[(h[e]=e<<1^(e>>7)*283)^e]=e;for(f=g=0;!c[f];f^=k||1,g=i[g]||1){l=g^g<<1^g<<2^g<<3^g<<4;l=l>>8^l&255^99;c[f]=l;d[l]=f;j=h[e=h[k=h[f]]];m=j*0x1010101^e*0x10001^k*0x101^f*0x1010100;j=h[l]*0x101^l*0x1010100;for(e=0;e<4;e++){a[e][f]=j=j<<24^j>>>8;b[e][l]=m=m<<24^m>>>8}}for(e=
0;e<5;e++){a[e]=a[e].slice(0);b[e]=b[e].slice(0)}},H:function(a,b){if(a.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var c=this.a[b],d=a[0]^c[0],e=a[b?3:1]^c[1],f=a[2]^c[2];a=a[b?1:3]^c[3];var g,h,i,k=c.length/4-2,j,l=4,m=[0,0,0,0];g=this.h[b];var n=g[0],o=g[1],p=g[2],q=g[3],r=g[4];for(j=0;j<k;j++){g=n[d>>>24]^o[e>>16&255]^p[f>>8&255]^q[a&255]^c[l];h=n[e>>>24]^o[f>>16&255]^p[a>>8&255]^q[d&255]^c[l+1];i=n[f>>>24]^o[a>>16&255]^p[d>>8&255]^q[e&255]^c[l+2];a=n[a>>>24]^o[d>>16&
255]^p[e>>8&255]^q[f&255]^c[l+3];l+=4;d=g;e=h;f=i}for(j=0;j<4;j++){m[b?3&-j:j]=r[d>>>24]<<24^r[e>>16&255]<<16^r[f>>8&255]<<8^r[a&255]^c[l++];g=d;d=e;e=f;f=a;a=g}return m}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===undefined?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(a.length===0||b.length===0)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return d===32?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;
if(b===0)return 0;return(b-1)*32+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(a.length*32<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;if(c>0&&b)a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1);return a},partial:function(a,b,c){if(a===32)return b;return(c?b|0:b<<32-a)+a*0x10000000000},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=
a[d]^b[d];return c===0},P:function(a,b,c,d){var e;e=0;if(d===undefined)d=[];for(;b>=32;b-=32){d.push(c);c=0}if(b===0)return d.concat(a);for(e=0;e<a.length;e++){d.push(c|a[e]>>>b);c=a[e]<<32-b}e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,b+a>32?c:d.pop(),1));return d},k:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b+=String.fromCharCode(e>>>24);e<<=8}return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a.charCodeAt(c);if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,d*4)}};
sjcl.codec.base64={D:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.D,g=0,h=sjcl.bitArray.bitLength(a);if(c)f=f.substr(0,62)+"-_";for(c=0;d.length*6<h;){d+=f.charAt((g^a[c]>>>e)>>>26);if(e<6){g=a[c]<<6-e;e+=26;c++}else{g<<=6;e-=6}}for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d=0,e=sjcl.codec.base64.D,f=0,g;if(b)e=e.substr(0,62)+"-_";for(b=0;b<a.length;b++){g=e.indexOf(a.charAt(b));
if(g<0)throw new sjcl.exception.invalid("this isn't base64!");if(d>26){d-=26;c.push(f^g>>>d);f=g<<32-d}else{d+=6;f^=g<<32-d}}d&56&&c.push(sjcl.bitArray.partial(d&56,f,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.a[0]||this.w();if(a){this.n=a.n.slice(0);this.i=a.i.slice(0);this.e=a.e}else this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.n=this.N.slice(0);this.i=[];this.e=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.i=sjcl.bitArray.concat(this.i,a);b=this.e;a=this.e=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.C(c.splice(0,16));return this},finalize:function(){var a,b=this.i,c=this.n;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.e/
4294967296));for(b.push(this.e|0);b.length;)this.C(b.splice(0,16));this.reset();return c},N:[],a:[],w:function(){function a(e){return(e-Math.floor(e))*0x100000000|0}var b=0,c=2,d;a:for(;b<64;c++){for(d=2;d*d<=c;d++)if(c%d===0)continue a;if(b<8)this.N[b]=a(Math.pow(c,0.5));this.a[b]=a(Math.pow(c,1/3));b++}},C:function(a){var b,c,d=a.slice(0),e=this.n,f=this.a,g=e[0],h=e[1],i=e[2],k=e[3],j=e[4],l=e[5],m=e[6],n=e[7];for(a=0;a<64;a++){if(a<16)b=d[a];else{b=d[a+1&15];c=d[a+14&15];b=d[a&15]=(b>>>7^b>>>18^
b>>>3^b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0}b=b+n+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(m^j&(l^m))+f[a];n=m;m=l;l=j;j=k+b|0;k=i;i=h;h=g;g=b+(h&i^k&(h^i))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0}e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+i|0;e[3]=e[3]+k|0;e[4]=e[4]+j|0;e[5]=e[5]+l|0;e[6]=e[6]+m|0;e[7]=e[7]+n|0}};
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,i=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];if(i<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;f<4&&k>>>8*f;f++);if(f<15-i)f=15-i;c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.G(a,b,c,d,e,f);g=sjcl.mode.ccm.I(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),i=f.clamp(b,h-e),k=f.bitSlice(b,
h-e);h=(h-e)/8;if(g<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;b<4&&h>>>8*b;b++);if(b<15-g)b=15-g;c=f.clamp(c,8*(15-b));i=sjcl.mode.ccm.I(a,i,c,k,e,b);a=sjcl.mode.ccm.G(a,i.data,c,d,e,b);if(!f.equal(i.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");return i.data},G:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,i=h.k;e/=8;if(e%2||e<4||e>16)throw new sjcl.exception.invalid("ccm: invalid tag length");if(d.length>0xffffffff||b.length>0xffffffff)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;if(c<=65279)g=[h.partial(16,c)];else if(c<=0xffffffff)g=h.concat([h.partial(16,65534)],[c]);g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(i(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(i(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,e*8)},I:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.k;var i=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!i)return{tag:d,data:[]};for(g=0;g<i;g+=4){c[3]++;e=a.encrypt(c);b[g]^=e[0];b[g+1]^=e[1];b[g+2]^=e[2];b[g+3]^=e[3]}return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.A,i=sjcl.bitArray,k=i.k,j=[0,0,0,0];c=h(a.encrypt(c));var l,m=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4){l=b.slice(g,g+4);j=k(j,l);m=m.concat(k(c,a.encrypt(k(c,l))));c=h(c)}l=b.slice(g);b=i.bitLength(l);g=a.encrypt(k(c,[0,0,0,b]));l=i.clamp(k(l.concat([0,0,0]),g),b);j=k(j,k(l.concat([0,0,0]),g));j=a.encrypt(k(j,k(c,h(c))));
if(d.length)j=k(j,f?d:sjcl.mode.ocb2.pmac(a,d));return m.concat(i.concat(l,i.clamp(j,e)))},decrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.A,h=sjcl.bitArray,i=h.k,k=[0,0,0,0],j=g(a.encrypt(c)),l,m,n=sjcl.bitArray.bitLength(b)-e,o=[];d=d||[];for(c=0;c+4<n/32;c+=4){l=i(j,a.decrypt(i(j,b.slice(c,c+4))));k=i(k,l);o=o.concat(l);j=g(j)}m=n-c*32;l=a.encrypt(i(j,[0,0,0,m]));l=i(l,h.clamp(b.slice(c),
m).concat([0,0,0]));k=i(k,l);k=a.encrypt(i(k,i(j,g(j))));if(d.length)k=i(k,f?d:sjcl.mode.ocb2.pmac(a,d));if(!h.equal(h.clamp(k,e),h.bitSlice(b,n)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return o.concat(h.clamp(l,m))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.A,e=sjcl.bitArray,f=e.k,g=[0,0,0,0],h=a.encrypt([0,0,0,0]);h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4){h=d(h);g=f(g,a.encrypt(f(h,b.slice(c,c+4))))}b=b.slice(c);if(e.bitLength(b)<128){h=f(h,d(h));b=e.concat(b,[2147483648|0,0,
0,0])}g=f(g,b);return a.encrypt(f(d(f(h,d(h))),g))},A:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^(a[0]>>>31)*135]}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d=b.prototype.blockSize/32;this.l=[new b,new b];if(a.length>d)a=b.hash(a);for(b=0;b<d;b++){c[0][b]=a[b]^909522486;c[1][b]=a[b]^1549556828}this.l[0].update(c[0]);this.l[1].update(c[1])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a,b){a=(new this.M(this.l[0])).update(a,b).finalize();return(new this.M(this.l[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(d<0||c<0)throw sjcl.exception.invalid("invalid params to pbkdf2");if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,i,k=[],j=sjcl.bitArray;for(i=1;32*k.length<(d||1);i++){e=f=a.encrypt(j.concat(b,[i]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}if(d)k=j.clamp(k,d);return k};
sjcl.random={randomWords:function(a,b){var c=[];b=this.isReady(b);var d;if(b===0)throw new sjcl.exception.notReady("generator isn't seeded");else b&2&&this.U(!(b&1));for(b=0;b<a;b+=4){(b+1)%0x10000===0&&this.L();d=this.u();c.push(d[0],d[1],d[2],d[3])}this.L();return c.slice(0,a)},setDefaultParanoia:function(a){this.t=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.q[c],h=this.isReady();d=this.F[c];if(d===undefined)d=this.F[c]=this.R++;if(g===undefined)g=this.q[c]=0;this.q[c]=
(this.q[c]+1)%this.b.length;switch(typeof a){case "number":break;case "object":if(b===undefined)for(c=b=0;c<a.length;c++)for(e=a[c];e>0;){b++;e>>>=1}this.b[g].update([d,this.J++,2,b,f,a.length].concat(a));break;case "string":if(b===undefined)b=a.length;this.b[g].update([d,this.J++,3,b,f,a.length]);this.b[g].update(a);break;default:throw new sjcl.exception.bug("random: addEntropy only supports number, array or string");}this.j[g]+=b;this.f+=b;if(h===0){this.isReady()!==0&&this.K("seeded",Math.max(this.g,
this.f));this.K("progress",this.getProgress())}},isReady:function(a){a=this.B[a!==undefined?a:this.t];return this.g&&this.g>=a?this.j[0]>80&&(new Date).valueOf()>this.O?3:1:this.f>=a?2:0},getProgress:function(a){a=this.B[a?a:this.t];return this.g>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.m){if(window.addEventListener){window.addEventListener("load",this.o,false);window.addEventListener("mousemove",this.p,false)}else if(document.attachEvent){document.attachEvent("onload",this.o);
document.attachEvent("onmousemove",this.p)}else throw new sjcl.exception.bug("can't attach event");this.m=true}},stopCollectors:function(){if(this.m){if(window.removeEventListener){window.removeEventListener("load",this.o,false);window.removeEventListener("mousemove",this.p,false)}else if(window.detachEvent){window.detachEvent("onload",this.o);window.detachEvent("onmousemove",this.p)}this.m=false}},addEventListener:function(a,b){this.r[a][this.Q++]=b},removeEventListener:function(a,b){var c;a=this.r[a];
var d=[];for(c in a)a.hasOwnProperty(c)&&a[c]===b&&d.push(c);for(b=0;b<d.length;b++){c=d[b];delete a[c]}},b:[new sjcl.hash.sha256],j:[0],z:0,q:{},J:0,F:{},R:0,g:0,f:0,O:0,a:[0,0,0,0,0,0,0,0],d:[0,0,0,0],s:undefined,t:6,m:false,r:{progress:{},seeded:{}},Q:0,B:[0,48,64,96,128,192,0x100,384,512,768,1024],u:function(){for(var a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}return this.s.encrypt(this.d)},L:function(){this.a=this.u().concat(this.u());this.s=new sjcl.cipher.aes(this.a)},T:function(a){this.a=
sjcl.hash.sha256.hash(this.a.concat(a));this.s=new sjcl.cipher.aes(this.a);for(a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}},U:function(a){var b=[],c=0,d;this.O=b[0]=(new Date).valueOf()+3E4;for(d=0;d<16;d++)b.push(Math.random()*0x100000000|0);for(d=0;d<this.b.length;d++){b=b.concat(this.b[d].finalize());c+=this.j[d];this.j[d]=0;if(!a&&this.z&1<<d)break}if(this.z>=1<<this.b.length){this.b.push(new sjcl.hash.sha256);this.j.push(0)}this.f-=c;if(c>this.g)this.g=c;this.z++;this.T(b)},p:function(a){sjcl.random.addEntropy([a.x||
a.clientX||a.offsetX,a.y||a.clientY||a.offsetY],2,"mouse")},o:function(){sjcl.random.addEntropy(new Date,2,"loadtime")},K:function(a,b){var c;a=sjcl.random.r[a];var d=[];for(c in a)a.hasOwnProperty(c)&&d.push(a[c]);for(c=0;c<d.length;c++)d[c](b)}};try{var s=new Uint32Array(32);crypto.getRandomValues(s);sjcl.random.addEntropy(s,1024,"crypto['getRandomValues']")}catch(t){}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.c({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.c(f,c);c=f.adata;if(typeof f.salt==="string")f.salt=sjcl.codec.base64.toBits(f.salt);if(typeof f.iv==="string")f.iv=sjcl.codec.base64.toBits(f.iv);if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||typeof a==="string"&&f.iter<=100||f.ts!==64&&f.ts!==96&&f.ts!==128||f.ks!==128&&f.ks!==192&&f.ks!==0x100||f.iv.length<
2||f.iv.length>4)throw new sjcl.exception.invalid("json encrypt: invalid parameters");if(typeof a==="string"){g=sjcl.misc.cachedPbkdf2(a,f);a=g.key.slice(0,f.ks/32);f.salt=g.salt}if(typeof b==="string")b=sjcl.codec.utf8String.toBits(b);if(typeof c==="string")c=sjcl.codec.utf8String.toBits(c);g=new sjcl.cipher[f.cipher](a);e.c(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return e.encode(f)},decrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.c(e.c(e.c({},e.defaults),e.decode(b)),
c,true);var f;c=b.adata;if(typeof b.salt==="string")b.salt=sjcl.codec.base64.toBits(b.salt);if(typeof b.iv==="string")b.iv=sjcl.codec.base64.toBits(b.iv);if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||typeof a==="string"&&b.iter<=100||b.ts!==64&&b.ts!==96&&b.ts!==128||b.ks!==128&&b.ks!==192&&b.ks!==0x100||!b.iv||b.iv.length<2||b.iv.length>4)throw new sjcl.exception.invalid("json decrypt: invalid parameters");if(typeof a==="string"){f=sjcl.misc.cachedPbkdf2(a,b);a=f.key.slice(0,b.ks/32);b.salt=f.salt}if(typeof c===
"string")c=sjcl.codec.utf8String.toBits(c);f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.c(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+
sjcl.codec.base64.fromBits(a[b],1)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");b[d[2]]=
d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4])}return b},c:function(a,b,c){if(a===undefined)a={};if(b===undefined)return a;var d;for(d in b)if(b.hasOwnProperty(d)){if(c&&a[d]!==undefined&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},W:function(a,b){var c={},d;for(d in a)if(a.hasOwnProperty(d)&&a[d]!==b[d])c[d]=a[d];return c},V:function(a,b){var c={},d;for(d=0;d<b.length;d++)if(a[b[d]]!==undefined)c[b[d]]=
a[b[d]];return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.S={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.S,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===undefined?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};


 // includes/plugin_encrypt/js/encrypt.js

$(function(){
    $('span.encrypt_create').each(function(){
        var r = $(this);
        r.hide();
        r.parent('td').first().hover(function(){r.show();},function(){r.hide();});
        r.parent('.form-control').first().hover(function(){r.show();},function(){r.hide();});
    });
    $('span.encrypt_popup').each(function(){
        var r = $(this);
        r.hide();
        r.parent('td').first().hover(function(){r.show();},function(){r.hide();});
        r.parent('.form-control').first().hover(function(){r.show();},function(){r.hide();});
    });
});

 // includes/plugin_email/js/email.js

var ucm = ucm || {};
ucm.email = {
    settings: {
    },
    init: function(){


    }
};
$(function(){
    ucm.email.init();
});


 // includes/plugin_data/js/data.js

ucm = ucm || {};

ucm.data = {
    lang: {
        Save: 'Save',
        Cancel: 'Cancel'
    },
    settings: {
        url: '?m=data&p=admin_data&display_mode=iframe'
    },
    init: function(){
        var t = this;
        setTimeout(function(){
            $('.custom_data_embed_wrapper .tableclass_rows tr').each(function(){
                $(this).off('click');
            });
        },700);
        $('.custom_data_open').click(function(e){
            var btn = this;
            t.popup_init(btn);
            var url = $.param($(btn).data('settings'));
            e.preventDefault();
            $("#data_popup").dialog({
                autoOpen: true,
                height: 800,
                width: 800,
                modal: true,
                buttons: {
                    'Close': function() {
                        $(this).dialog('close');
                    }
                },
                open: function() {
                    $('#data_popup_inner iframe').attr('src',ucm.data.settings.url + '&' + url);
                }
            });
            return false;
        });

    },
    popup_init: function(btn){
        $('#data_popup').remove();
        var settings = $(btn).parents('.custom_data_embed_wrapper').first().data('settings');
        if(!settings)return;
        $('body').append('<div id="data_popup" title="' + (typeof settings.title != 'undefined' ? settings.title : '') + '"><div id="data_popup_inner" style="height: 100%; position: relative;"><iframe src="about:blank" style="width:100%; height:100%; border:0" frameborder="0"></iframe> </div></div>');
        return $.param(settings);
    },
    popup: function(btn){
        var url = this.popup_init(btn);
        $("#data_popup").dialog({
            autoOpen: true,
            height: 800,
            width: 800,
            modal: true,
            buttons: {
                'Close': function() {
                    $(this).dialog('close');
                }
            },
            open: function() {
                $('#data_popup_inner iframe').attr('src',ucm.data.settings.url + '&' + url);
            }
        });
        return false;
    },
    popup_new: function(btn){
        var url = this.popup_init(btn);
        $("#data_popup").dialog({
            autoOpen: true,
            height: 800,
            width: 800,
            modal: true,
            buttons: {
                'Close': function() {
                    $(this).dialog('close');
                }
            },
            open: function() {
                $('#data_popup_inner iframe').attr('src',ucm.data.settings.url + '&' + url + '&data_record_id=new');
            }
        });
        return false;
    }
};

$(function(){ucm.data.init();});

 // includes/plugin_config/js/settings.js

ucm.settings_popup = {
    init: function(){
        // hunt for any elements that contain data-settings-url attributes and insert a new icon url into the container?
        $("[data-settings-url!=''][data-settings-url]").each(function(){
            $(this).prepend('<span class="data-settings-button ' + $(this).data('settings-class') + '"><a href="' + $(this).data('settings-url') + '" target="_blank">Settings</a></span>');
        });
    }
};
$(function(){
  ucm.settings_popup.init();
});


 // includes/plugin_customer/js/customer.js

var ucm = ucm || {};
ucm.customer = {
    settings: {
        ajax_url: '',
        loading: 'Loading...',
        choose: ' - Choose - '
    },
    init: function(){
        $(".dynamic_customer_selection").each(function(){
            var $t = $(this);
            var $cid = $t.find('.change_customer_id_input');
            var old_customer_id = $cid.val();
            $t.find('.choose_new_customer').click(function(){
                $t.addClass('selecting');
            });
            $t.find('.dynamic_choose_customer_type').change(function(){
                // ajax call to find list of available customer types.
                var customer_type_id = $(this).val();
                $t.find('.choose_customer_select').html(ucm.customer.settings.loading);
                if(customer_type_id == '')return;
                if(!ucm.customer.settings.ajax_url){
                    alert('Failed to find customer ajax url. Please report this issue.');
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: ucm.customer.settings.ajax_url,
                    data: {
                        '_process': 'ajax_customer_list',
                        'customer_id': $cid.val(),
                        form_auth_key: ucm.form_auth_key,
                        'search': {
                            'customer_type_id': customer_type_id
                        }
                    },
                    dataType: 'json',
                    success: function(newOptions){
                        var $newSelect = $('<select></select>');
                        $newSelect.append($("<option></option>")
                            .attr("value", '').text(ucm.customer.settings.choose));
                        $.each(newOptions, function(value, key) {
                            $newSelect.append($("<option></option>")
                                .attr("value", value).text(key));
                        });
                        $t.find('.choose_customer_select').html('');
                        $newSelect.appendTo($t.find('.choose_customer_select'));
                        $newSelect.change(function(){
                            $cid.val($(this).val());
                            $( "body" ).trigger( "customer_id_changed", {
                                changer:$t,
                                old_customer_id:old_customer_id,
                                customer_id:$(this).val()
                            });
                        });
                    },
                    fail: function(){
                        alert('Changing customer failed, please refresh and try again.');
                    }
                });
            });
        });
    }
};
$(function(){
    ucm.customer.init();
});


 // includes/plugin_job/js/tasks.js

ucm.job = {

    ajax_task_url: '',
    create_invoice_popup_url: '',
    create_invoice_url: '',

    // init called from the job edit page
    init: function(){
        var t = this;
        $('body').delegate('.task_percentage_toggle','click',function(){
            var task_id = $(this).data('task-id');
            $.ajax({
                url: t.ajax_task_url,
                data: {
                    task_id:task_id,
                    toggle_completed: true
                },
                type: 'POST',
                dataType: 'json',
                success: function(r){
                    if(typeof r.message != 'undefined'){
                        ucm.add_message(r.message);
                        ucm.display_messages(true);
                    }
                    refresh_task_preview(task_id);
                }
            });
        }).delegate('.task_completed_checkbox','change',function(){
            $(this).parent().find('.task_email_auto_option').show();
        });
        $('#job_generate_invoice_button').click(function(){
            t.generate_invoice($(this).text());
            return false;
        });
        t.update_job_tax();
    },
    toggle_task_complete: function(task_id){

    },
    generate_invoice_done: false,
    generate_invoice: function(title){
        var t = this;

        $('#create_invoice_options_inner').load(t.create_invoice_popup_url,function(){
            $('#create_invoice_options').dialog({
                autoOpen: true,
                height: 560,
                width: 350,
                modal: true,
                title: title,
                buttons: {
                    Create: function() {
                        var url = t.create_invoice_url;
                        var items = $('.invoice_create_task:checked');
                        if(items.length>0){
                            items.each(function(){
                                url += '&task_id[]=' + $(this).data('taskid');
                            });
                            window.location.href=url;
                        }else{
                            $(this).dialog('close');
                        }
                    }
                }
            });
        });
    },

    update_job_tax: function(){
        if($('#job_tax_holder .dynamic_block').length > 1)$('.job_tax_increment').show(); else $('.job_tax_increment').hide();
    }
};



 // includes/plugin_extra/js/extra.js

function extra_process_url(){
    var u = $(this).val().match(/https?:\/\/.*$/);
    if(u){
        $(this).parent().find('.extra_link_click').remove();
        $(this).after(' <a href="'+u+'" target="_blank" class="extra_link_click">open &raquo;</a>');
    }else{

    }
}
function extra_show_fields(e){
    e.preventDefault();
    $('.extra_fields_show_more').hide();
    $('.extra_field_row_hidden').show();
    return false;
}
$(function(){
    $(document).on('click','.extra_fields_show_button',extra_show_fields);
    $(document).on('change','.extra_value_input',extra_process_url);
    $('.extra_value_input').each(extra_process_url);
});

 // includes/plugin_help/js/help.js

ucm = ucm || {};
ucm.help = {
    current_pages: '',
    current_modules: '',
    url_extras: '',
    url_help: 'https://ultimateclientmanager.com/api/help.php?',
    lang: {
        'loading': 'Loading',
        'help': 'Help'
    },
    init: function(){
        var t = this;
        $('body').append('<div id="help_popup" style="display:none;"> <div class="help_popup_wrapper">' + t.lang.loading + ' </div></div>');

        $('#header_help').click(function(){
            ucm.form.open_modal({
                type: "inline",
                content: "#help_popup",
                title: ucm.help.lang.help,
                load_callback: function($modal){
                    $modal.find('.help_popup_wrapper').html('<iframe src="' + ucm.help.url_help + 'pages=' + ucm.help.current_pages + '&modules=' + ucm.help.current_modules + ucm.help.url_extras + '" id="ghelp_iframe" frameborder="0"  ></iframe>');
                }

            });
            return false;
        });
    }
};


$(function(){ucm.help.init();});

 // includes/plugin_invoice/js/invoice.js

ucm.invoice = {
    init: function(){
         this.update_invoice_tax();
        var c = function(e){
            var chk = $(e.target);
            if(chk.hasClass('payment_method_online')){
                $('.payment_type_online').show();
                $('.payment_type_offline').hide();
            }else{
                $('#payment_type_offline_info').html($('#text_'+chk.attr('id')).val());
                $('.payment_type_offline').show();
                $('.payment_type_online').hide();
            }
        };
        c({target:$('.payment_method:checked')[0]});
        $('.payment_method').change(c).mouseup(c);
    },
    update_invoice_tax: function(){
        if($('#invoice_tax_holder .dynamic_block').length > 1)$('.invoice_tax_increment').show(); else $('.invoice_tax_increment').hide();
    }
};

 // includes/plugin_file/js/featherlight.js

/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 1.3.4 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2015, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.'); }
		return;
	}

	/* Featherlight is exported as $.featherlight.
	   It is a function used to open a featherlight lightbox.

	   [tech]
	   Featherlight uses prototype inheritance.
	   Each opened lightbox will have a corresponding object.
	   That object may have some attributes that override the
	   prototype's.
	   Extensions created with Featherlight.extend will have their
	   own prototype that inherits from Featherlight's prototype,
	   thus attributes can be overriden either at the object level,
	   or at the extension level.
	   To create callbacks that chain themselves instead of overriding,
	   use chainCallbacks.
	   For those familiar with CoffeeScript, this correspond to
	   Featherlight being a class and the Gallery being a class
	   extending Featherlight.
	   The chainCallbacks is used since we don't have access to
	   CoffeeScript's `super`.
	*/

	function Featherlight($content, config) {
		if(this instanceof Featherlight) {  /* called with new */
			this.id = Featherlight.id++;
			this.setup($content, config);
			this.chainCallbacks(Featherlight._callbackChain);
		} else {
			var fl = new Featherlight($content, config);
			fl.open();
			return fl;
		}
	}

	var opened = [],
		pruneOpened = function(remove) {
			opened = $.grep(opened, function(fl) {
				return fl !== remove && fl.$instance.closest('body').length > 0;
			} );
			return opened;
		};

	// structure({iframeMinHeight: 44, foo: 0}, 'iframe')
	//   #=> {min-height: 44}
	var structure = function(obj, prefix) {
		var result = {},
			regex = new RegExp('^' + prefix + '([A-Z])(.*)');
		for (var key in obj) {
			var match = key.match(regex);
			if (match) {
				var dasherized = (match[1] + match[2].replace(/([A-Z])/g, '-$1')).toLowerCase();
				result[dasherized] = obj[key];
			}
		}
		return result;
	};

	/* document wide key handler */
	var eventMap = { keyup: 'onKeyUp', resize: 'onResize' };

	var globalEventHandler = function(event) {
		$.each(Featherlight.opened().reverse(), function() {
			if (!event.isDefaultPrevented()) {
				if (false === this[eventMap[event.type]](event)) {
					event.preventDefault(); event.stopPropagation(); return false;
			  }
			}
		});
	};

	var toggleGlobalEvents = function(set) {
			if(set !== Featherlight._globalHandlerInstalled) {
				Featherlight._globalHandlerInstalled = set;
				var events = $.map(eventMap, function(_, name) { return name+'.'+Featherlight.prototype.namespace; } ).join(' ');
				$(window)[set ? 'on' : 'off'](events, globalEventHandler);
			}
		};

	Featherlight.prototype = {
		constructor: Featherlight,
		/*** defaults ***/
		/* extend featherlight with defaults and methods */
		namespace:    'featherlight',         /* Name of the events and css class prefix */
		targetAttr:   'data-featherlight',    /* Attribute of the triggered element that contains the selector to the lightbox content */
		variant:      null,                   /* Class that will be added to change look of the lightbox */
		resetCss:     false,                  /* Reset all css */
		background:   null,                   /* Custom DOM for the background, wrapper and the closebutton */
		openTrigger:  'click',                /* Event that triggers the lightbox */
		closeTrigger: 'click',                /* Event that triggers the closing of the lightbox */
		filter:       null,                   /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
		root:         'body',                 /* Where to append featherlights */
		openSpeed:    250,                    /* Duration of opening animation */
		closeSpeed:   250,                    /* Duration of closing animation */
		closeOnClick: 'background',           /* Close lightbox on click ('background', 'anywhere' or false) */
		closeOnEsc:   true,                   /* Close lightbox when pressing esc */
		closeIcon:    '&#10005;',             /* Close icon */
		loading:      '',                     /* Content to show while initial content is loading */
		persist:      false,									/* If set, the content persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
		otherClose:   null,                   /* Selector for alternate close buttons (e.g. "a.close") */
		beforeOpen:   $.noop,                 /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		beforeContent: $.noop,                /* Called when content is loaded. Gets event as parameter, this contains all data */
		beforeClose:  $.noop,                 /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		afterOpen:    $.noop,                 /* Called after open. Gets event as parameter, this contains all data */
		afterContent: $.noop,                 /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
		afterClose:   $.noop,                 /* Called after close. Gets event as parameter, this contains all data */
		onKeyUp:      $.noop,                 /* Called on key down for the frontmost featherlight */
		onResize:     $.noop,                 /* Called after new content and when a window is resized */
		type:         null,                   /* Specify type of lightbox. If unset, it will check for the targetAttrs value. */
		contentFilters: ['jquery', 'image', 'html', 'ajax', 'iframe', 'text'], /* List of content filters to use to determine the content */

		/*** methods ***/
		/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
		setup: function(target, config){
			/* all arguments are optional */
			if (typeof target === 'object' && target instanceof $ === false && !config) {
				config = target;
				target = undefined;
			}

			var self = $.extend(this, config, {target: target}),
				css = !self.resetCss ? self.namespace : self.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
				$background = $(self.background || [
					'<div class="'+css+'-loading '+css+'">',
						'<div class="'+css+'-content">',
							'<span class="'+css+'-close-icon '+ self.namespace + '-close">',
								self.closeIcon,
							'</span>',
							'<div class="'+self.namespace+'-inner">' + self.loading + '</div>',
						'</div>',
					'</div>'].join('')),
				closeButtonSelector = '.'+self.namespace+'-close' + (self.otherClose ? ',' + self.otherClose : '');

			self.$instance = $background.clone().addClass(self.variant); /* clone DOM for the background, wrapper and the close button */

			/* close when click on background/anywhere/null or closebox */
			self.$instance.on(self.closeTrigger+'.'+self.namespace, function(event) {
				var $target = $(event.target);
				if( ('background' === self.closeOnClick  && $target.is('.'+self.namespace))
					|| 'anywhere' === self.closeOnClick
					|| $target.closest(closeButtonSelector).length ){
					event.preventDefault();
					self.close();
				}
			});

			return this;
		},

		/* this method prepares the content and converts it into a jQuery object or a promise */
		getContent: function(){
			if(this.persist !== false && this.$content) {
				return this.$content;
			}
			var self = this,
				filters = this.constructor.contentFilters,
				readTargetAttr = function(name){ return self.$currentTarget && self.$currentTarget.attr(name); },
				targetValue = readTargetAttr(self.targetAttr),
				data = self.target || targetValue || '';

			/* Find which filter applies */
			var filter = filters[self.type]; /* check explicit type like {type: 'image'} */

			/* check explicit type like data-featherlight="image" */
			if(!filter && data in filters) {
				filter = filters[data];
				data = self.target && targetValue;
			}
			data = data || readTargetAttr('href') || '';

			/* check explicity type & content like {image: 'photo.jpg'} */
			if(!filter) {
				for(var filterName in filters) {
					if(self[filterName]) {
						filter = filters[filterName];
						data = self[filterName];
					}
				}
			}

			/* otherwise it's implicit, run checks */
			if(!filter) {
				var target = data;
				data = null;
				$.each(self.contentFilters, function() {
					filter = filters[this];
					if(filter.test)  {
						data = filter.test(target);
					}
					if(!data && filter.regex && target.match && target.match(filter.regex)) {
						data = target;
					}
					return !data;
				});
				if(!data) {
					if('console' in window){ window.console.error('Featherlight: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
					return false;
				}
			}
			/* Process it */
			return filter.process.call(self, data);
		},

		/* sets the content of $instance to $content */
		setContent: function($content){
			var self = this;
			/* we need a special class for the iframe */
			if($content.is('iframe') || $('iframe', $content).length > 0){
				self.$instance.addClass(self.namespace+'-iframe');
			}

			self.$instance.removeClass(self.namespace+'-loading');

			/* replace content by appending to existing one before it is removed
			   this insures that featherlight-inner remain at the same relative
				 position to any other items added to featherlight-content */
			self.$instance.find('.'+self.namespace+'-inner')
				.not($content)                /* excluded new content, important if persisted */
				.slice(1).remove().end()			/* In the unexpected event where there are many inner elements, remove all but the first one */
				.replaceWith($.contains(self.$instance[0], $content[0]) ? '' : $content);

			self.$content = $content.addClass(self.namespace+'-inner');

			return self;
		},

		/* opens the lightbox. "this" contains $instance with the lightbox, and with the config.
			Returns a promise that is resolved after is successfully opened. */
		open: function(event){
			var self = this;
			self.$instance.hide().appendTo(self.root);
			if((!event || !event.isDefaultPrevented())
				&& self.beforeOpen(event) !== false) {

				if(event){
					event.preventDefault();
				}
				var $content = self.getContent();

				if($content) {
					opened.push(self);

					toggleGlobalEvents(true);

					self.$instance.fadeIn(self.openSpeed);
					self.beforeContent(event);

					/* Set content and show */
					return $.when($content)
						.always(function($content){
							self.setContent($content);
							self.afterContent(event);
						})
						.then(self.$instance.promise())
						/* Call afterOpen after fadeIn is done */
						.done(function(){ self.afterOpen(event); });
				}
			}
			self.$instance.detach();
			return $.Deferred().reject().promise();
		},

		/* closes the lightbox. "this" contains $instance with the lightbox, and with the config
			returns a promise, resolved after the lightbox is successfully closed. */
		close: function(event){
			var self = this,
				deferred = $.Deferred();

			if(self.beforeClose(event) === false) {
				deferred.reject();
			} else {

				if (0 === pruneOpened(self).length) {
					toggleGlobalEvents(false);
				}

				self.$instance.fadeOut(self.closeSpeed,function(){
					self.$instance.detach();
					self.afterClose(event);
					deferred.resolve();
				});
			}
			return deferred.promise();
		},

		/* Utility function to chain callbacks
		   [Warning: guru-level]
		   Used be extensions that want to let users specify callbacks but
		   also need themselves to use the callbacks.
		   The argument 'chain' has callback names as keys and function(super, event)
		   as values. That function is meant to call `super` at some point.
		*/
		chainCallbacks: function(chain) {
			for (var name in chain) {
				this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
			}
		}
	};

	$.extend(Featherlight, {
		id: 0,                                    /* Used to id single featherlight instances */
		autoBind:       '[data-featherlight]',    /* Will automatically bind elements matching this selector. Clear or set before onReady */
		defaults:       Featherlight.prototype,   /* You can access and override all defaults using $.featherlight.defaults, which is just a synonym for $.featherlight.prototype */
		/* Contains the logic to determine content */
		contentFilters: {
			jquery: {
				regex: /^[#.]\w/,         /* Anything that starts with a class name or identifiers */
				test: function(elem)    { return elem instanceof $ && elem; },
				process: function(elem) { return this.persist !== false ? $(elem) : $(elem).clone(true); }
			},
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image(),
						$img = $('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />');
					img.onload  = function() {
						/* Store naturalWidth & height for IE8 */
						$img.naturalWidth = img.width; $img.naturalHeight = img.height;
						deferred.resolve( $img );
					};
					img.onerror = function() { deferred.reject($img); };
					img.src = url;
					return deferred.promise();
				}
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			},
			ajax: {
				regex: /./,            /* At this point, any content is assumed to be an URL */
				process: function(url)  {
					var self = this,
						deferred = $.Deferred();
					/* we are using load so one can specify a target with: url.html #targetelement */
					var $container = $('<div></div>').load(url, function(response, status){
						if ( status !== "error" ) {
							deferred.resolve($container.contents());
						}
						deferred.fail();
					});
					return deferred.promise();
				}
			},
			iframe: {
				process: function(url) {
					var deferred = new $.Deferred();
					var $content = $('<iframe/>')
						.hide()
						.attr('src', url)
						.css(structure(this, 'iframe'))
						.on('load', function() { deferred.resolve($content.show()); })
						// We can't move an <iframe> and avoid reloading it,
						// so let's put it in place ourselves right now:
						.appendTo(this.$instance.find('.' + this.namespace + '-content'));
					return deferred.promise();
				}
			},
			text: {
				process: function(text) { return $('<div>', {text: text}); }
			}
		},

		functionAttributes: ['beforeOpen', 'afterOpen', 'beforeContent', 'afterContent', 'beforeClose', 'afterClose'],

		/*** class methods ***/
		/* read element's attributes starting with data-featherlight- */
		readElementConfig: function(element, namespace) {
			var Klass = this,
				regexp = new RegExp('^data-' + namespace + '-(.*)'),
				config = {};
			if (element && element.attributes) {
				$.each(element.attributes, function(){
					var match = this.name.match(regexp);
					if (match) {
						var val = this.value,
							name = $.camelCase(match[1]);
						if ($.inArray(name, Klass.functionAttributes) >= 0) {  /* jshint -W054 */
							val = new Function(val);                           /* jshint +W054 */
						} else {
							try { val = $.parseJSON(val); }
							catch(e) {}
						}
						config[name] = val;
					}
				});
			}
			return config;
		},

		/* Used to create a Featherlight extension
		   [Warning: guru-level]
		   Creates the extension's prototype that in turn
		   inherits Featherlight's prototype.
		   Could be used to extend an extension too...
		   This is pretty high level wizardy, it comes pretty much straight
		   from CoffeeScript and won't teach you anything about Featherlight
		   as it's not really specific to this library.
		   My suggestion: move along and keep your sanity.
		*/
		extend: function(child, defaults) {
			/* Setup class hierarchy, adapted from CoffeeScript */
			var Ctor = function(){ this.constructor = child; };
			Ctor.prototype = this.prototype;
			child.prototype = new Ctor();
			child.__super__ = this.prototype;
			/* Copy class methods & attributes */
			$.extend(child, this, defaults);
			child.defaults = child.prototype;
			return child;
		},

		attach: function($source, $content, config) {
			var Klass = this;
			if (typeof $content === 'object' && $content instanceof $ === false && !config) {
				config = $content;
				$content = undefined;
			}
			/* make a copy */
			config = $.extend({}, config);

			/* Only for openTrigger and namespace... */
			var namespace = config.namespace || Klass.defaults.namespace,
				tempConfig = $.extend({}, Klass.defaults, Klass.readElementConfig($source[0], namespace), config),
				sharedPersist;

			$source.on(tempConfig.openTrigger+'.'+tempConfig.namespace, tempConfig.filter, function(event) {
				/* ... since we might as well compute the config on the actual target */
				var elemConfig = $.extend(
					{$source: $source, $currentTarget: $(this)},
					Klass.readElementConfig($source[0], tempConfig.namespace),
					Klass.readElementConfig(this, tempConfig.namespace),
					config);
				var fl = sharedPersist || $(this).data('featherlight-persisted') || new Klass($content, elemConfig);
				if(fl.persist === 'shared') {
					sharedPersist = fl;
				} else if(fl.persist !== false) {
					$(this).data('featherlight-persisted', fl);
				}
				elemConfig.$currentTarget.blur(); // Otherwise 'enter' key might trigger the dialog again
				fl.open(event);
			});
			return $source;
		},

		current: function() {
			var all = this.opened();
			return all[all.length - 1] || null;
		},

		opened: function() {
			var klass = this;
			pruneOpened();
			return $.grep(opened, function(fl) { return fl instanceof klass; } );
		},

		close: function() {
			var cur = this.current();
			if(cur) { return cur.close(); }
		},

		/* Does the auto binding on startup.
		   Meant only to be used by Featherlight and its extensions
		*/
		_onReady: function() {
			var Klass = this;
			if(Klass.autoBind){
				/* Bind existing elements */
				$(Klass.autoBind).each(function(){
					Klass.attach($(this));
				});
				/* If a click propagates to the document level, then we have an item that was added later on */
				$(document).on('click', Klass.autoBind, function(evt) {
					if (evt.isDefaultPrevented()) {
						return;
					}
					evt.preventDefault();
					/* Bind featherlight */
					Klass.attach($(evt.currentTarget));
					/* Click again; this time our binding will catch it */
					$(evt.target).click();
				});
			}
		},

		/* Featherlight uses the onKeyUp callback to intercept the escape key.
		   Private to Featherlight.
		*/
		_callbackChain: {
			onKeyUp: function(_super, event){
				if(27 === event.keyCode) {
					if (this.closeOnEsc) {
						this.$instance.find('.'+this.namespace+'-close:first').click();
					}
					return false;
				} else {
					return _super(event);
				}
			},

			onResize: function(_super, event){
				if (this.$content.naturalWidth) {
					var w = this.$content.naturalWidth, h = this.$content.naturalHeight;
					/* Reset apparent image size first so container grows */
					this.$content.css('width', '').css('height', '');
					/* Calculate the worst ratio so that dimensions fit */
					var ratio = Math.max(
						w  / parseInt(this.$content.parent().css('width'),10),
						h / parseInt(this.$content.parent().css('height'),10));
					/* Resize content */
					if (ratio > 1) {
						this.$content.css('width', '' + w / ratio + 'px').css('height', '' + h / ratio + 'px');
					}
				}
				return _super(event);
			},

			afterContent: function(_super, event){
				var r = _super(event);
				this.onResize(event);
				return r;
			}
		}
	});

	$.featherlight = Featherlight;

	/* bind jQuery elements to trigger featherlight */
	$.fn.featherlight = function($content, config) {
		return Featherlight.attach(this, $content, config);
	};

	/* bind featherlight on ready if config autoBind is set */
	$(document).ready(function(){ Featherlight._onReady(); });
}(jQuery));


 // includes/plugin_form/js/form.js

ucm = ucm || {};

function dtbaker_loading_button(btn){

    var $button = jQuery(btn);
    if($button.data('done-loading') == 'yes')return false;
    $button.data('done-loading','yes');
    // $button.prop('disabled',true);
    var _modifier = $button.is('input') || $button.is('button') ? 'val' : 'text';
    var existing_text = $button[_modifier]();
    var existing_width = $button.outerWidth();
    var loading_text = '⡀⡀⡀⡀⡀⡀⡀⡀⡀⡀⠄⠂⠁⠁⠂⠄';
    var completed = false;

    $button.css('width',existing_width);
    $button.addClass('dtbaker_loading_button_current');

    function delay_anim_text(){

        $button[_modifier](loading_text);

        var anim_index = [0,1,2];

        // animate the text indent
        function moo() {
            if (completed)return;
            var current_text = '';
            // increase each index up to the loading length
            for(var i = 0; i < anim_index.length; i++){
                anim_index[i] = anim_index[i]+1;
                if(anim_index[i] >= loading_text.length)anim_index[i] = 0;
                current_text += loading_text.charAt(anim_index[i]);
            }
            $button[_modifier](current_text);
            setTimeout(function(){ moo();},60);
        }

        moo();
    }
    setTimeout(delay_anim_text,500);

    function button_complete(){
        completed = true;
        $button[_modifier](existing_text);
        $button.removeClass('dtbaker_loading_button_current');
        $button.prop('disabled',false);
        $button.data('done-loading','finished');
    }
    setTimeout(button_complete,4000);

    return {
        done: function(){
            button_complete()
        }
    }

}

ucm.form = {
    settings: {
        dynamic_select_edit_url: '',
        time_format: 'hh:mm tt'
    },
    lang: {
        dynamic_select_edit_title: 'Edit Entries',
        cancel: 'Close',
        ok: 'OK',
        mins: 'mins',
        hr: 'hr',
        hrs: 'hrs',
        am: 'am',
        AM: 'AM',
        pm: 'pm',
        PM: 'PM'
    },
    close_modal: function(){
        $('.ucm-modal-popup.in').last().modal('hide');
    },
    open_modal: function( ajax_modal_settings ){
        // find the button url
        // load that inner content via ajax
        // display in a modal
        // any submits in this modal form will refresh the page.
        //$('#form-modal-template-inserted').remove();

        var modal_html = $('#form-modal-template').html();
        modal_html = modal_html.replace(/\{modal-header\}/, ajax_modal_settings.title );
        // loading.
        var $modal = $(modal_html);
        $('body').append($modal);
        if(typeof ajax_modal_settings.buttons == 'undefined' || !ajax_modal_settings.buttons){
            $modal.addClass('no-buttons');
        }else{
            // add/generate buttons.
            // todo.
            if(typeof ajax_modal_settings.buttons == 'object'){
                for(var i in ajax_modal_settings.buttons){
                    if(ajax_modal_settings.buttons.hasOwnProperty(i)){
                        switch(ajax_modal_settings.buttons[i]){
                            case 'close':
                            case 'cancel':
                                $modal.find('.modal-footer').append('<button type="button" class="btn btn-secondary close-modal">' + i + '</button>');
                                break;
                            default:
                                (function(){
                                    var $button = $('<button type="button" class="btn btn-primary">' + i + '</button>');
                                    var func = window[ajax_modal_settings.buttons[i]];
                                    $button.click(function(){
                                        if(typeof func == 'function'){
                                            func($modal);
                                        }
                                    });
                                    $modal.find('.modal-footer').append($button);
                                })();
                        }
                    }
                }
            }else{
                $modal.find('.modal-footer').append('<button type="button" class="btn btn-secondary close-modal">Close</button>');
            }

        }
        $modal.on('shown.bs.modal', function () {
            $modal.on('click', '.close-modal', function (e) {
                e.preventDefault();
                $(this).closest('.modal').modal('hide');
                return false;
            });
        });
        if(typeof ajax_modal_settings.type != 'undefined' && ajax_modal_settings.type == 'inline' ){
            $modal.removeClass('loading').find('.modal-body').html( $(ajax_modal_settings.content).html() );
            ucm.init_interface();


            if(typeof ajax_modal_settings.load_callback != 'undefined'){
                if(typeof ajax_modal_settings.load_callback == 'function'){
                    ajax_modal_settings.load_callback($modal);
                }else if(typeof ajax_modal_settings.load_callback == 'string') {
                    var func = window[ajax_modal_settings.load_callback];
                    if (typeof func == 'function') {
                        func($modal);
                    }
                }
            }

        }else {
            $.post(ajax_modal_settings.href, {
                display_mode: "ajax",
                form_auth_key: ucm.form_auth_key,
                vars: ucm.get_vars(),
                modal: "true"
            }, function (data) {
                $modal.removeClass('loading').find('.modal-body').html(data);
                ucm.init_interface();


                if(typeof ajax_modal_settings.load_callback != 'undefined'){
                    if(typeof ajax_modal_settings.load_callback == 'function'){
                        ajax_modal_settings.load_callback($modal);
                    }else if(typeof ajax_modal_settings.load_callback == 'string') {
                        var func = window[ajax_modal_settings.load_callback];
                        if (typeof func == 'function') {
                            func($modal);
                        }
                    }
                }

            });
        }
        $modal.modal().draggable({
            handle: ".modal-header"
        });
    },
    init: function(){
        $('.submit_button').off('click.loading').on( 'click.loading', function(e) {
            var loading_button = dtbaker_loading_button(this);
            if (!loading_button) {
                e.preventDefault();
                return false;
            }
            return true;
        });
        // the new date-time picker stuff:
        if(typeof jQuery.fn.timepicker != 'undefined'){
            $('.time_field').timepicker({
                timeFormat: ucm.settings.time_picker_format,
                timeInput: true,
                controlType: 'select',
                parse: 'loose'
            });
            if (!Date.now) {
                Date.now = function() { return new Date().getTime(); }
            }
            $('.date_time_field').each(function(){
                // create a new hidden field for our epoch time storage.
                // copy the name of this field over to the hidden field.
                var $thistxt = $(this);
                var currenttime = $thistxt.val();
                var $hidden = $('<input/>').attr('type','hidden').attr('name',$thistxt.attr('name')).val( $thistxt.val() );
                $thistxt.attr('name','ignore').after($hidden);
                $thistxt.datetimepicker({
                    timeFormat: ucm.settings.time_picker_format,
                    timeInput: true,
                    controlType: 'select',
                    parse: 'loose',
                    onSelect: function( datetimeText, datepickerInstance ){
                        if(typeof datepickerInstance.hour != 'undefined') {
                            var date = datepickerInstance['$input'].datepicker("getDate");
                            var timestamp = Math.round(new Date(date).getTime()/1000);
                            // console.log(timestamp);
                            $hidden.val(timestamp);
                        }else if(typeof datepickerInstance.input != 'undefined') {
                            var date = datepickerInstance.input.datepicker("getDate");
                            var timestamp = Math.round(new Date(date).getTime()/1000);
                            // console.log(timestamp);
                            $hidden.val(timestamp);
                        }
                    }
                });
                if(parseInt(currenttime) > 0) {
                    var newtime = new Date(currenttime * 1000);
                    $thistxt.datepicker('setTime', newtime);
                    $thistxt.datepicker('setDate', newtime);
                }
            });
        }

        $('body').off('click.modal').on( 'click.modal', '[data-ajax-modal]', function(e) {
            e.preventDefault();
            var $butt = $(this);
            var ajax_modal_settings = $butt.data('ajax-modal');
            if(typeof ajax_modal_settings.title == 'undefined'){
                ajax_modal_settings.title = $butt.text();
            }
            if(typeof ajax_modal_settings.href == 'undefined'){
                ajax_modal_settings.href = $butt.attr('href');
            }

            ucm.form.open_modal( ajax_modal_settings );

            return false;
        });
        $('[data-lookup]').autocomplete({
            create: function( event, ui ) {
                // we need to clone the current input id and make it hidden
                // this is what gets the
                var $textbox = $(event.target);
                var lookup = $textbox.data('lookup');
                var $hidden = $('<input type="hidden">').attr('name', $textbox.attr('name')).val( $textbox.val() );
                $textbox.attr('name','autocomplete_value');
                ucm.set_var('lookup_' + lookup.key, $textbox.val() );
                $textbox.val(lookup.display);
                $textbox.on('focus', function(){
                    if( typeof lookup['onfocus'] != 'undefined'){
                        eval(lookup['onfocus'] + '($textbox);');
                    }
                    if( $textbox.val() == ''){
                        $textbox.autocomplete('search', '');
                    }
                } );
                $textbox.after($hidden);
                $textbox.data('hidden-field', $hidden);
            },
            change: function( event, ui ) {
                var $textbox = $(event.target);
                if( ! $textbox.val().length ){
                    // user has cleared the input
                    var lookup = $elem.data('lookup');
                    ucm.set_var('lookup_' + lookup.key, 0 );
                    $textbox.data('hidden-field').val( 0 );
                }
            },
            select: function( event, ui ) {

                var $textbox = $(event.target);
                $textbox.val( ui.item.value );
                var lookup = $elem.data('lookup');
                ucm.set_var('lookup_' + lookup.key, ui.item.key );
                $textbox.data('hidden-field').val( ui.item.key );

                return false;
            },
            source: function( request, response ){
                $elem = this.element;
                //console.log($elem.val());
                var lookup = $elem.data('lookup');
                lookup.autocomplete = 'autocomplete';
                lookup.search = request.term;
                lookup.form_auth_key = ucm.form_auth_key;
                lookup.vars = ucm.get_vars();
                $.post(
                    ajax_search_url,
                    lookup,
                    function(data){
                        response(data);
                    }
                );
            },
            autoFocus: false,
            minLength: 0
        });
    },
    dynamic: function(object_id){

        var $object = $("#"+object_id);

        function set_add_remove_buttons(){
            $object.find('.remove_addit').show();
            $object.find('.add_addit').hide();
            $object.find('.add_addit:last').show();
            $object.find('.dynamic_block:only-child > .remove_addit').hide();
        }

        function selrem(e){
            e.preventDefault();
            var clickety = this;
            $(clickety).parents('.dynamic_block').remove();
            set_add_remove_buttons();
            return false;
        }
        function seladd(e){
            e.preventDefault();
            var clickety = this;
            //var box = $('#'+id+' .dynamic_block:last').clone(true);
            var x=0,old_names=[];
            // these pointless looking loops are because IE doesn't handle
            // cloning the name="" part of dynamic input boxes very well... ?
            $('input',$(clickety).parents('.dynamic_block')).each(function(){
                old_names[x++] = $(this).attr('name');
            });
            $('select',$(clickety).parents('.dynamic_block')).each(function(){
                old_names[x++] = $(this).attr('name');
            });
            if($(clickety).parents('.dynamic_block .clone_template').length){
                //var box = $(clickety).parents('.dynamic_block .clone_template > div').clone(true); // todo - figure out if we need "true"
                alert('Under dev...');
            }else{
                var box = $(clickety).parents('.dynamic_block').clone(); // todo - figure out if we need "true"

            }
            x = 0;
            $('input',box).each(function(){
                if( $(this).autocomplete( "instance" ) ){
                   // $(this).autocomplete( "destroy" )
                }
                if(typeof old_names[x] == 'string'){
                    $(this).attr('name', old_names[x]);
                }
                x++;
            });
            $('select',box).each(function(){
                if(typeof old_names[x] == 'string'){
                    $(this).attr('name', old_names[x]);
                }
                x++;
            });
            $('input,select',box).each(function(){
                $(this).val('');
                if($(this).hasClass('date_field')) {
                    $(this).removeClass('hasDatepicker');
                    $(this).datepicker('destroy');
                    // unique id for this date field/
                    $(this).attr('id', 'input_' + Math.floor(Math.random() * 1000));
                }

            });
            $('.dynamic_clear:input',box).val('');
            $('.dynamic_clear',box).html('');
            //$(clickety).after(box);
            $object.find('.dynamic_block:last').after( box);
            ucm.form.init();
            set_add_remove_buttons();
            load_calendars();
            return false;
        }

        $object.on('click','.add_addit',seladd);
        $object.on('click','.remove_addit',selrem);
        set_add_remove_buttons();

        return {

        };
    },

    dynamic_select_box: function(element){
        if($(element).val()=='create_new_item'){
            var current_val = $(element).val();
            if(current_val=='create_new_item')current_val = '';
            var id = $(element).attr('id');
            if(typeof id == 'object')id = $(element).prop('id');
            var name = $(element).attr('name');
            if(typeof name == 'object')name = $(element).prop('name');
            var html = '<input type="text" name="'+name+'" id="'+id+'" value="'+current_val+'">';
            // add a new input box.
            $(element).after('<span id="dynamic_select_box_placeholder"></span>');
            $(element).remove();
            var box = $(html);
            $('#dynamic_select_box_placeholder').after(box).remove();
            box[0].focus();
            box[0].select();
        }else if($(element).val()=='_manage_items') {


            var current_options = $(element).find('option:selected').data('items');
            $(element).find("option:selected").prop("selected", false);
            var buttons = {};
            buttons[ucm.form.lang.cancel] = function(){
                $(this).dialog('close');
            };

            function edit_items(){
                load_select_popup();
                $("#dynamic_select_popup").dialog({
                    autoOpen: false,
                    height: 600,
                    width: 600,
                    modal: true,
                    buttons: buttons,
                    open: function () {
                        $.ajax({
                            type: "POST",
                            url: ucm.form.settings.dynamic_select_edit_url,
                            data: current_options,
                            dataType: "html",
                            success: function (d) {
                                if ($('#dynamic_select_form', d).length < 1) {
                                    alert('Failed to load data. Please report this error.');
                                    //$(this).dialog('close');
                                    return false;
                                }
                                $('#dynamic_select_popup_inner').html(d);
                                $('.edit_dynamic_select_option').click(function(e){

                                    e.preventDefault();

                                    edit_individual_item($(this).data('item'))

                                    return false;

                                });

                            }
                        });
                    }
                }).dialog('open');

            }
            function edit_individual_item(item_data){
                load_select_popup();

                $("#dynamic_select_popup").dialog({
                    autoOpen: false,
                    height: 600,
                    width: 600,
                    modal: true,
                    buttons: buttons,
                    open: function () {
                        $.ajax({
                            type: "POST",
                            url: ucm.form.settings.dynamic_select_edit_url,
                            data: item_data,
                            dataType: "html",
                            success: function (d) {
                                if ($('#dynamic_select_form', d).length < 1) {
                                    alert('Failed to load data. Please report this error.');
                                    //$(this).dialog('close');
                                    return false;
                                }
                                $('#dynamic_select_popup_inner').html(d);


                            }
                        });
                    }
                }).dialog('open');
            }
            function load_select_popup(){
                $('#dynamic_select_popup').remove();
                $('body').append('<div id="dynamic_select_popup" title="' + ucm.form.lang.dynamic_select_edit_title + '"><div id="dynamic_select_popup_inner"></div></div>');
            }

            edit_items();



        }
    }

};

$(function(){
    //ucm.form.init();
    // moved to ucm.init_interface
});
// backwards compat:
function dynamic_select_box(element){
    ucm.form.dynamic_select_box(element);
}
function seladd(){
    console.log('deprecated call to seladd()');
}
function selrem(){
    console.log('deprecated call to selrem()');
}
function set_add_del(object_id){
    console.log('deprecated call to set_add_del() - use ucm.form.dynamic() instead');
    new ucm.form.dynamic(object_id);
}

 // includes/plugin_form/js/jquery-ui-timepicker-addon.js

/*! jQuery Timepicker Addon - v1.6.3 - 2016-04-20
* http://trentrichardson.com/examples/timepicker
* Copyright (c) 2016 Trent Richardson; Licensed MIT */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'jquery-ui'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {

	/*
	* Lets not redefine timepicker, Prevent "Uncaught RangeError: Maximum call stack size exceeded"
	*/
	$.ui.timepicker = $.ui.timepicker || {};
	if ($.ui.timepicker.version) {
		return;
	}

	/*
	* Extend jQueryUI, get it started with our version number
	*/
	$.extend($.ui, {
		timepicker: {
			version: "1.6.3"
		}
	});

	/*
	* Timepicker manager.
	* Use the singleton instance of this class, $.timepicker, to interact with the time picker.
	* Settings for (groups of) time pickers are maintained in an instance object,
	* allowing multiple different settings on the same page.
	*/
	var Timepicker = function () {
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[''] = { // Default regional settings
			currentText: 'Now',
			closeText: 'Done',
			amNames: ['AM', 'A'],
			pmNames: ['PM', 'P'],
			timeFormat: 'HH:mm',
			timeSuffix: '',
			timeOnlyTitle: 'Choose Time',
			timeText: 'Time',
			hourText: 'Hour',
			minuteText: 'Minute',
			secondText: 'Second',
			millisecText: 'Millisecond',
			microsecText: 'Microsecond',
			timezoneText: 'Time Zone',
			isRTL: false
		};
		this._defaults = { // Global defaults for all the datetime picker instances
			showButtonPanel: true,
			timeOnly: false,
			timeOnlyShowDate: false,
			showHour: null,
			showMinute: null,
			showSecond: null,
			showMillisec: null,
			showMicrosec: null,
			showTimezone: null,
			showTime: true,
			stepHour: 1,
			stepMinute: 1,
			stepSecond: 1,
			stepMillisec: 1,
			stepMicrosec: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			microsec: 0,
			timezone: null,
			hourMin: 0,
			minuteMin: 0,
			secondMin: 0,
			millisecMin: 0,
			microsecMin: 0,
			hourMax: 23,
			minuteMax: 59,
			secondMax: 59,
			millisecMax: 999,
			microsecMax: 999,
			minDateTime: null,
			maxDateTime: null,
			maxTime: null,
			minTime: null,
			onSelect: null,
			hourGrid: 0,
			minuteGrid: 0,
			secondGrid: 0,
			millisecGrid: 0,
			microsecGrid: 0,
			alwaysSetTime: true,
			separator: ' ',
			altFieldTimeOnly: true,
			altTimeFormat: null,
			altSeparator: null,
			altTimeSuffix: null,
			altRedirectFocus: true,
			pickerTimeFormat: null,
			pickerTimeSuffix: null,
			showTimepicker: true,
			timezoneList: null,
			addSliderAccess: false,
			sliderAccessArgs: null,
			controlType: 'slider',
			oneLine: false,
			defaultValue: null,
			parse: 'strict',
			afterInject: null
		};
		$.extend(this._defaults, this.regional['']);
	};

	$.extend(Timepicker.prototype, {
		$input: null,
		$altInput: null,
		$timeObj: null,
		inst: null,
		hour_slider: null,
		minute_slider: null,
		second_slider: null,
		millisec_slider: null,
		microsec_slider: null,
		timezone_select: null,
		maxTime: null,
		minTime: null,
		hour: 0,
		minute: 0,
		second: 0,
		millisec: 0,
		microsec: 0,
		timezone: null,
		hourMinOriginal: null,
		minuteMinOriginal: null,
		secondMinOriginal: null,
		millisecMinOriginal: null,
		microsecMinOriginal: null,
		hourMaxOriginal: null,
		minuteMaxOriginal: null,
		secondMaxOriginal: null,
		millisecMaxOriginal: null,
		microsecMaxOriginal: null,
		ampm: '',
		formattedDate: '',
		formattedTime: '',
		formattedDateTime: '',
		timezoneList: null,
		units: ['hour', 'minute', 'second', 'millisec', 'microsec'],
		support: {},
		control: null,

		/*
		* Override the default settings for all instances of the time picker.
		* @param  {Object} settings  object - the new settings to use as defaults (anonymous object)
		* @return {Object} the manager object
		*/
		setDefaults: function (settings) {
			extendRemove(this._defaults, settings || {});
			return this;
		},

		/*
		* Create a new Timepicker instance
		*/
		_newInst: function ($input, opts) {
			var tp_inst = new Timepicker(),
				inlineSettings = {},
				fns = {},
				overrides, i;

			for (var attrName in this._defaults) {
				if (this._defaults.hasOwnProperty(attrName)) {
					var attrValue = $input.attr('time:' + attrName);
					if (attrValue) {
						try {
							inlineSettings[attrName] = eval(attrValue);
						} catch (err) {
							inlineSettings[attrName] = attrValue;
						}
					}
				}
			}

			overrides = {
				beforeShow: function (input, dp_inst) {
					if ($.isFunction(tp_inst._defaults.evnts.beforeShow)) {
						return tp_inst._defaults.evnts.beforeShow.call($input[0], input, dp_inst, tp_inst);
					}
				},
				onChangeMonthYear: function (year, month, dp_inst) {
					// Update the time as well : this prevents the time from disappearing from the $input field.
					// tp_inst._updateDateTime(dp_inst);
					if ($.isFunction(tp_inst._defaults.evnts.onChangeMonthYear)) {
						tp_inst._defaults.evnts.onChangeMonthYear.call($input[0], year, month, dp_inst, tp_inst);
					}
				},
				onClose: function (dateText, dp_inst) {
					if (tp_inst.timeDefined === true && $input.val() !== '') {
						tp_inst._updateDateTime(dp_inst);
					}
					if ($.isFunction(tp_inst._defaults.evnts.onClose)) {
						tp_inst._defaults.evnts.onClose.call($input[0], dateText, dp_inst, tp_inst);
					}
				}
			};
			for (i in overrides) {
				if (overrides.hasOwnProperty(i)) {
					fns[i] = opts[i] || this._defaults[i] || null;
				}
			}

			tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, opts, overrides, {
				evnts: fns,
				timepicker: tp_inst // add timepicker as a property of datepicker: $.datepicker._get(dp_inst, 'timepicker');
			});
			tp_inst.amNames = $.map(tp_inst._defaults.amNames, function (val) {
				return val.toUpperCase();
			});
			tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, function (val) {
				return val.toUpperCase();
			});

			// detect which units are supported
			tp_inst.support = detectSupport(
					tp_inst._defaults.timeFormat +
					(tp_inst._defaults.pickerTimeFormat ? tp_inst._defaults.pickerTimeFormat : '') +
					(tp_inst._defaults.altTimeFormat ? tp_inst._defaults.altTimeFormat : ''));

			// controlType is string - key to our this._controls
			if (typeof(tp_inst._defaults.controlType) === 'string') {
				if (tp_inst._defaults.controlType === 'slider' && typeof($.ui.slider) === 'undefined') {
					tp_inst._defaults.controlType = 'select';
				}
				tp_inst.control = tp_inst._controls[tp_inst._defaults.controlType];
			}
			// controlType is an object and must implement create, options, value methods
			else {
				tp_inst.control = tp_inst._defaults.controlType;
			}

			// prep the timezone options
			var timezoneList = [-720, -660, -600, -570, -540, -480, -420, -360, -300, -270, -240, -210, -180, -120, -60,
					0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 525, 540, 570, 600, 630, 660, 690, 720, 765, 780, 840];
			if (tp_inst._defaults.timezoneList !== null) {
				timezoneList = tp_inst._defaults.timezoneList;
			}
			var tzl = timezoneList.length, tzi = 0, tzv = null;
			if (tzl > 0 && typeof timezoneList[0] !== 'object') {
				for (; tzi < tzl; tzi++) {
					tzv = timezoneList[tzi];
					timezoneList[tzi] = { value: tzv, label: $.timepicker.timezoneOffsetString(tzv, tp_inst.support.iso8601) };
				}
			}
			tp_inst._defaults.timezoneList = timezoneList;

			// set the default units
			tp_inst.timezone = tp_inst._defaults.timezone !== null ? $.timepicker.timezoneOffsetNumber(tp_inst._defaults.timezone) :
							((new Date()).getTimezoneOffset() * -1);
			tp_inst.hour = tp_inst._defaults.hour < tp_inst._defaults.hourMin ? tp_inst._defaults.hourMin :
							tp_inst._defaults.hour > tp_inst._defaults.hourMax ? tp_inst._defaults.hourMax : tp_inst._defaults.hour;
			tp_inst.minute = tp_inst._defaults.minute < tp_inst._defaults.minuteMin ? tp_inst._defaults.minuteMin :
							tp_inst._defaults.minute > tp_inst._defaults.minuteMax ? tp_inst._defaults.minuteMax : tp_inst._defaults.minute;
			tp_inst.second = tp_inst._defaults.second < tp_inst._defaults.secondMin ? tp_inst._defaults.secondMin :
							tp_inst._defaults.second > tp_inst._defaults.secondMax ? tp_inst._defaults.secondMax : tp_inst._defaults.second;
			tp_inst.millisec = tp_inst._defaults.millisec < tp_inst._defaults.millisecMin ? tp_inst._defaults.millisecMin :
							tp_inst._defaults.millisec > tp_inst._defaults.millisecMax ? tp_inst._defaults.millisecMax : tp_inst._defaults.millisec;
			tp_inst.microsec = tp_inst._defaults.microsec < tp_inst._defaults.microsecMin ? tp_inst._defaults.microsecMin :
							tp_inst._defaults.microsec > tp_inst._defaults.microsecMax ? tp_inst._defaults.microsecMax : tp_inst._defaults.microsec;
			tp_inst.ampm = '';
			tp_inst.$input = $input;

			if (tp_inst._defaults.altField) {
				tp_inst.$altInput = $(tp_inst._defaults.altField);
				if (tp_inst._defaults.altRedirectFocus === true) {
					tp_inst.$altInput.css({
						cursor: 'pointer'
					}).focus(function () {
						$input.trigger("focus");
					});
				}
			}

			if (tp_inst._defaults.minDate === 0 || tp_inst._defaults.minDateTime === 0) {
				tp_inst._defaults.minDate = new Date();
			}
			if (tp_inst._defaults.maxDate === 0 || tp_inst._defaults.maxDateTime === 0) {
				tp_inst._defaults.maxDate = new Date();
			}

			// datepicker needs minDate/maxDate, timepicker needs minDateTime/maxDateTime..
			if (tp_inst._defaults.minDate !== undefined && tp_inst._defaults.minDate instanceof Date) {
				tp_inst._defaults.minDateTime = new Date(tp_inst._defaults.minDate.getTime());
			}
			if (tp_inst._defaults.minDateTime !== undefined && tp_inst._defaults.minDateTime instanceof Date) {
				tp_inst._defaults.minDate = new Date(tp_inst._defaults.minDateTime.getTime());
			}
			if (tp_inst._defaults.maxDate !== undefined && tp_inst._defaults.maxDate instanceof Date) {
				tp_inst._defaults.maxDateTime = new Date(tp_inst._defaults.maxDate.getTime());
			}
			if (tp_inst._defaults.maxDateTime !== undefined && tp_inst._defaults.maxDateTime instanceof Date) {
				tp_inst._defaults.maxDate = new Date(tp_inst._defaults.maxDateTime.getTime());
			}
			tp_inst.$input.bind('focus', function () {
				tp_inst._onFocus();
			});

			return tp_inst;
		},

		/*
		* add our sliders to the calendar
		*/
		_addTimePicker: function (dp_inst) {
			var currDT = $.trim((this.$altInput && this._defaults.altFieldTimeOnly) ? this.$input.val() + ' ' + this.$altInput.val() : this.$input.val());

			this.timeDefined = this._parseTime(currDT);
			this._limitMinMaxDateTime(dp_inst, false);
			this._injectTimePicker();
			this._afterInject();
		},

		/*
		* parse the time string from input value or _setTime
		*/
		_parseTime: function (timeString, withDate) {
			if (!this.inst) {
				this.inst = $.datepicker._getInst(this.$input[0]);
			}

			if (withDate || !this._defaults.timeOnly) {
				var dp_dateFormat = $.datepicker._get(this.inst, 'dateFormat');
				try {
					var parseRes = parseDateTimeInternal(dp_dateFormat, this._defaults.timeFormat, timeString, $.datepicker._getFormatConfig(this.inst), this._defaults);
					if (!parseRes.timeObj) {
						return false;
					}
					$.extend(this, parseRes.timeObj);
				} catch (err) {
					$.timepicker.log("Error parsing the date/time string: " + err +
									"\ndate/time string = " + timeString +
									"\ntimeFormat = " + this._defaults.timeFormat +
									"\ndateFormat = " + dp_dateFormat);
					return false;
				}
				return true;
			} else {
				var timeObj = $.datepicker.parseTime(this._defaults.timeFormat, timeString, this._defaults);
				if (!timeObj) {
					return false;
				}
				$.extend(this, timeObj);
				return true;
			}
		},

		/*
		* Handle callback option after injecting timepicker
		*/
		_afterInject: function() {
			var o = this.inst.settings;
			if ($.isFunction(o.afterInject)) {
				o.afterInject.call(this);
			}
		},

		/*
		* generate and inject html for timepicker into ui datepicker
		*/
		_injectTimePicker: function () {
			var $dp = this.inst.dpDiv,
				o = this.inst.settings,
				tp_inst = this,
				litem = '',
				uitem = '',
				show = null,
				max = {},
				gridSize = {},
				size = null,
				i = 0,
				l = 0;

			// Prevent displaying twice
			if ($dp.find("div.ui-timepicker-div").length === 0 && o.showTimepicker) {
				var noDisplay = ' ui_tpicker_unit_hide',
					html = '<div class="ui-timepicker-div' + (o.isRTL ? ' ui-timepicker-rtl' : '') + (o.oneLine && o.controlType === 'select' ? ' ui-timepicker-oneLine' : '') + '"><dl>' + '<dt class="ui_tpicker_time_label' + ((o.showTime) ? '' : noDisplay) + '">' + o.timeText + '</dt>' +
								'<dd class="ui_tpicker_time '+ ((o.showTime) ? '' : noDisplay) + '"><input class="ui_tpicker_time_input" ' + (o.timeInput ? '' : 'disabled') + '/></dd>';

				// Create the markup
				for (i = 0, l = this.units.length; i < l; i++) {
					litem = this.units[i];
					uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
					show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

					// Added by Peter Medeiros:
					// - Figure out what the hour/minute/second max should be based on the step values.
					// - Example: if stepMinute is 15, then minMax is 45.
					max[litem] = parseInt((o[litem + 'Max'] - ((o[litem + 'Max'] - o[litem + 'Min']) % o['step' + uitem])), 10);
					gridSize[litem] = 0;

					html += '<dt class="ui_tpicker_' + litem + '_label' + (show ? '' : noDisplay) + '">' + o[litem + 'Text'] + '</dt>' +
								'<dd class="ui_tpicker_' + litem + (show ? '' : noDisplay) + '"><div class="ui_tpicker_' + litem + '_slider' + (show ? '' : noDisplay) + '"></div>';

					if (show && o[litem + 'Grid'] > 0) {
						html += '<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';

						if (litem === 'hour') {
							for (var h = o[litem + 'Min']; h <= max[litem]; h += parseInt(o[litem + 'Grid'], 10)) {
								gridSize[litem]++;
								var tmph = $.datepicker.formatTime(this.support.ampm ? 'hht' : 'HH', {hour: h}, o);
								html += '<td data-for="' + litem + '">' + tmph + '</td>';
							}
						}
						else {
							for (var m = o[litem + 'Min']; m <= max[litem]; m += parseInt(o[litem + 'Grid'], 10)) {
								gridSize[litem]++;
								html += '<td data-for="' + litem + '">' + ((m < 10) ? '0' : '') + m + '</td>';
							}
						}

						html += '</tr></table></div>';
					}
					html += '</dd>';
				}

				// Timezone
				var showTz = o.showTimezone !== null ? o.showTimezone : this.support.timezone;
				html += '<dt class="ui_tpicker_timezone_label' + (showTz ? '' : noDisplay) + '">' + o.timezoneText + '</dt>';
				html += '<dd class="ui_tpicker_timezone' + (showTz ? '' : noDisplay) + '"></dd>';

				// Create the elements from string
				html += '</dl></div>';
				var $tp = $(html);

				// if we only want time picker...
				if (o.timeOnly === true) {
					$tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">' + '<div class="ui-datepicker-title">' + o.timeOnlyTitle + '</div>' + '</div>');
					$dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();
				}

				// add sliders, adjust grids, add events
				for (i = 0, l = tp_inst.units.length; i < l; i++) {
					litem = tp_inst.units[i];
					uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
					show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

					// add the slider
					tp_inst[litem + '_slider'] = tp_inst.control.create(tp_inst, $tp.find('.ui_tpicker_' + litem + '_slider'), litem, tp_inst[litem], o[litem + 'Min'], max[litem], o['step' + uitem]);

					// adjust the grid and add click event
					if (show && o[litem + 'Grid'] > 0) {
						size = 100 * gridSize[litem] * o[litem + 'Grid'] / (max[litem] - o[litem + 'Min']);
						$tp.find('.ui_tpicker_' + litem + ' table').css({
							width: size + "%",
							marginLeft: o.isRTL ? '0' : ((size / (-2 * gridSize[litem])) + "%"),
							marginRight: o.isRTL ? ((size / (-2 * gridSize[litem])) + "%") : '0',
							borderCollapse: 'collapse'
						}).find("td").click(function (e) {
								var $t = $(this),
									h = $t.html(),
									n = parseInt(h.replace(/[^0-9]/g), 10),
									ap = h.replace(/[^apm]/ig),
									f = $t.data('for'); // loses scope, so we use data-for

								if (f === 'hour') {
									if (ap.indexOf('p') !== -1 && n < 12) {
										n += 12;
									}
									else {
										if (ap.indexOf('a') !== -1 && n === 12) {
											n = 0;
										}
									}
								}

								tp_inst.control.value(tp_inst, tp_inst[f + '_slider'], litem, n);

								tp_inst._onTimeChange();
								tp_inst._onSelectHandler();
							}).css({
								cursor: 'pointer',
								width: (100 / gridSize[litem]) + '%',
								textAlign: 'center',
								overflow: 'hidden'
							});
					} // end if grid > 0
				} // end for loop

				// Add timezone options
				this.timezone_select = $tp.find('.ui_tpicker_timezone').append('<select></select>').find("select");
				$.fn.append.apply(this.timezone_select,
				$.map(o.timezoneList, function (val, idx) {
					return $("<option />").val(typeof val === "object" ? val.value : val).text(typeof val === "object" ? val.label : val);
				}));
				if (typeof(this.timezone) !== "undefined" && this.timezone !== null && this.timezone !== "") {
					var local_timezone = (new Date(this.inst.selectedYear, this.inst.selectedMonth, this.inst.selectedDay, 12)).getTimezoneOffset() * -1;
					if (local_timezone === this.timezone) {
						selectLocalTimezone(tp_inst);
					} else {
						this.timezone_select.val(this.timezone);
					}
				} else {
					if (typeof(this.hour) !== "undefined" && this.hour !== null && this.hour !== "") {
						this.timezone_select.val(o.timezone);
					} else {
						selectLocalTimezone(tp_inst);
					}
				}
				this.timezone_select.change(function () {
					tp_inst._onTimeChange();
					tp_inst._onSelectHandler();
					tp_inst._afterInject();
				});
				// End timezone options

				// inject timepicker into datepicker
				var $buttonPanel = $dp.find('.ui-datepicker-buttonpane');
				if ($buttonPanel.length) {
					$buttonPanel.before($tp);
				} else {
					$dp.append($tp);
				}

				this.$timeObj = $tp.find('.ui_tpicker_time_input');
				this.$timeObj.change(function () {
					var timeFormat = tp_inst.inst.settings.timeFormat;
					var parsedTime = $.datepicker.parseTime(timeFormat, this.value);
					var update = new Date();
					if (parsedTime) {
						update.setHours(parsedTime.hour);
						update.setMinutes(parsedTime.minute);
						update.setSeconds(parsedTime.second);
						$.datepicker._setTime(tp_inst.inst, update);
					} else {
						this.value = tp_inst.formattedTime;
						this.blur();
					}
				});

				if (this.inst !== null) {
					var timeDefined = this.timeDefined;
					this._onTimeChange();
					this.timeDefined = timeDefined;
				}

				// slideAccess integration: http://trentrichardson.com/2011/11/11/jquery-ui-sliders-and-touch-accessibility/
				if (this._defaults.addSliderAccess) {
					var sliderAccessArgs = this._defaults.sliderAccessArgs,
						rtl = this._defaults.isRTL;
					sliderAccessArgs.isRTL = rtl;

					setTimeout(function () { // fix for inline mode
						if ($tp.find('.ui-slider-access').length === 0) {
							$tp.find('.ui-slider:visible').sliderAccess(sliderAccessArgs);

							// fix any grids since sliders are shorter
							var sliderAccessWidth = $tp.find('.ui-slider-access:eq(0)').outerWidth(true);
							if (sliderAccessWidth) {
								$tp.find('table:visible').each(function () {
									var $g = $(this),
										oldWidth = $g.outerWidth(),
										oldMarginLeft = $g.css(rtl ? 'marginRight' : 'marginLeft').toString().replace('%', ''),
										newWidth = oldWidth - sliderAccessWidth,
										newMarginLeft = ((oldMarginLeft * newWidth) / oldWidth) + '%',
										css = { width: newWidth, marginRight: 0, marginLeft: 0 };
									css[rtl ? 'marginRight' : 'marginLeft'] = newMarginLeft;
									$g.css(css);
								});
							}
						}
					}, 10);
				}
				// end slideAccess integration

				tp_inst._limitMinMaxDateTime(this.inst, true);
			}
		},

		/*
		* This function tries to limit the ability to go outside the
		* min/max date range
		*/
		_limitMinMaxDateTime: function (dp_inst, adjustSliders) {
			var o = this._defaults,
				dp_date = new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay);

			if (!this._defaults.showTimepicker) {
				return;
			} // No time so nothing to check here

			if ($.datepicker._get(dp_inst, 'minDateTime') !== null && $.datepicker._get(dp_inst, 'minDateTime') !== undefined && dp_date) {
				var minDateTime = $.datepicker._get(dp_inst, 'minDateTime'),
					minDateTimeDate = new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMinOriginal === null || this.minuteMinOriginal === null || this.secondMinOriginal === null || this.millisecMinOriginal === null || this.microsecMinOriginal === null) {
					this.hourMinOriginal = o.hourMin;
					this.minuteMinOriginal = o.minuteMin;
					this.secondMinOriginal = o.secondMin;
					this.millisecMinOriginal = o.millisecMin;
					this.microsecMinOriginal = o.microsecMin;
				}

				if (dp_inst.settings.timeOnly || minDateTimeDate.getTime() === dp_date.getTime()) {
					this._defaults.hourMin = minDateTime.getHours();
					if (this.hour <= this._defaults.hourMin) {
						this.hour = this._defaults.hourMin;
						this._defaults.minuteMin = minDateTime.getMinutes();
						if (this.minute <= this._defaults.minuteMin) {
							this.minute = this._defaults.minuteMin;
							this._defaults.secondMin = minDateTime.getSeconds();
							if (this.second <= this._defaults.secondMin) {
								this.second = this._defaults.secondMin;
								this._defaults.millisecMin = minDateTime.getMilliseconds();
								if (this.millisec <= this._defaults.millisecMin) {
									this.millisec = this._defaults.millisecMin;
									this._defaults.microsecMin = minDateTime.getMicroseconds();
								} else {
									if (this.microsec < this._defaults.microsecMin) {
										this.microsec = this._defaults.microsecMin;
									}
									this._defaults.microsecMin = this.microsecMinOriginal;
								}
							} else {
								this._defaults.millisecMin = this.millisecMinOriginal;
								this._defaults.microsecMin = this.microsecMinOriginal;
							}
						} else {
							this._defaults.secondMin = this.secondMinOriginal;
							this._defaults.millisecMin = this.millisecMinOriginal;
							this._defaults.microsecMin = this.microsecMinOriginal;
						}
					} else {
						this._defaults.minuteMin = this.minuteMinOriginal;
						this._defaults.secondMin = this.secondMinOriginal;
						this._defaults.millisecMin = this.millisecMinOriginal;
						this._defaults.microsecMin = this.microsecMinOriginal;
					}
				} else {
					this._defaults.hourMin = this.hourMinOriginal;
					this._defaults.minuteMin = this.minuteMinOriginal;
					this._defaults.secondMin = this.secondMinOriginal;
					this._defaults.millisecMin = this.millisecMinOriginal;
					this._defaults.microsecMin = this.microsecMinOriginal;
				}
			}

			if ($.datepicker._get(dp_inst, 'maxDateTime') !== null && $.datepicker._get(dp_inst, 'maxDateTime') !== undefined && dp_date) {
				var maxDateTime = $.datepicker._get(dp_inst, 'maxDateTime'),
					maxDateTimeDate = new Date(maxDateTime.getFullYear(), maxDateTime.getMonth(), maxDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMaxOriginal === null || this.minuteMaxOriginal === null || this.secondMaxOriginal === null || this.millisecMaxOriginal === null) {
					this.hourMaxOriginal = o.hourMax;
					this.minuteMaxOriginal = o.minuteMax;
					this.secondMaxOriginal = o.secondMax;
					this.millisecMaxOriginal = o.millisecMax;
					this.microsecMaxOriginal = o.microsecMax;
				}

				if (dp_inst.settings.timeOnly || maxDateTimeDate.getTime() === dp_date.getTime()) {
					this._defaults.hourMax = maxDateTime.getHours();
					if (this.hour >= this._defaults.hourMax) {
						this.hour = this._defaults.hourMax;
						this._defaults.minuteMax = maxDateTime.getMinutes();
						if (this.minute >= this._defaults.minuteMax) {
							this.minute = this._defaults.minuteMax;
							this._defaults.secondMax = maxDateTime.getSeconds();
							if (this.second >= this._defaults.secondMax) {
								this.second = this._defaults.secondMax;
								this._defaults.millisecMax = maxDateTime.getMilliseconds();
								if (this.millisec >= this._defaults.millisecMax) {
									this.millisec = this._defaults.millisecMax;
									this._defaults.microsecMax = maxDateTime.getMicroseconds();
								} else {
									if (this.microsec > this._defaults.microsecMax) {
										this.microsec = this._defaults.microsecMax;
									}
									this._defaults.microsecMax = this.microsecMaxOriginal;
								}
							} else {
								this._defaults.millisecMax = this.millisecMaxOriginal;
								this._defaults.microsecMax = this.microsecMaxOriginal;
							}
						} else {
							this._defaults.secondMax = this.secondMaxOriginal;
							this._defaults.millisecMax = this.millisecMaxOriginal;
							this._defaults.microsecMax = this.microsecMaxOriginal;
						}
					} else {
						this._defaults.minuteMax = this.minuteMaxOriginal;
						this._defaults.secondMax = this.secondMaxOriginal;
						this._defaults.millisecMax = this.millisecMaxOriginal;
						this._defaults.microsecMax = this.microsecMaxOriginal;
					}
				} else {
					this._defaults.hourMax = this.hourMaxOriginal;
					this._defaults.minuteMax = this.minuteMaxOriginal;
					this._defaults.secondMax = this.secondMaxOriginal;
					this._defaults.millisecMax = this.millisecMaxOriginal;
					this._defaults.microsecMax = this.microsecMaxOriginal;
				}
			}

			if (dp_inst.settings.minTime!==null) {
				var tempMinTime=new Date("01/01/1970 " + dp_inst.settings.minTime);
				if (this.hour<tempMinTime.getHours()) {
					this.hour=this._defaults.hourMin=tempMinTime.getHours();
					this.minute=this._defaults.minuteMin=tempMinTime.getMinutes();
				} else if (this.hour===tempMinTime.getHours() && this.minute<tempMinTime.getMinutes()) {
					this.minute=this._defaults.minuteMin=tempMinTime.getMinutes();
				} else {
					if (this._defaults.hourMin<tempMinTime.getHours()) {
						this._defaults.hourMin=tempMinTime.getHours();
						this._defaults.minuteMin=tempMinTime.getMinutes();
					} else if (this._defaults.hourMin===tempMinTime.getHours()===this.hour && this._defaults.minuteMin<tempMinTime.getMinutes()) {
						this._defaults.minuteMin=tempMinTime.getMinutes();
					} else {
						this._defaults.minuteMin=0;
					}
				}
			}

			if (dp_inst.settings.maxTime!==null) {
				var tempMaxTime=new Date("01/01/1970 " + dp_inst.settings.maxTime);
				if (this.hour>tempMaxTime.getHours()) {
					this.hour=this._defaults.hourMax=tempMaxTime.getHours();
					this.minute=this._defaults.minuteMax=tempMaxTime.getMinutes();
				} else if (this.hour===tempMaxTime.getHours() && this.minute>tempMaxTime.getMinutes()) {
					this.minute=this._defaults.minuteMax=tempMaxTime.getMinutes();
				} else {
					if (this._defaults.hourMax>tempMaxTime.getHours()) {
						this._defaults.hourMax=tempMaxTime.getHours();
						this._defaults.minuteMax=tempMaxTime.getMinutes();
					} else if (this._defaults.hourMax===tempMaxTime.getHours()===this.hour && this._defaults.minuteMax>tempMaxTime.getMinutes()) {
						this._defaults.minuteMax=tempMaxTime.getMinutes();
					} else {
						this._defaults.minuteMax=59;
					}
				}
			}

			if (adjustSliders !== undefined && adjustSliders === true) {
				var hourMax = parseInt((this._defaults.hourMax - ((this._defaults.hourMax - this._defaults.hourMin) % this._defaults.stepHour)), 10),
					minMax = parseInt((this._defaults.minuteMax - ((this._defaults.minuteMax - this._defaults.minuteMin) % this._defaults.stepMinute)), 10),
					secMax = parseInt((this._defaults.secondMax - ((this._defaults.secondMax - this._defaults.secondMin) % this._defaults.stepSecond)), 10),
					millisecMax = parseInt((this._defaults.millisecMax - ((this._defaults.millisecMax - this._defaults.millisecMin) % this._defaults.stepMillisec)), 10),
					microsecMax = parseInt((this._defaults.microsecMax - ((this._defaults.microsecMax - this._defaults.microsecMin) % this._defaults.stepMicrosec)), 10);

				if (this.hour_slider) {
					this.control.options(this, this.hour_slider, 'hour', { min: this._defaults.hourMin, max: hourMax, step: this._defaults.stepHour });
					this.control.value(this, this.hour_slider, 'hour', this.hour - (this.hour % this._defaults.stepHour));
				}
				if (this.minute_slider) {
					this.control.options(this, this.minute_slider, 'minute', { min: this._defaults.minuteMin, max: minMax, step: this._defaults.stepMinute });
					this.control.value(this, this.minute_slider, 'minute', this.minute - (this.minute % this._defaults.stepMinute));
				}
				if (this.second_slider) {
					this.control.options(this, this.second_slider, 'second', { min: this._defaults.secondMin, max: secMax, step: this._defaults.stepSecond });
					this.control.value(this, this.second_slider, 'second', this.second - (this.second % this._defaults.stepSecond));
				}
				if (this.millisec_slider) {
					this.control.options(this, this.millisec_slider, 'millisec', { min: this._defaults.millisecMin, max: millisecMax, step: this._defaults.stepMillisec });
					this.control.value(this, this.millisec_slider, 'millisec', this.millisec - (this.millisec % this._defaults.stepMillisec));
				}
				if (this.microsec_slider) {
					this.control.options(this, this.microsec_slider, 'microsec', { min: this._defaults.microsecMin, max: microsecMax, step: this._defaults.stepMicrosec });
					this.control.value(this, this.microsec_slider, 'microsec', this.microsec - (this.microsec % this._defaults.stepMicrosec));
				}
			}

		},

		/*
		* when a slider moves, set the internal time...
		* on time change is also called when the time is updated in the text field
		*/
		_onTimeChange: function () {
			if (!this._defaults.showTimepicker) {
                                return;
			}
			var hour = (this.hour_slider) ? this.control.value(this, this.hour_slider, 'hour') : false,
				minute = (this.minute_slider) ? this.control.value(this, this.minute_slider, 'minute') : false,
				second = (this.second_slider) ? this.control.value(this, this.second_slider, 'second') : false,
				millisec = (this.millisec_slider) ? this.control.value(this, this.millisec_slider, 'millisec') : false,
				microsec = (this.microsec_slider) ? this.control.value(this, this.microsec_slider, 'microsec') : false,
				timezone = (this.timezone_select) ? this.timezone_select.val() : false,
				o = this._defaults,
				pickerTimeFormat = o.pickerTimeFormat || o.timeFormat,
				pickerTimeSuffix = o.pickerTimeSuffix || o.timeSuffix;

			if (typeof(hour) === 'object') {
				hour = false;
			}
			if (typeof(minute) === 'object') {
				minute = false;
			}
			if (typeof(second) === 'object') {
				second = false;
			}
			if (typeof(millisec) === 'object') {
				millisec = false;
			}
			if (typeof(microsec) === 'object') {
				microsec = false;
			}
			if (typeof(timezone) === 'object') {
				timezone = false;
			}

			if (hour !== false) {
				hour = parseInt(hour, 10);
			}
			if (minute !== false) {
				minute = parseInt(minute, 10);
			}
			if (second !== false) {
				second = parseInt(second, 10);
			}
			if (millisec !== false) {
				millisec = parseInt(millisec, 10);
			}
			if (microsec !== false) {
				microsec = parseInt(microsec, 10);
			}
			if (timezone !== false) {
				timezone = timezone.toString();
			}

			var ampm = o[hour < 12 ? 'amNames' : 'pmNames'][0];

			// If the update was done in the input field, the input field should not be updated.
			// If the update was done using the sliders, update the input field.
			var hasChanged = (
						hour !== parseInt(this.hour,10) || // sliders should all be numeric
						minute !== parseInt(this.minute,10) ||
						second !== parseInt(this.second,10) ||
						millisec !== parseInt(this.millisec,10) ||
						microsec !== parseInt(this.microsec,10) ||
						(this.ampm.length > 0 && (hour < 12) !== ($.inArray(this.ampm.toUpperCase(), this.amNames) !== -1)) ||
						(this.timezone !== null && timezone !== this.timezone.toString()) // could be numeric or "EST" format, so use toString()
					);

			if (hasChanged) {

				if (hour !== false) {
					this.hour = hour;
				}
				if (minute !== false) {
					this.minute = minute;
				}
				if (second !== false) {
					this.second = second;
				}
				if (millisec !== false) {
					this.millisec = millisec;
				}
				if (microsec !== false) {
					this.microsec = microsec;
				}
				if (timezone !== false) {
					this.timezone = timezone;
				}

				if (!this.inst) {
					this.inst = $.datepicker._getInst(this.$input[0]);
				}

				this._limitMinMaxDateTime(this.inst, true);
			}
			if (this.support.ampm) {
				this.ampm = ampm;
			}

			// Updates the time within the timepicker
			this.formattedTime = $.datepicker.formatTime(o.timeFormat, this, o);
			if (this.$timeObj) {
				if (pickerTimeFormat === o.timeFormat) {
					this.$timeObj.val(this.formattedTime + pickerTimeSuffix);
				}
				else {
					this.$timeObj.val($.datepicker.formatTime(pickerTimeFormat, this, o) + pickerTimeSuffix);
				}
				if (this.$timeObj[0].setSelectionRange) {
					var sPos = this.$timeObj[0].selectionStart;
					var ePos = this.$timeObj[0].selectionEnd;
					this.$timeObj[0].setSelectionRange(sPos, ePos);
				}
			}

			this.timeDefined = true;
			if (hasChanged) {
				this._updateDateTime();
				//this.$input.focus(); // may automatically open the picker on setDate
			}
		},

		/*
		* call custom onSelect.
		* bind to sliders slidestop, and grid click.
		*/
		_onSelectHandler: function () {
			var onSelect = this._defaults.onSelect || this.inst.settings.onSelect;
			var inputEl = this.$input ? this.$input[0] : null;
			if (onSelect && inputEl) {
				onSelect.apply(inputEl, [this.formattedDateTime, this]);
			}
		},

		/*
		* update our input with the new date time..
		*/
		_updateDateTime: function (dp_inst) {
			dp_inst = this.inst || dp_inst;
			var dtTmp = (dp_inst.currentYear > 0?
							new Date(dp_inst.currentYear, dp_inst.currentMonth, dp_inst.currentDay) :
							new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
				dt = $.datepicker._daylightSavingAdjust(dtTmp),
				//dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
				//dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.currentYear, dp_inst.currentMonth, dp_inst.currentDay)),
				dateFmt = $.datepicker._get(dp_inst, 'dateFormat'),
				formatCfg = $.datepicker._getFormatConfig(dp_inst),
				timeAvailable = dt !== null && this.timeDefined;
			this.formattedDate = $.datepicker.formatDate(dateFmt, (dt === null ? new Date() : dt), formatCfg);
			var formattedDateTime = this.formattedDate;

			// if a slider was changed but datepicker doesn't have a value yet, set it
			if (dp_inst.lastVal === "") {
                dp_inst.currentYear = dp_inst.selectedYear;
                dp_inst.currentMonth = dp_inst.selectedMonth;
                dp_inst.currentDay = dp_inst.selectedDay;
            }

			/*
			* remove following lines to force every changes in date picker to change the input value
			* Bug descriptions: when an input field has a default value, and click on the field to pop up the date picker.
			* If the user manually empty the value in the input field, the date picker will never change selected value.
			*/
			//if (dp_inst.lastVal !== undefined && (dp_inst.lastVal.length > 0 && this.$input.val().length === 0)) {
			//	return;
			//}

			if (this._defaults.timeOnly === true && this._defaults.timeOnlyShowDate === false) {
				formattedDateTime = this.formattedTime;
			} else if ((this._defaults.timeOnly !== true && (this._defaults.alwaysSetTime || timeAvailable)) || (this._defaults.timeOnly === true && this._defaults.timeOnlyShowDate === true)) {
				formattedDateTime += this._defaults.separator + this.formattedTime + this._defaults.timeSuffix;
			}

			this.formattedDateTime = formattedDateTime;

			if (!this._defaults.showTimepicker) {
				this.$input.val(this.formattedDate);
			} else if (this.$altInput && this._defaults.timeOnly === false && this._defaults.altFieldTimeOnly === true) {
				this.$altInput.val(this.formattedTime);
				this.$input.val(this.formattedDate);
			} else if (this.$altInput) {
				this.$input.val(formattedDateTime);
				var altFormattedDateTime = '',
					altSeparator = this._defaults.altSeparator !== null ? this._defaults.altSeparator : this._defaults.separator,
					altTimeSuffix = this._defaults.altTimeSuffix !== null ? this._defaults.altTimeSuffix : this._defaults.timeSuffix;

				if (!this._defaults.timeOnly) {
					if (this._defaults.altFormat) {
						altFormattedDateTime = $.datepicker.formatDate(this._defaults.altFormat, (dt === null ? new Date() : dt), formatCfg);
					}
					else {
						altFormattedDateTime = this.formattedDate;
					}

					if (altFormattedDateTime) {
						altFormattedDateTime += altSeparator;
					}
				}

				if (this._defaults.altTimeFormat !== null) {
					altFormattedDateTime += $.datepicker.formatTime(this._defaults.altTimeFormat, this, this._defaults) + altTimeSuffix;
				}
				else {
					altFormattedDateTime += this.formattedTime + altTimeSuffix;
				}
				this.$altInput.val(altFormattedDateTime);
			} else {
				this.$input.val(formattedDateTime);
			}

			this.$input.trigger("change");
		},

		_onFocus: function () {
			if (!this.$input.val() && this._defaults.defaultValue) {
				this.$input.val(this._defaults.defaultValue);
				var inst = $.datepicker._getInst(this.$input.get(0)),
					tp_inst = $.datepicker._get(inst, 'timepicker');
				if (tp_inst) {
					if (tp_inst._defaults.timeOnly && (inst.input.val() !== inst.lastVal)) {
						try {
							$.datepicker._updateDatepicker(inst);
						} catch (err) {
							$.timepicker.log(err);
						}
					}
				}
			}
		},

		/*
		* Small abstraction to control types
		* We can add more, just be sure to follow the pattern: create, options, value
		*/
		_controls: {
			// slider methods
			slider: {
				create: function (tp_inst, obj, unit, val, min, max, step) {
					var rtl = tp_inst._defaults.isRTL; // if rtl go -60->0 instead of 0->60
					return obj.prop('slide', null).slider({
						orientation: "horizontal",
						value: rtl ? val * -1 : val,
						min: rtl ? max * -1 : min,
						max: rtl ? min * -1 : max,
						step: step,
						slide: function (event, ui) {
							tp_inst.control.value(tp_inst, $(this), unit, rtl ? ui.value * -1 : ui.value);
							tp_inst._onTimeChange();
						},
						stop: function (event, ui) {
							tp_inst._onSelectHandler();
						}
					});
				},
				options: function (tp_inst, obj, unit, opts, val) {
					if (tp_inst._defaults.isRTL) {
						if (typeof(opts) === 'string') {
							if (opts === 'min' || opts === 'max') {
								if (val !== undefined) {
									return obj.slider(opts, val * -1);
								}
								return Math.abs(obj.slider(opts));
							}
							return obj.slider(opts);
						}
						var min = opts.min,
							max = opts.max;
						opts.min = opts.max = null;
						if (min !== undefined) {
							opts.max = min * -1;
						}
						if (max !== undefined) {
							opts.min = max * -1;
						}
						return obj.slider(opts);
					}
					if (typeof(opts) === 'string' && val !== undefined) {
						return obj.slider(opts, val);
					}
					return obj.slider(opts);
				},
				value: function (tp_inst, obj, unit, val) {
					if (tp_inst._defaults.isRTL) {
						if (val !== undefined) {
							return obj.slider('value', val * -1);
						}
						return Math.abs(obj.slider('value'));
					}
					if (val !== undefined) {
						return obj.slider('value', val);
					}
					return obj.slider('value');
				}
			},
			// select methods
			select: {
				create: function (tp_inst, obj, unit, val, min, max, step) {
					var sel = '<select class="ui-timepicker-select ui-state-default ui-corner-all" data-unit="' + unit + '" data-min="' + min + '" data-max="' + max + '" data-step="' + step + '">',
						format = tp_inst._defaults.pickerTimeFormat || tp_inst._defaults.timeFormat;

					for (var i = min; i <= max; i += step) {
						sel += '<option value="' + i + '"' + (i === val ? ' selected' : '') + '>';
						if (unit === 'hour') {
							sel += $.datepicker.formatTime($.trim(format.replace(/[^ht ]/ig, '')), {hour: i}, tp_inst._defaults);
						}
						else if (unit === 'millisec' || unit === 'microsec' || i >= 10) { sel += i; }
						else {sel += '0' + i.toString(); }
						sel += '</option>';
					}
					sel += '</select>';

					obj.children('select').remove();

					$(sel).appendTo(obj).change(function (e) {
						tp_inst._onTimeChange();
						tp_inst._onSelectHandler();
						tp_inst._afterInject();
					});

					return obj;
				},
				options: function (tp_inst, obj, unit, opts, val) {
					var o = {},
						$t = obj.children('select');
					if (typeof(opts) === 'string') {
						if (val === undefined) {
							return $t.data(opts);
						}
						o[opts] = val;
					}
					else { o = opts; }
					return tp_inst.control.create(tp_inst, obj, $t.data('unit'), $t.val(), o.min>=0 ? o.min : $t.data('min'), o.max || $t.data('max'), o.step || $t.data('step'));
				},
				value: function (tp_inst, obj, unit, val) {
					var $t = obj.children('select');
					if (val !== undefined) {
						return $t.val(val);
					}
					return $t.val();
				}
			}
		} // end _controls

	});

	$.fn.extend({
		/*
		* shorthand just to use timepicker.
		*/
		timepicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);

			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					timeOnly: true
				});
			}

			return $(this).each(function () {
				$.fn.datetimepicker.apply($(this), tmp_args);
			});
		},

		/*
		* extend timepicker to datepicker
		*/
		datetimepicker: function (o) {
			o = o || {};
			var tmp_args = arguments;

			if (typeof(o) === 'string') {
				if (o === 'getDate'  || (o === 'option' && tmp_args.length === 2 && typeof (tmp_args[1]) === 'string')) {
					return $.fn.datepicker.apply($(this[0]), tmp_args);
				} else {
					return this.each(function () {
						var $t = $(this);
						$t.datepicker.apply($t, tmp_args);
					});
				}
			} else {
				return this.each(function () {
					var $t = $(this);
					$t.datepicker($.timepicker._newInst($t, o)._defaults);
				});
			}
		}
	});

	/*
	* Public Utility to parse date and time
	*/
	$.datepicker.parseDateTime = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var parseRes = parseDateTimeInternal(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings);
		if (parseRes.timeObj) {
			var t = parseRes.timeObj;
			parseRes.date.setHours(t.hour, t.minute, t.second, t.millisec);
			parseRes.date.setMicroseconds(t.microsec);
		}

		return parseRes.date;
	};

	/*
	* Public utility to parse time
	*/
	$.datepicker.parseTime = function (timeFormat, timeString, options) {
		var o = extendRemove(extendRemove({}, $.timepicker._defaults), options || {}),
			iso8601 = (timeFormat.replace(/\'.*?\'/g, '').indexOf('Z') !== -1);

		// Strict parse requires the timeString to match the timeFormat exactly
		var strictParse = function (f, s, o) {

			// pattern for standard and localized AM/PM markers
			var getPatternAmpm = function (amNames, pmNames) {
				var markers = [];
				if (amNames) {
					$.merge(markers, amNames);
				}
				if (pmNames) {
					$.merge(markers, pmNames);
				}
				markers = $.map(markers, function (val) {
					return val.replace(/[.*+?|()\[\]{}\\]/g, '\\$&');
				});
				return '(' + markers.join('|') + ')?';
			};

			// figure out position of time elements.. cause js cant do named captures
			var getFormatPositions = function (timeFormat) {
				var finds = timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|c{1}|t{1,2}|z|'.*?')/g),
					orders = {
						h: -1,
						m: -1,
						s: -1,
						l: -1,
						c: -1,
						t: -1,
						z: -1
					};

				if (finds) {
					for (var i = 0; i < finds.length; i++) {
						if (orders[finds[i].toString().charAt(0)] === -1) {
							orders[finds[i].toString().charAt(0)] = i + 1;
						}
					}
				}
				return orders;
			};

			var regstr = '^' + f.toString()
					.replace(/([hH]{1,2}|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g, function (match) {
							var ml = match.length;
							switch (match.charAt(0).toLowerCase()) {
							case 'h':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 'm':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 's':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 'l':
								return '(\\d?\\d?\\d)';
							case 'c':
								return '(\\d?\\d?\\d)';
							case 'z':
								return '(z|[-+]\\d\\d:?\\d\\d|\\S+)?';
							case 't':
								return getPatternAmpm(o.amNames, o.pmNames);
							default:    // literal escaped in quotes
								return '(' + match.replace(/\'/g, "").replace(/(\.|\$|\^|\\|\/|\(|\)|\[|\]|\?|\+|\*)/g, function (m) { return "\\" + m; }) + ')?';
							}
						})
					.replace(/\s/g, '\\s?') +
					o.timeSuffix + '$',
				order = getFormatPositions(f),
				ampm = '',
				treg;

			treg = s.match(new RegExp(regstr, 'i'));

			var resTime = {
				hour: 0,
				minute: 0,
				second: 0,
				millisec: 0,
				microsec: 0
			};

			if (treg) {
				if (order.t !== -1) {
					if (treg[order.t] === undefined || treg[order.t].length === 0) {
						ampm = '';
						resTime.ampm = '';
					} else {
						ampm = $.inArray(treg[order.t].toUpperCase(), $.map(o.amNames, function (x,i) { return x.toUpperCase(); })) !== -1 ? 'AM' : 'PM';
						resTime.ampm = o[ampm === 'AM' ? 'amNames' : 'pmNames'][0];
					}
				}

				if (order.h !== -1) {
					if (ampm === 'AM' && treg[order.h] === '12') {
						resTime.hour = 0; // 12am = 0 hour
					} else {
						if (ampm === 'PM' && treg[order.h] !== '12') {
							resTime.hour = parseInt(treg[order.h], 10) + 12; // 12pm = 12 hour, any other pm = hour + 12
						} else {
							resTime.hour = Number(treg[order.h]);
						}
					}
				}

				if (order.m !== -1) {
					resTime.minute = Number(treg[order.m]);
				}
				if (order.s !== -1) {
					resTime.second = Number(treg[order.s]);
				}
				if (order.l !== -1) {
					resTime.millisec = Number(treg[order.l]);
				}
				if (order.c !== -1) {
					resTime.microsec = Number(treg[order.c]);
				}
				if (order.z !== -1 && treg[order.z] !== undefined) {
					resTime.timezone = $.timepicker.timezoneOffsetNumber(treg[order.z]);
				}


				return resTime;
			}
			return false;
		};// end strictParse

		// First try JS Date, if that fails, use strictParse
		var looseParse = function (f, s, o) {
			try {
				var d = new Date('2012-01-01 ' + s);
				if (isNaN(d.getTime())) {
					d = new Date('2012-01-01T' + s);
					if (isNaN(d.getTime())) {
						d = new Date('01/01/2012 ' + s);
						if (isNaN(d.getTime())) {
							throw "Unable to parse time with native Date: " + s;
						}
					}
				}

				return {
					hour: d.getHours(),
					minute: d.getMinutes(),
					second: d.getSeconds(),
					millisec: d.getMilliseconds(),
					microsec: d.getMicroseconds(),
					timezone: d.getTimezoneOffset() * -1
				};
			}
			catch (err) {
				try {
					return strictParse(f, s, o);
				}
				catch (err2) {
					$.timepicker.log("Unable to parse \ntimeString: " + s + "\ntimeFormat: " + f);
				}
			}
			return false;
		}; // end looseParse

		if (typeof o.parse === "function") {
			return o.parse(timeFormat, timeString, o);
		}
		if (o.parse === 'loose') {
			return looseParse(timeFormat, timeString, o);
		}
		return strictParse(timeFormat, timeString, o);
	};

	/**
	 * Public utility to format the time
	 * @param {string} format format of the time
	 * @param {Object} time Object not a Date for timezones
	 * @param {Object} [options] essentially the regional[].. amNames, pmNames, ampm
	 * @returns {string} the formatted time
	 */
	$.datepicker.formatTime = function (format, time, options) {
		options = options || {};
		options = $.extend({}, $.timepicker._defaults, options);
		time = $.extend({
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			microsec: 0,
			timezone: null
		}, time);

		var tmptime = format,
			ampmName = options.amNames[0],
			hour = parseInt(time.hour, 10);

		if (hour > 11) {
			ampmName = options.pmNames[0];
		}

		tmptime = tmptime.replace(/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g, function (match) {
			switch (match) {
			case 'HH':
				return ('0' + hour).slice(-2);
			case 'H':
				return hour;
			case 'hh':
				return ('0' + convert24to12(hour)).slice(-2);
			case 'h':
				return convert24to12(hour);
			case 'mm':
				return ('0' + time.minute).slice(-2);
			case 'm':
				return time.minute;
			case 'ss':
				return ('0' + time.second).slice(-2);
			case 's':
				return time.second;
			case 'l':
				return ('00' + time.millisec).slice(-3);
			case 'c':
				return ('00' + time.microsec).slice(-3);
			case 'z':
				return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, false);
			case 'Z':
				return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, true);
			case 'T':
				return ampmName.charAt(0).toUpperCase();
			case 'TT':
				return ampmName.toUpperCase();
			case 't':
				return ampmName.charAt(0).toLowerCase();
			case 'tt':
				return ampmName.toLowerCase();
			default:
				return match.replace(/'/g, "");
			}
		});

		return tmptime;
	};

	/*
	* the bad hack :/ override datepicker so it doesn't close on select
	// inspired: http://stackoverflow.com/questions/1252512/jquery-datepicker-prevent-closing-picker-when-clicking-a-date/1762378#1762378
	*/
	$.datepicker._base_selectDate = $.datepicker._selectDate;
	$.datepicker._selectDate = function (id, dateStr) {
		var inst = this._getInst($(id)[0]),
			tp_inst = this._get(inst, 'timepicker'),
			was_inline;

		if (tp_inst && inst.settings.showTimepicker) {
			tp_inst._limitMinMaxDateTime(inst, true);
			was_inline = inst.inline;
			inst.inline = inst.stay_open = true;
			//This way the onSelect handler called from calendarpicker get the full dateTime
			this._base_selectDate(id, dateStr);
			inst.inline = was_inline;
			inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);
		} else {
			this._base_selectDate(id, dateStr);
		}
	};

	/*
	* second bad hack :/ override datepicker so it triggers an event when changing the input field
	* and does not redraw the datepicker on every selectDate event
	*/
	$.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function (inst) {

		// don't popup the datepicker if there is another instance already opened
		var input = inst.input[0];
		if ($.datepicker._curInst && $.datepicker._curInst !== inst && $.datepicker._datepickerShowing && $.datepicker._lastInput !== input) {
			return;
		}

		if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {

			this._base_updateDatepicker(inst);

			// Reload the time control when changing something in the input text field.
			var tp_inst = this._get(inst, 'timepicker');
			if (tp_inst) {
				tp_inst._addTimePicker(inst);
			}
		}
	};

	/*
	* third bad hack :/ override datepicker so it allows spaces and colon in the input field
	*/
	$.datepicker._base_doKeyPress = $.datepicker._doKeyPress;
	$.datepicker._doKeyPress = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
			if ($.datepicker._get(inst, 'constrainInput')) {
				var ampm = tp_inst.support.ampm,
					tz = tp_inst._defaults.showTimezone !== null ? tp_inst._defaults.showTimezone : tp_inst.support.timezone,
					dateChars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat')),
					datetimeChars = tp_inst._defaults.timeFormat.toString()
											.replace(/[hms]/g, '')
											.replace(/TT/g, ampm ? 'APM' : '')
											.replace(/Tt/g, ampm ? 'AaPpMm' : '')
											.replace(/tT/g, ampm ? 'AaPpMm' : '')
											.replace(/T/g, ampm ? 'AP' : '')
											.replace(/tt/g, ampm ? 'apm' : '')
											.replace(/t/g, ampm ? 'ap' : '') +
											" " + tp_inst._defaults.separator +
											tp_inst._defaults.timeSuffix +
											(tz ? tp_inst._defaults.timezoneList.join('') : '') +
											(tp_inst._defaults.amNames.join('')) + (tp_inst._defaults.pmNames.join('')) +
											dateChars,
					chr = String.fromCharCode(event.charCode === undefined ? event.keyCode : event.charCode);
				return event.ctrlKey || (chr < ' ' || !dateChars || datetimeChars.indexOf(chr) > -1);
			}
		}

		return $.datepicker._base_doKeyPress(event);
	};

	/*
	* Fourth bad hack :/ override _updateAlternate function used in inline mode to init altField
	* Update any alternate field to synchronise with the main field.
	*/
	$.datepicker._base_updateAlternate = $.datepicker._updateAlternate;
	$.datepicker._updateAlternate = function (inst) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var altField = tp_inst._defaults.altField;
			if (altField) { // update alternate field too
				var altFormat = tp_inst._defaults.altFormat || tp_inst._defaults.dateFormat,
					date = this._getDate(inst),
					formatCfg = $.datepicker._getFormatConfig(inst),
					altFormattedDateTime = '',
					altSeparator = tp_inst._defaults.altSeparator ? tp_inst._defaults.altSeparator : tp_inst._defaults.separator,
					altTimeSuffix = tp_inst._defaults.altTimeSuffix ? tp_inst._defaults.altTimeSuffix : tp_inst._defaults.timeSuffix,
					altTimeFormat = tp_inst._defaults.altTimeFormat !== null ? tp_inst._defaults.altTimeFormat : tp_inst._defaults.timeFormat;

				altFormattedDateTime += $.datepicker.formatTime(altTimeFormat, tp_inst, tp_inst._defaults) + altTimeSuffix;
				if (!tp_inst._defaults.timeOnly && !tp_inst._defaults.altFieldTimeOnly && date !== null) {
					if (tp_inst._defaults.altFormat) {
						altFormattedDateTime = $.datepicker.formatDate(tp_inst._defaults.altFormat, date, formatCfg) + altSeparator + altFormattedDateTime;
					}
					else {
						altFormattedDateTime = tp_inst.formattedDate + altSeparator + altFormattedDateTime;
					}
				}
				$(altField).val( inst.input.val() ? altFormattedDateTime : "");
			}
		}
		else {
			$.datepicker._base_updateAlternate(inst);
		}
	};

	/*
	* Override key up event to sync manual input changes.
	*/
	$.datepicker._base_doKeyUp = $.datepicker._doKeyUp;
	$.datepicker._doKeyUp = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
			if (tp_inst._defaults.timeOnly && (inst.input.val() !== inst.lastVal)) {
				try {
					$.datepicker._updateDatepicker(inst);
				} catch (err) {
					$.timepicker.log(err);
				}
			}
		}

		return $.datepicker._base_doKeyUp(event);
	};

	/*
	* override "Today" button to also grab the time and set it to input field.
	*/
	$.datepicker._base_gotoToday = $.datepicker._gotoToday;
	$.datepicker._gotoToday = function (id) {
		var inst = this._getInst($(id)[0]);
		this._base_gotoToday(id);
		var tp_inst = this._get(inst, 'timepicker');
		if (!tp_inst) {
		  return;
		}

		var tzoffset = $.timepicker.timezoneOffsetNumber(tp_inst.timezone);
		var now = new Date();
		now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + parseInt(tzoffset, 10));
		this._setTime(inst, now);
		this._setDate(inst, now);
		tp_inst._onSelectHandler();
	};

	/*
	* Disable & enable the Time in the datetimepicker
	*/
	$.datepicker._disableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			inst.settings.showTimepicker = false;
			tp_inst._defaults.showTimepicker = false;
			tp_inst._updateDateTime(inst);
		}
	};

	$.datepicker._enableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			inst.settings.showTimepicker = true;
			tp_inst._defaults.showTimepicker = true;
			tp_inst._addTimePicker(inst); // Could be disabled on page load
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create our own set time function
	*/
	$.datepicker._setTime = function (inst, date) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var defaults = tp_inst._defaults;

			// calling _setTime with no date sets time to defaults
			tp_inst.hour = date ? date.getHours() : defaults.hour;
			tp_inst.minute = date ? date.getMinutes() : defaults.minute;
			tp_inst.second = date ? date.getSeconds() : defaults.second;
			tp_inst.millisec = date ? date.getMilliseconds() : defaults.millisec;
			tp_inst.microsec = date ? date.getMicroseconds() : defaults.microsec;

			//check if within min/max times..
			tp_inst._limitMinMaxDateTime(inst, true);

			tp_inst._onTimeChange();
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create new public method to set only time, callable as $().datepicker('setTime', date)
	*/
	$.datepicker._setTimeDatepicker = function (target, date, withDate) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			this._setDateFromField(inst);
			var tp_date;
			if (date) {
				if (typeof date === "string") {
					tp_inst._parseTime(date, withDate);
					tp_date = new Date();
					tp_date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
					tp_date.setMicroseconds(tp_inst.microsec);
				} else {
					tp_date = new Date(date.getTime());
					tp_date.setMicroseconds(date.getMicroseconds());
				}
				if (tp_date.toString() === 'Invalid Date') {
					tp_date = undefined;
				}
				this._setTime(inst, tp_date);
			}
		}

	};

	/*
	* override setDate() to allow setting time too within Date object
	*/
	$.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker;
	$.datepicker._setDateDatepicker = function (target, _date) {
		var inst = this._getInst(target);
		var date = _date;
		if (!inst) {
			return;
		}

		if (typeof(_date) === 'string') {
			date = new Date(_date);
			if (!date.getTime()) {
				this._base_setDateDatepicker.apply(this, arguments);
				date = $(target).datepicker('getDate');
			}
		}

		var tp_inst = this._get(inst, 'timepicker');
		var tp_date;
		if (date instanceof Date) {
			tp_date = new Date(date.getTime());
			tp_date.setMicroseconds(date.getMicroseconds());
		} else {
			tp_date = date;
		}

		// This is important if you are using the timezone option, javascript's Date
		// object will only return the timezone offset for the current locale, so we
		// adjust it accordingly.  If not using timezone option this won't matter..
		// If a timezone is different in tp, keep the timezone as is
		if (tp_inst && tp_date) {
			// look out for DST if tz wasn't specified
			if (!tp_inst.support.timezone && tp_inst._defaults.timezone === null) {
				tp_inst.timezone = tp_date.getTimezoneOffset() * -1;
			}
			date = $.timepicker.timezoneAdjust(date, $.timepicker.timezoneOffsetString(-date.getTimezoneOffset()), tp_inst.timezone);
			tp_date = $.timepicker.timezoneAdjust(tp_date, $.timepicker.timezoneOffsetString(-tp_date.getTimezoneOffset()), tp_inst.timezone);
		}

		this._updateDatepicker(inst);
		this._base_setDateDatepicker.apply(this, arguments);
		this._setTimeDatepicker(target, tp_date, true);
	};

	/*
	* override getDate() to allow getting time too within Date object
	*/
	$.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker;
	$.datepicker._getDateDatepicker = function (target, noDefault) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			// if it hasn't yet been defined, grab from field
			if (inst.lastVal === undefined) {
				this._setDateFromField(inst, noDefault);
			}

			var date = this._getDate(inst);

			var currDT = null;

			if (tp_inst.$altInput && tp_inst._defaults.altFieldTimeOnly) {
				currDT = tp_inst.$input.val() + ' ' + tp_inst.$altInput.val();
			}
			else if (tp_inst.$input.get(0).tagName !== 'INPUT' && tp_inst.$altInput) {
				/**
				 * in case the datetimepicker has been applied to a non-input tag for inline UI,
				 * and the user has not configured the plugin to display only time in altInput,
				 * pick current date time from the altInput (and hope for the best, for now, until "ER1" is applied)
				 *
				 * @todo ER1. Since altInput can have a totally difference format, convert it to standard format by reading input format from "altFormat" and "altTimeFormat" option values
				 */
				currDT = tp_inst.$altInput.val();
			}
			else {
				currDT = tp_inst.$input.val();
			}

			if (date && tp_inst._parseTime(currDT, !inst.settings.timeOnly)) {
				date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
				date.setMicroseconds(tp_inst.microsec);

				// This is important if you are using the timezone option, javascript's Date
				// object will only return the timezone offset for the current locale, so we
				// adjust it accordingly.  If not using timezone option this won't matter..
				if (tp_inst.timezone != null) {
					// look out for DST if tz wasn't specified
					if (!tp_inst.support.timezone && tp_inst._defaults.timezone === null) {
						tp_inst.timezone = date.getTimezoneOffset() * -1;
					}
					date = $.timepicker.timezoneAdjust(date, tp_inst.timezone, $.timepicker.timezoneOffsetString(-date.getTimezoneOffset()));
				}
			}
			return date;
		}
		return this._base_getDateDatepicker(target, noDefault);
	};

	/*
	* override parseDate() because UI 1.8.14 throws an error about "Extra characters"
	* An option in datapicker to ignore extra format characters would be nicer.
	*/
	$.datepicker._base_parseDate = $.datepicker.parseDate;
	$.datepicker.parseDate = function (format, value, settings) {
		var date;
		try {
			date = this._base_parseDate(format, value, settings);
		} catch (err) {
			// Hack!  The error message ends with a colon, a space, and
			// the "extra" characters.  We rely on that instead of
			// attempting to perfectly reproduce the parsing algorithm.
			if (err.indexOf(":") >= 0) {
				date = this._base_parseDate(format, value.substring(0, value.length - (err.length - err.indexOf(':') - 2)), settings);
				$.timepicker.log("Error parsing the date string: " + err + "\ndate string = " + value + "\ndate format = " + format);
			} else {
				throw err;
			}
		}
		return date;
	};

	/*
	* override formatDate to set date with time to the input
	*/
	$.datepicker._base_formatDate = $.datepicker._formatDate;
	$.datepicker._formatDate = function (inst, day, month, year) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			tp_inst._updateDateTime(inst);
			return tp_inst.$input.val();
		}
		return this._base_formatDate(inst);
	};

	/*
	* override options setter to add time to maxDate(Time) and minDate(Time). MaxDate
	*/
	$.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker;
	$.datepicker._optionDatepicker = function (target, name, value) {
		var inst = this._getInst(target),
			name_clone;
		if (!inst) {
			return null;
		}

		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var min = null,
				max = null,
				onselect = null,
				overrides = tp_inst._defaults.evnts,
				fns = {},
				prop,
				ret,
				oldVal,
				$target;
			if (typeof name === 'string') { // if min/max was set with the string
				if (name === 'minDate' || name === 'minDateTime') {
					min = value;
				} else if (name === 'maxDate' || name === 'maxDateTime') {
					max = value;
				} else if (name === 'onSelect') {
					onselect = value;
				} else if (overrides.hasOwnProperty(name)) {
					if (typeof (value) === 'undefined') {
						return overrides[name];
					}
					fns[name] = value;
					name_clone = {}; //empty results in exiting function after overrides updated
				}
			} else if (typeof name === 'object') { //if min/max was set with the JSON
				if (name.minDate) {
					min = name.minDate;
				} else if (name.minDateTime) {
					min = name.minDateTime;
				} else if (name.maxDate) {
					max = name.maxDate;
				} else if (name.maxDateTime) {
					max = name.maxDateTime;
				}
				for (prop in overrides) {
					if (overrides.hasOwnProperty(prop) && name[prop]) {
						fns[prop] = name[prop];
					}
				}
			}
			for (prop in fns) {
				if (fns.hasOwnProperty(prop)) {
					overrides[prop] = fns[prop];
					if (!name_clone) { name_clone = $.extend({}, name); }
					delete name_clone[prop];
				}
			}
			if (name_clone && isEmptyObject(name_clone)) { return; }
			if (min) { //if min was set
				if (min === 0) {
					min = new Date();
				} else {
					min = new Date(min);
				}
				tp_inst._defaults.minDate = min;
				tp_inst._defaults.minDateTime = min;
			} else if (max) { //if max was set
				if (max === 0) {
					max = new Date();
				} else {
					max = new Date(max);
				}
				tp_inst._defaults.maxDate = max;
				tp_inst._defaults.maxDateTime = max;
			} else if (onselect) {
				tp_inst._defaults.onSelect = onselect;
			}

			// Datepicker will override our date when we call _base_optionDatepicker when
			// calling minDate/maxDate, so we will first grab the value, call
			// _base_optionDatepicker, then set our value back.
			if(min || max){
				$target = $(target);
				oldVal = $target.datetimepicker('getDate');
				ret = this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
				$target.datetimepicker('setDate', oldVal);
				return ret;
			}
		}
		if (value === undefined) {
			return this._base_optionDatepicker.call($.datepicker, target, name);
		}
		return this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
	};

	/*
	* jQuery isEmptyObject does not check hasOwnProperty - if someone has added to the object prototype,
	* it will return false for all objects
	*/
	var isEmptyObject = function (obj) {
		var prop;
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	};

	/*
	* jQuery extend now ignores nulls!
	*/
	var extendRemove = function (target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] === null || props[name] === undefined) {
				target[name] = props[name];
			}
		}
		return target;
	};

	/*
	* Determine by the time format which units are supported
	* Returns an object of booleans for each unit
	*/
	var detectSupport = function (timeFormat) {
		var tf = timeFormat.replace(/'.*?'/g, '').toLowerCase(), // removes literals
			isIn = function (f, t) { // does the format contain the token?
					return f.indexOf(t) !== -1 ? true : false;
				};
		return {
				hour: isIn(tf, 'h'),
				minute: isIn(tf, 'm'),
				second: isIn(tf, 's'),
				millisec: isIn(tf, 'l'),
				microsec: isIn(tf, 'c'),
				timezone: isIn(tf, 'z'),
				ampm: isIn(tf, 't') && isIn(timeFormat, 'h'),
				iso8601: isIn(timeFormat, 'Z')
			};
	};

	/*
	* Converts 24 hour format into 12 hour
	* Returns 12 hour without leading 0
	*/
	var convert24to12 = function (hour) {
		hour %= 12;

		if (hour === 0) {
			hour = 12;
		}

		return String(hour);
	};

	var computeEffectiveSetting = function (settings, property) {
		return settings && settings[property] ? settings[property] : $.timepicker._defaults[property];
	};

	/*
	* Splits datetime string into date and time substrings.
	* Throws exception when date can't be parsed
	* Returns {dateString: dateString, timeString: timeString}
	*/
	var splitDateTime = function (dateTimeString, timeSettings) {
		// The idea is to get the number separator occurrences in datetime and the time format requested (since time has
		// fewer unknowns, mostly numbers and am/pm). We will use the time pattern to split.
		var separator = computeEffectiveSetting(timeSettings, 'separator'),
			format = computeEffectiveSetting(timeSettings, 'timeFormat'),
			timeParts = format.split(separator), // how many occurrences of separator may be in our format?
			timePartsLen = timeParts.length,
			allParts = dateTimeString.split(separator),
			allPartsLen = allParts.length;

		if (allPartsLen > 1) {
			return {
				dateString: allParts.splice(0, allPartsLen - timePartsLen).join(separator),
				timeString: allParts.splice(0, timePartsLen).join(separator)
			};
		}

		return {
			dateString: dateTimeString,
			timeString: ''
		};
	};

	/*
	* Internal function to parse datetime interval
	* Returns: {date: Date, timeObj: Object}, where
	*   date - parsed date without time (type Date)
	*   timeObj = {hour: , minute: , second: , millisec: , microsec: } - parsed time. Optional
	*/
	var parseDateTimeInternal = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var date,
			parts,
			parsedTime;

		parts = splitDateTime(dateTimeString, timeSettings);
		date = $.datepicker._base_parseDate(dateFormat, parts.dateString, dateSettings);

		if (parts.timeString === '') {
			return {
				date: date
			};
		}

		parsedTime = $.datepicker.parseTime(timeFormat, parts.timeString, timeSettings);

		if (!parsedTime) {
			throw 'Wrong time format';
		}

		return {
			date: date,
			timeObj: parsedTime
		};
	};

	/*
	* Internal function to set timezone_select to the local timezone
	*/
	var selectLocalTimezone = function (tp_inst, date) {
		if (tp_inst && tp_inst.timezone_select) {
			var now = date || new Date();
			tp_inst.timezone_select.val(-now.getTimezoneOffset());
		}
	};

	/*
	* Create a Singleton Instance
	*/
	$.timepicker = new Timepicker();

	/**
	 * Get the timezone offset as string from a date object (eg '+0530' for UTC+5.5)
	 * @param {number} tzMinutes if not a number, less than -720 (-1200), or greater than 840 (+1400) this value is returned
	 * @param {boolean} iso8601 if true formats in accordance to iso8601 "+12:45"
	 * @return {string}
	 */
	$.timepicker.timezoneOffsetString = function (tzMinutes, iso8601) {
		if (isNaN(tzMinutes) || tzMinutes > 840 || tzMinutes < -720) {
			return tzMinutes;
		}

		var off = tzMinutes,
			minutes = off % 60,
			hours = (off - minutes) / 60,
			iso = iso8601 ? ':' : '',
			tz = (off >= 0 ? '+' : '-') + ('0' + Math.abs(hours)).slice(-2) + iso + ('0' + Math.abs(minutes)).slice(-2);

		if (tz === '+00:00') {
			return 'Z';
		}
		return tz;
	};

	/**
	 * Get the number in minutes that represents a timezone string
	 * @param  {string} tzString formatted like "+0500", "-1245", "Z"
	 * @return {number} the offset minutes or the original string if it doesn't match expectations
	 */
	$.timepicker.timezoneOffsetNumber = function (tzString) {
		var normalized = tzString.toString().replace(':', ''); // excuse any iso8601, end up with "+1245"

		if (normalized.toUpperCase() === 'Z') { // if iso8601 with Z, its 0 minute offset
			return 0;
		}

		if (!/^(\-|\+)\d{4}$/.test(normalized)) { // possibly a user defined tz, so just give it back
			return parseInt(tzString, 10);
		}

		return ((normalized.substr(0, 1) === '-' ? -1 : 1) * // plus or minus
					((parseInt(normalized.substr(1, 2), 10) * 60) + // hours (converted to minutes)
					parseInt(normalized.substr(3, 2), 10))); // minutes
	};

	/**
	 * No way to set timezone in js Date, so we must adjust the minutes to compensate. (think setDate, getDate)
	 * @param  {Date} date
	 * @param  {string} fromTimezone formatted like "+0500", "-1245"
	 * @param  {string} toTimezone formatted like "+0500", "-1245"
	 * @return {Date}
	 */
	$.timepicker.timezoneAdjust = function (date, fromTimezone, toTimezone) {
		var fromTz = $.timepicker.timezoneOffsetNumber(fromTimezone);
		var toTz = $.timepicker.timezoneOffsetNumber(toTimezone);
		if (!isNaN(toTz)) {
			date.setMinutes(date.getMinutes() + (-fromTz) - (-toTz));
		}
		return date;
	};

	/**
	 * Calls `timepicker()` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * n.b. The input value must be correctly formatted (reformatting is not supported)
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the timepicker() call
	 * @return {jQuery}
	 */
	$.timepicker.timeRange = function (startTime, endTime, options) {
		return $.timepicker.handleRange('timepicker', startTime, endTime, options);
	};

	/**
	 * Calls `datetimepicker` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @param  {string} method Can be used to specify the type of picker to be added
	 * @return {jQuery}
	 */
	$.timepicker.datetimeRange = function (startTime, endTime, options) {
		$.timepicker.handleRange('datetimepicker', startTime, endTime, options);
	};

	/**
	 * Calls `datepicker` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @return {jQuery}
	 */
	$.timepicker.dateRange = function (startTime, endTime, options) {
		$.timepicker.handleRange('datepicker', startTime, endTime, options);
	};

	/**
	 * Calls `method` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {string} method Can be used to specify the type of picker to be added
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @return {jQuery}
	 */
	$.timepicker.handleRange = function (method, startTime, endTime, options) {
		options = $.extend({}, {
			minInterval: 0, // min allowed interval in milliseconds
			maxInterval: 0, // max allowed interval in milliseconds
			start: {},      // options for start picker
			end: {}         // options for end picker
		}, options);

		// for the mean time this fixes an issue with calling getDate with timepicker()
		var timeOnly = false;
		if(method === 'timepicker'){
			timeOnly = true;
			method = 'datetimepicker';
		}

		function checkDates(changed, other) {
			var startdt = startTime[method]('getDate'),
				enddt = endTime[method]('getDate'),
				changeddt = changed[method]('getDate');

			if (startdt !== null) {
				var minDate = new Date(startdt.getTime()),
					maxDate = new Date(startdt.getTime());

				minDate.setMilliseconds(minDate.getMilliseconds() + options.minInterval);
				maxDate.setMilliseconds(maxDate.getMilliseconds() + options.maxInterval);

				if (options.minInterval > 0 && minDate > enddt) { // minInterval check
					endTime[method]('setDate', minDate);
				}
				else if (options.maxInterval > 0 && maxDate < enddt) { // max interval check
					endTime[method]('setDate', maxDate);
				}
				else if (startdt > enddt) {
					other[method]('setDate', changeddt);
				}
			}
		}

		function selected(changed, other, option) {
			if (!changed.val()) {
				return;
			}
			var date = changed[method].call(changed, 'getDate');
			if (date !== null && options.minInterval > 0) {
				if (option === 'minDate') {
					date.setMilliseconds(date.getMilliseconds() + options.minInterval);
				}
				if (option === 'maxDate') {
					date.setMilliseconds(date.getMilliseconds() - options.minInterval);
				}
			}

			if (date.getTime) {
				other[method].call(other, 'option', option, date);
			}
		}

		$.fn[method].call(startTime, $.extend({
			timeOnly: timeOnly,
			onClose: function (dateText, inst) {
				checkDates($(this), endTime);
			},
			onSelect: function (selectedDateTime) {
				selected($(this), endTime, 'minDate');
			}
		}, options, options.start));
		$.fn[method].call(endTime, $.extend({
			timeOnly: timeOnly,
			onClose: function (dateText, inst) {
				checkDates($(this), startTime);
			},
			onSelect: function (selectedDateTime) {
				selected($(this), startTime, 'maxDate');
			}
		}, options, options.end));

		checkDates(startTime, endTime);

		selected(startTime, endTime, 'minDate');
		selected(endTime, startTime, 'maxDate');

		return $([startTime.get(0), endTime.get(0)]);
	};

	/**
	 * Log error or data to the console during error or debugging
	 * @param  {Object} err pass any type object to log to the console during error or debugging
	 * @return {void}
	 */
	$.timepicker.log = function () {
		// Older IE (9, maybe 10) throw error on accessing `window.console.log.apply`, so check first.
		if (window.console && window.console.log && window.console.log.apply) {
			window.console.log.apply(window.console, Array.prototype.slice.call(arguments));
		}
	};

	/*
	 * Add util object to allow access to private methods for testability.
	 */
	$.timepicker._util = {
		_extendRemove: extendRemove,
		_isEmptyObject: isEmptyObject,
		_convert24to12: convert24to12,
		_detectSupport: detectSupport,
		_selectLocalTimezone: selectLocalTimezone,
		_computeEffectiveSetting: computeEffectiveSetting,
		_splitDateTime: splitDateTime,
		_parseDateTimeInternal: parseDateTimeInternal
	};

	/*
	* Microsecond support
	*/
	if (!Date.prototype.getMicroseconds) {
		Date.prototype.microseconds = 0;
		Date.prototype.getMicroseconds = function () { return this.microseconds; };
		Date.prototype.setMicroseconds = function (m) {
			this.setMilliseconds(this.getMilliseconds() + Math.floor(m / 1000));
			this.microseconds = m % 1000;
			return this;
		};
	}

	/*
	* Keep up with the version
	*/
	$.timepicker.version = "1.6.3";

}));


 // includes/plugin_finance/js/finance.js

ucm.finance = {
    init: function(){
        var t = this;

        // options for editing the tax of a finance item.

        // if the user is changing the sub amount total amount manually:
        $('#finance_sub_amount').on('change',function(){
            if(!t.changing_in_progress)t.changing='total';
            t.update_finance_total();
        }).on('keyup',function(){
            if(!t.changing_in_progress)t.changing='total';
            t.update_finance_total();
        });
        // if the user is changing the sub taxable total amount manually:
        $('#finance_taxable_amount').on('change',function(){
            if(!t.changing_in_progress){
                t.changing='total';
                if(parseFloat($(this).val()) > parseFloat($('#finance_sub_amount').val())){
                    // dont let them pick a higher taxable amount than sub amount
                    $('#finance_sub_amount').val($(this).val());
                }
            }
            t.update_finance_total();
        }).on('keyup',function(){
            if(!t.changing_in_progress){
                t.changing='total';
                if(parseFloat($(this).val()) > parseFloat($('#finance_sub_amount').val())){
                    // dont let them pick a higher taxable amount than sub amount
                    $('#finance_sub_amount').val($(this).val());
                }
            }
            t.update_finance_total();
        });
        // if the user is changing the total amount manually:
        $('#finance_total_amount').on('change',function(){
            if(!t.changing_in_progress)t.changing='subtotal';
            t.update_finance_total();
        }).on('keyup',function(){
            if(!t.changing_in_progress)t.changing='subtotal';
            t.update_finance_total();
        });

        $('#finance_tax_holder').on('change','.tax_percent',function(){
            t.update_finance_total();
        }).on('keyup','.tax_percent',function(){
            t.update_finance_total();
        });
        $('#tax_increment_checkbox').on('change',function(){
            t.update_finance_total();
        });
        t.update_finance_total();
    },
    // we are either updating the 'total' or we are updating the 'sub total'
    // depending on which one was 'changed' last.
    changing: 'total',
    changing_in_progress: false,
    update_finance_total: function(){
        var t = this;
        if($('#finance_tax_holder .dynamic_block').length > 1)$('.finance_tax_increment').show(); else $('.finance_tax_increment').hide();
        t.changing_in_progress = true;
        var sub_amount = parseFloat($('#finance_sub_amount').val());
        var taxable_amount = parseFloat($('#finance_taxable_amount').val());
        var original_taxable_amount = taxable_amount;
        var amount = parseFloat($('#finance_total_amount').val());
        if(
            (t.changing == 'total' && (!isNaN(taxable_amount) || taxable_amount>0)) ||
            (t.changing == 'subtotal' && (!isNaN(amount) || amount>0))
        ){
            var incremental = $('#tax_increment_checkbox')[0].checked;
            var tax_amount = parseFloat(0);
            var tax_percents = parseFloat(0);
            var madness = function(){
                var tax = parseFloat($(this).find('.tax_percent').val());
                if(!isNaN(tax) && tax>0){
                    if(incremental){
                        // incrementing tax along the way. to amount
                        if(t.changing == 'total'){
                            // user wants the 'total' to be updated based on the current 'subtotal' amount
                            var this_tax = (taxable_amount * (tax/100));
                            var this_tax_display = Math.round(this_tax*1000)/1000;
                            $(this).find('.tax_amount').html(this_tax_display);
                            $(this).find('.tax_amount_input').val(this_tax_display);
                            taxable_amount += this_tax; //(taxable_amount * (tax/100));
                        }else{
                            // user wants the 'subtotal' to be updated based on the current 'total' amount
                            var new_amount = amount / (1 + (tax / 100));
                            var this_tax = amount-new_amount;
                            var this_tax_display = Math.round(this_tax*1000)/1000;
                            $(this).find('.tax_amount').html(this_tax_display);
                            $(this).find('.tax_amount_input').val(this_tax_display);

                            amount = new_amount;
                        }
                    }else{
                        if(t.changing == 'total'){
                            // user wants the 'total' to be updated based on the current 'subtotal' amount
                            var this_tax = (taxable_amount * (tax/100));
                            var this_tax_display = Math.round(this_tax*1000)/1000;
                            $(this).find('.tax_amount').html(this_tax_display);
                            $(this).find('.tax_amount_input').val(this_tax_display);
                            tax_amount += this_tax; //(taxable_amount * (tax/100));
                        }else{
                            // todo - this doesn't work.
                            var this_tax = 0;
                            var this_tax_display = Math.round(this_tax*1000)/1000;
                            $(this).find('.tax_amount').html(this_tax_display);
                            $(this).find('.tax_amount_input').val(this_tax_display);

                            tax_percents += (tax/100);
                        }
                    }
                }
            };

            if(t.changing == 'total'){
                // user wants the 'total' to be updated based on the current 'subtotal' amount
                $('#finance_tax_holder .dynamic_block').each(madness);
                $('#finance_total_amount').val(Math.round((sub_amount + (taxable_amount-original_taxable_amount) + tax_amount)*100)/100);
                // update the sub total if these were the same before.
            }else{
                // user wants the 'subtotal' to be updated based on the current 'total' amount
                $($('#finance_tax_holder .dynamic_block').get().reverse()).each(madness);
                $('#finance_taxable_amount').val(Math.round((amount / (1 + (tax_percents)))*100)/100);
                $('#finance_sub_amount').val(Math.round((amount / (1 + (tax_percents)))*100)/100);
            }
        }
        t.changing_in_progress = false;
    }
};

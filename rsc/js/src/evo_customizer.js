/**
 * This file is used for customizer mode
 */

jQuery( document ).on( 'ready', function()
{
	jQuery( '#evo_customizer__backoffice' ).on( 'load', function()
	{	// If iframe with settings has been loaded
		var backoffice_content = jQuery( this ).contents();
		backoffice_content.find( 'form' ).attr( 'target', 'evo_customizer__updater' );
		if( backoffice_content.find( '.evo_customizer__buttons' ).length )
		{	// Set proper bottom margin because buttons block has a fixed position at the bottom:
			backoffice_content.find( 'body' ).css( 'margin-bottom', backoffice_content.find( '.evo_customizer__buttons' ).outerHeight() - 1 );
		}

		if( backoffice_content.find( '.alert.alert-success' ).length )
		{	// Reload front-office iframe with collection preview if the back-office iframe has a message about success updating:
			jQuery( '#evo_customizer__frontoffice' ).get(0).contentDocument.location.reload();
		}

		// Remove the message of successful action:
		var success_messages = backoffice_content.find( '.alert.alert-success' );
		var messages_wrapper = success_messages.parent();
		success_messages.remove();
		if( ! messages_wrapper.find( '.alert' ).length )
		{	// Remove messages wrapper completely if it had only successful messages:
			messages_wrapper.closest( '.action_messages' ).remove();
		}

		// Set proper space before form after top tabs:
		var tabs_height = backoffice_content.find( '.evo_customizer__tabs' ).outerHeight();
		backoffice_content.find( '.evo_customizer__content' ).css( 'margin-top', tabs_height + 'px' );

		backoffice_content.find( '.evo_customizer__tabs a' ).click( function()
		{	// Check to enable/disable designer mode between switching skin and widgets menu entries:
			var designer_mode = ( jQuery( this ).attr( 'href' ).indexOf( 'view=coll_widgets' ) > -1 ) ? 'enable' : 'disable';
			if( designer_mode != jQuery( '#evo_customizer__frontoffice' ).data( 'designer-mode' ) )
			{	// Reload front office iframe only when designer mode was changed:
				jQuery( '#evo_customizer__frontoffice' ).get(0).contentDocument.location.href += '&designer_mode=' + designer_mode;
				// Save current state of designer mode:
				jQuery( '#evo_customizer__frontoffice' ).data( 'designer-mode', designer_mode );
			}
		} );

		backoffice_content.find( '#evo_customizer__collapser' ).click( function()
		{	// Collapse customizer iframe:
			jQuery( '.evo_customizer__wrapper' ).addClass( 'evo_customizer__collapsed' );
			jQuery( '#evo_customizer__vtoggler' ).css( 'left', '0' );
		} );

		backoffice_content.find( '#evo_customizer__closer' ).click( function()
		{	// Close customizer iframe:
			window.parent.location.href = jQuery( '.evo_customizer__toggler', window.parent.document ).attr( 'href' );
		} );
	} );

	jQuery( '#evo_customizer__updater' ).on( 'load', function()
	{	// If iframe with settings has been loaded
		if( jQuery( this ).contents().find( '.alert.alert-success' ).length )
		{	// Reload iframe with collection preview if the updater iframe has a message about success updating:
			jQuery( '#evo_customizer__frontoffice' ).get(0).contentDocument.location.reload();
		}

		// If the updater iframe has the messages about error or warning updating:
		if( jQuery( this ).contents().find( '.alert:not(.alert-success)' ).length || 
		// OR if the settings iframe has the error message from previous updating:
			jQuery( '#evo_customizer__backoffice' ).contents().find( '.alert' ).length )
		{	// Update settings/back-office iframe with new content what we have in updater iframe currently:
			jQuery( '#evo_customizer__backoffice' ).contents().find( 'form' ).removeAttr( 'target' ).submit();
		}
	} );

	jQuery( '#evo_customizer__frontoffice' ).on( 'load', function()
	{	// If iframe with collection preview has been loaded
		jQuery( this ).contents().find( 'body[class*=coll_]' ).each( function()
		{	// Check if iframe really loads current collection:
			var backoffice_iframe = jQuery( '#evo_customizer__backoffice' );
			var body_class = jQuery( this ).attr( 'class' );
			var instance_name = body_class.match( /(^| )instance_([a-z\d]+)( |$)/i );
			instance_name = ( typeof( instance_name[2] ) == 'undefined' ? false : instance_name[2] );
			if( instance_name === false || backoffice_iframe.data( 'instance' ) != instance_name )
			{	// If page of other site is loaded in front-office iframe:
				alert( evo_js_lang_not_controlled_page );
				location.href = jQuery( '#evo_customizer__frontoffice' ).get( 0 ).contentWindow.location.href.replace( 'customizer_mode=enable&show_toolbar=hidden&redir=no', '' );
				return;
			}
			var coll_id = body_class.match( /(^| )coll_(\d+)( |$)/ );
			coll_id = ( typeof( coll_id[2] ) == 'undefined' ? 0 : coll_id[2] );
			if( coll_id && backoffice_iframe.data( 'coll-id' ) != coll_id )
			{	// Reload left/back-office iframe to customize current loaded collection if different collection has been loaded to the right/front-office iframe:
				backoffice_iframe.get( 0 ).contentWindow.location.href = backoffice_iframe.get( 0 ).contentWindow.location.href.replace( /([\?&]blog=)\d+(&|$)/, '$1' + coll_id + '$2' );
				backoffice_iframe.data( 'coll-id', coll_id );
			}
		} );

		jQuery( this ).contents().find( 'a' ).each( function()
		{	// Prepare links of new loaded content of front-office iframe:
			if( jQuery( this ).closest( '#evo_toolbar' ).length )
			{	// Skip links of evo toolbar:
				return;
			}
			var link_url = jQuery( this ).attr( 'href' );
			var collection_url = jQuery( '#evo_customizer__frontoffice' ).data( 'coll-url' );
			if( typeof( link_url ) != 'undefined' && link_url.indexOf( collection_url ) === 0 )
			{	// Append param to hide evo toolbar and don't redirect for links of the current collection:
				jQuery( this ).attr( 'href', link_url + ( link_url.indexOf( '?' ) === -1 ? '?' : '&' ) + 'customizer_mode=enable&show_toolbar=hidden&redir=no' );
			}
			else
			{	// Open all links of other collections and side sites on top window in order to update settings frame or close it:
				jQuery( this ).attr( 'target', '_top' );
			}
		} );

		var evo_toolbar = jQuery( this ).contents().find( '#evo_toolbar' );
		if( evo_toolbar.length )
		{	// Grab evo toolbar from front-office iframe with actual data for current loaded page:
			jQuery( '#evo_toolbar' ).html( evo_toolbar.html() );
		}
	} );

	jQuery( document ).on( 'click', '.evo_customizer__toggler.active', function()
	{	// Expand customizer iframe if it is collapsed:
		if( jQuery( '.evo_customizer__wrapper' ).hasClass( 'evo_customizer__collapsed' ) )
		{
			jQuery( '.evo_customizer__wrapper' ).removeClass( 'evo_customizer__collapsed' );
			jQuery( '#evo_customizer__vtoggler' ).css( 'left', '317px' );
			// Prevent open link URL, because we need only to expand currently:
			return false;
		}
	} );

	// Expand/Collapse left customizer panel with vertical toggler line(separator between left and right customizer panels):
	jQuery( '#evo_customizer__vtoggler' )
	.on( 'mousedown', function( e )
	{
		jQuery( this )
			.addClass( 'evo_customizer__vtoggler_resizing' ) // Set class flag to know we are resizing
			.data( 'startX', e.pageX ) // Store x position to detect "click" event vs "resize" event
			// Create temp elements for visualization of resizing:
			.before( '<div id="evo_customizer__vtoggler_helper" class="evo_customizer__vtoggler" style="left:' + ( e.pageX - 3 )+ 'px"></div>' ) // moving bar
			.before( '<div id="evo_customizer__vtoggler_helper2" class="evo_customizer__vtoggler"></div>' ); // static bar
		// Prevent default event in order to don't change mousr cursor to test style while resizing:
		e.originalEvent.preventDefault();
	} )
	.on( 'mousemove', function( e )
	{
		if( jQuery( this ).hasClass( 'evo_customizer__vtoggler_resizing' ) )
		{	// Only in resizing mode:
			var is_collapsed = jQuery( '.evo_customizer__wrapper' ).hasClass( 'evo_customizer__collapsed' );
			if( e.pageX < 200 )
			{	// Collapse left customizer panel if cursor is moved to the left:
				if( ! is_collapsed )
				{	// And if it is not collapsed yet:
					jQuery( '.evo_customizer__wrapper' ).addClass( 'evo_customizer__collapsed' );
				}
			}
			else if( is_collapsed )
			{	// Expand left customizer panel if cursor is moved to the right and if it is really collapsed:
				jQuery( '.evo_customizer__wrapper' ).removeClass( 'evo_customizer__collapsed' );
			}
			if( e.pageX != jQuery( this ).data( 'startX' ) )
			{	// Set flag if the resizing is detected for at least 1 pixel:
				jQuery( this ).data( 'resized', true );
			}
			// Move vtoggler hepler for mouse cursor:
			jQuery( '#evo_customizer__vtoggler_helper' ).css( 'left', e.pageX );
		}
	} )
	.on( 'mouseup', function()
	{
		if( ! jQuery( this ).data( 'resized' ) )
		{	// If it has not been resized then simulate "click" event to expand/collapse:
			jQuery( '.evo_customizer__wrapper' ).toggleClass( 'evo_customizer__collapsed' );
		}
		jQuery( this )
			.removeClass( 'evo_customizer__vtoggler_resizing' ) // Remove class flag of resizing
			.data( 'resized', false ) // Reset flag of resized
			.css( {
				left: jQuery( '.evo_customizer__wrapper' ).hasClass( 'evo_customizer__collapsed' ) ? '0' : '320px', // Set correct vertical toggler position depending on collapse state
			} );
		// Remove temp elements after end of resiging:
		jQuery( '#evo_customizer__vtoggler_helper, #evo_customizer__vtoggler_helper2' ).remove();
	} );
} );
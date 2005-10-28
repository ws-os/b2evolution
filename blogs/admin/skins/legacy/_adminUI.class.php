<?php
/**
 * This file implements the Admin UI class.
 * Alternate admin skins should derive from this class.
 *
 * This file is part of the b2evolution/evocms project - {@link http://b2evolution.net/}.
 * See also {@link http://sourceforge.net/projects/evocms/}.
 *
 * @copyright (c)2003-2005 by Francois PLANQUE - {@link http://fplanque.net/}.
 * Parts of this file are copyright (c)2005 by Daniel HAHLER - {@link http://thequod.de/contact}.
 *
 * @license http://b2evolution.net/about/license.html GNU General Public License (GPL)
 * {@internal
 * b2evolution is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * b2evolution is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with b2evolution; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 * }}
 *
 * {@internal
 * Daniel HAHLER grants Fran�ois PLANQUE the right to license
 * Daniel HAHLER's contributions to this file and the b2evolution project
 * under any OSI approved OSS license (http://www.opensource.org/licenses/).
 * }}
 *
 * @package admin-skin
 * @subpackage evo
 *
 * {@internal Below is a list of authors who have contributed to design/coding of this file: }}
 * @author blueyed: Daniel HAHLER
 *
 * @version $Id$
 */
if( !defined('EVO_MAIN_INIT') ) die( 'Please, do not access this page directly.' );

/**
 * Includes
 */
require_once dirname(__FILE__).'/../'.$adminskins_dirout.'_adminUI_general.class.php';


/**
 * We define a special template for the main menu.
 *
 * @package admin-skin
 * @subpackage evo
 */
class AdminUI extends AdminUI_general
{
	/**
	 * Get a template by name and depth.
	 *
	 * @param string The template name ('main', 'sub').
	 * @return array
	 */
	function get_menu_template( $name, $depth = 0 )
	{
		switch( $name )
		{
			case 'main':
				switch( $depth )
				{
					default: // just one level for now (might provide dropdown later)
						return array(
							'before' => '<ul class="tabs">',
							'after' => '</ul>',
							'beforeEach' => '<li>',
							'afterEach' => '</li>',
							'beforeEachSel' => '<li class="current">',
							'afterEachSel' => '</li>',
						);
				}
				break;


			default:
				// Delegate to parent class:
				return parent::get_menu_template( $name, $depth );
		}
	}


	/**
	 * Get links (to CSS files especially).
	 */
	function get_head_links()
	{
		global $mode, $rsc_url;

		$r ='<link href="skins/legacy/rsc/css/variation.css" rel="stylesheet" type="text/css" title="Variation" />
				<link href="skins/legacy/rsc/css/desert.css" rel="alternate stylesheet" type="text/css" title="Desert" />
				<link href="skins/legacy/rsc/css/legacy.css" rel="alternate stylesheet" type="text/css" title="Legacy" />';

		if( is_file( dirname(__FILE__).'/rsc/css/custom.css' ) )
		{
			$r .= '<link href="skins/legacy/rsc/css/custom.css" rel="alternate stylesheet" type="text/css" title="Custom" />';
		}

		$r .= '<script type="text/javascript" src="'.$rsc_url.'js/styleswitcher.js"></script>';

		if( $mode == 'sidebar' )
		{ // Include CSS overrides for sidebar:
			$r .= '<link href="skins/legacy/rsc/css/sidebar.css" rel="stylesheet" type="text/css" />';
		}

		return $r;
	}


	/**
	 * GLOBAL HEADER - APP TITLE, LOGOUT, ETC.
	 *
	 * @return string
	 */
	function get_page_head()
	{
		$r = '
		<div id="header">
			'.$this->admin_logo.'

			<div id="headfunctions">
				'.T_('Style:').'
				<a href="#" onclick="setActiveStyleSheet(\'Variation\'); return false;" title="Variation (Default)">V</a>'
				.'&middot;<a href="#" onclick="setActiveStyleSheet(\'Desert\'); return false;" title="Desert">D</a>'
				.'&middot;<a href="#" onclick="setActiveStyleSheet(\'Legacy\'); return false;" title="Legacy">L</a>'
				.( is_file( dirname(__FILE__).'/rsc/css/custom.css' ) ? '&middot;<a href="#" onclick="setActiveStyleSheet(\'Custom\'); return false;" title="Custom">C</a>' : '' )
				.'
				&bull;
				'.$this->exit_links.'
			</div>

			<div id="headinfo">'.$this->get_head_info().'</div>'

			// Display MAIN menu:
			.$this->get_html_menu().'
		</div>
		';

		return $r;
	}


	/**
	 *
	 *
	 * @return string
	 */
	function get_body_top()
	{
		global $Messages;

		$r = '';

		if( empty($this->mode) )
		{ // We're not running in an special mode (bookmarklet, sidebar...)
			$r .= $this->get_page_head();
		}

		$r .= '
			<div id="TitleArea">
				<h1><strong>'.$this->get_title_for_titlearea().'</strong>
				'.$this->get_bloglist_buttons( '', '' ).'
				</h1>
			</div>

			<div class="panelbody">'
			."\n\n";

		// Display info & error messages
		$r .= $Messages->display( NULL, NULL, false, 'all', NULL, NULL, 'action_messages' );

		return $r;
	}


	/**
	 * Close open div.
	 *
	 * @return string
	 */
	function get_body_bottom()
	{
		return "\n</div>\n";
	}
}

?>
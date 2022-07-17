<?php
/*
Plugin Name: Table users
Description: Show all user for admin use shortcode [table_users_show_table]
Author: Kusakin Vova <a href="mailto:kusakinvova@gmail.com">kusakinvova@gmail.com</a> 
*/

// ------------------------
include_once  plugin_dir_path( __FILE__ )."admin.php";
include_once  plugin_dir_path( __FILE__ )."check_user_role.php";
// ------------------------
// Текущая директория
$currentDir = dirname(__FILE__);
define('WIDGET_ATTACHMENTS_DIR', $currentDir);
// Версия плагина
define('WIDGET_ATTACHMENTS_VERSION', '1.0');
// Название плагина
$pluginName = plugin_basename(WIDGET_ATTACHMENTS_DIR);
// URI путь до директории с плагином
$pluginUrl = '/wp-content/plugins/' . $pluginName . '/';
// Путь для CSS, JS скриптов и картинок
$assetsUrl = $pluginUrl . 'assets';

// ------------------------
function table_users_widgets_init(){
	global $assetsUrl;
	// Регистрируем javascrpt
	wp_register_script('widget_attachments_js1', $assetsUrl . '/table_users.js', array(), WIDGET_ATTACHMENTS_VERSION, true);

	// Регистрируем стили
	wp_register_style('widget_attachments_cdn_font_awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css', array());
	wp_register_style('widget_attachments_css1', $assetsUrl . '/table_users.css', array(), WIDGET_ATTACHMENTS_VERSION);
	// Подключаем jquery 
	wp_enqueue_script('jquery');

	// И подключаем все скрипты и стили
	wp_enqueue_script('widget_attachments_js1');
	wp_enqueue_style('widget_attachments_cdn_font_awesome');
	wp_enqueue_style('widget_attachments_css1');
}

// Вызываем функцию при 
// add_action('wp_head', 'table_users_widgets_init');
// ------------------------
function table_users_addContentFotter(){
	if ( is_multisite() ) { 
		echo "<script type='text/javascript'>var myajax = '/wp-admin/admin-ajax.php';</script>\n";
	}
	else{
		echo "<script type='text/javascript'>var myajax = '".admin_url('admin-ajax.php')."';</script>\n";
	}
}
// add_action('wp_footer', 'table_users_addContentFotter');
// ------------------------
add_action( 'wp_ajax_table_users_ajax', 'table_users_ajax' );
add_action( 'wp_ajax_nopriv_table_users_ajax', 'table_users_ajax' );

function table_users_ajax() {
    $result = getUsers();
    print_r(json_encode($result));
    exit();
}
// ------------------------

function getUsers(){
	$args = array(
		// 'role'    => 'Subscriber',
		// 'orderby' => 'last_name',
		// 'order'   => 'ASC',
		// 'number' => '25'
	);
	$users = get_users( $args );
	foreach ( $users as $user )
	{
		$DBRecord[$user->ID]['WPId']	= $user->ID;
		$DBRecord[$user->ID]['Login']	= $user->user_login;
		$DBRecord[$user->ID]['roles']	= $user->roles[0];
		$DBRecord[$user->ID]['Email']	= $user->user_email;
	}
	return $DBRecord;
}

function viewtable(){
	$users = getUsers();
	$conten = '<table><thead><tr>
		<th>Login</th>
		<th>Email</th>
		<th>roles</th>
	</tr></thead><tbody>';
	foreach($users as $user){
		$conten .= '<tr>';
		$conten .= '<td>'.$user['Login'].'</td>';
		$conten .= '<td>'.$user['Email'].'</td>';
		$conten .= '<td>'.$user['roles'].'</td>';
		$conten .= '</tr>';
	}
	$conten .= '</tbody></table>';
	return $conten;
}

function table_users_shortcode_show_table ($atts)
{
	$roles = [ 'administrator' ];
	if ( check_user_role($roles) ) {
		
		add_action('wp_head', 'table_users_widgets_init');
		add_action('wp_footer', 'table_users_addContentFotter');

		$block_main = '<div class="tableUsers"></div>';
		return $block_main;
	}
}

add_shortcode('table_users_show_table', 'table_users_shortcode_show_table');

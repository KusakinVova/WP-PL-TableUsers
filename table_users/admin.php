<?php
add_action( 'admin_menu', 'true_top_menu_page', 25 );
 
function true_top_menu_page(){
 
	add_menu_page(
		'Table users', // тайтл страницы
		'Table users', // текст ссылки в меню
		'manage_options', // права пользователя, необходимые для доступа к странице
		'table_users', // ярлык страницы
		'table_users_page_callback', // функция, которая выводит содержимое страницы
		'dashicons-editor-table', // иконка, в данном случае из Dashicons
		20 // позиция в меню
	);
}
 
function table_users_page_callback(){
	echo '<div>Show all user for admin use shortcode [table_users_show_table]</div>';
}
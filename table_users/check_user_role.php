<?php
// info https://themeisle.com/blog/hide-wordpress-admin-bar/

function check_user_role( $roles ) {
    /*@ Check user logged-in */
    if ( is_user_logged_in() ) :
        /*@ Get current logged-in user data */
        $user = wp_get_current_user();
        /*@ Fetch only roles */
        $currentUserRoles = $user->roles;
        /*@ Intersect both array to check any matching value */
        $isMatching = array_intersect( $currentUserRoles, $roles);
        $response = false;
        /*@ If any role matched then return true */
        if ( !empty($isMatching) ) :
            $response = true;        
        endif;
        return $response;
    endif;
}
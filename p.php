<?php
	$path = $_REQUEST['project'];
	$images = array_filter(glob("media/{$path}/*.{jpg,gif,png}", GLOB_BRACE), function($v) {
	    return false === strpos($v, 'thumbnail.jpg');
	});
	echo json_encode($images);
?>


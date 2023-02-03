<?php
// PHP Proxy
// Responds to both HTTP GET and POST requests
//
// Author: Abdul Qabiz
// March 31st, 2006
//

// Get the url of to be proxied
// Is it a POST or a GET?
$url = ($_POST['url']) ? $_POST['url'] : $_GET['url'];
$headers = ($_POST['headers']) ? $_POST['headers'] : $_GET['headers'];
$mimeType =($_POST['mimeType']) ? $_POST['mimeType'] : $_GET['mimeType'];


//$url = $_GET['url'];
//$headers = $_POST['headers'];
//$mimeType =$_POST['mimeType'];


//Start the Curl session
$session = curl_init($url);

// If it's a POST, put the POST data in the body
if ($url) {
	$postvars = '';
	while ($element = current($_POST)) {
		$postvars .= key($_POST).'='.$element.'&';
		next($_POST);
	}
	curl_setopt ($session, CURLOPT_POST, true);
	curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
}

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER,false);

curl_setopt($session, CURLOPT_FOLLOWLOCATION, true); 
//curl_setopt($ch, CURLOPT_TIMEOUT, 4); 
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

if ($mimeType = "Text")
{
	// The web service returns XML. Set the Content-Type appropriately
	header("Content-Type: ".$mimeType);
}

echo $response;
//print_r($response);

// echo $response[0];
// echo $response[1];
// echo $response[2];echo $response[3];
// echo $response[4];
// echo $response[5];
// echo $response[6];
// echo $response[7];
// echo $response[8];
// echo $response[9];

curl_close($session);

?>
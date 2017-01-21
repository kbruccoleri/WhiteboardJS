<?php

define("HOSTNAME", "127.0.0.1");
define("MAIN_DATABASE", "whiteboard");
define("USERNAME", "root");
define("PASSWORD", "root");
// define("PORT", ini_get("mysqli.default_port"));
define("PORT", "8889");
define("SOCKET", "/tmp/mysql5.sock");

/**
 * Connect to a database; connects to the main database by default.
 * @param  String 	$database 	Database to connect to.
 * @return MYSQLConnection
 */
function databaseConnect($database = MAIN_DATABASE)
{	
	$c = mysqli_connect(HOSTNAME, USERNAME, PASSWORD, $database, PORT, SOCKET);
	
	if ($c === FALSE)
		return FALSE;

	// change charset
	mysqli_set_charset($c, "utf8mb4");
		
	return $c;
}

?>
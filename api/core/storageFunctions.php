<?php

require_once("databaseFunctions.php");

/**
 * This functions saves the canvas object as a data blob in the database.
 * @param  [String] $id         Identifier of canvas
 * @param  [String] $canvasBlob The actual canvas in the form of a data blob.
 * @return [Boolean]             True on success, otherwise false.
 */
function saveCanvasAsPhoto($id, $canvasBlob) {

	// Set up return array.
	$returnArray["message"] = "ERROR";
	$returnArray["success"] = false;

	// Connect to the database
	$c = databaseConnect();
	if (!$c) {
		return $returnArray;
	}

	// Build the query string
	$q = "	INSERT INTO canvas 
			(id, canvas_image, datetime_updated)
			VALUES (?, ?, NOW())
			ON DUPLICATE KEY UPDATE 
			canvas_image = ?,
			datetime_updated = NOW()";
	$stmt = mysqli_prepare($c, $q);
	mysqli_stmt_bind_param($stmt, "sss", $id, $canvasBlob, $canvasBlob);
	$returnArray["success"] = mysqli_stmt_execute($stmt);

	if ($returnArray["success"]) {
		$returnArray["message"] = "";
	}

	return $returnArray;
}

/**
 * This functions loads the canvas object as a data blob from the database.
 * @param  [String] $id         Identifier of canvas
 * @return [String]             Canvas blob in string form.
 */
function getCanvasBlob($id) {

	// Up memory limit
	// ini_set("memory_limit", "16M");

	// Set up return array.
	$returnArray["message"] = "ERROR";
	$returnArray["canvasBlob"] = "";
	$returnArray["success"] = false;

	// Connect to the database
	$c = databaseConnect();
	if (!$c) {
		return $returnArray;
	}

	// Build the query string
	$q = "	SELECT canvas_image FROM canvas 
			WHERE id = ? LIMIT 1";
	$stmt = mysqli_prepare($c, $q);
	mysqli_stmt_bind_param($stmt, "s", $id);
	mysqli_stmt_execute($stmt);
	mysqli_stmt_bind_result($stmt, $canvas_image);
	mysqli_stmt_store_result($stmt);
	mysqli_stmt_fetch($stmt);

	if(mysqli_stmt_num_rows($stmt) < 1) {
		$returnArray["message"] = "There is no canvas with the given identifier. Try again later.";
		return $return_array;
	}

	$returnArray["canvasBlob"] = $canvas_image;
	$returnArray["success"] = true;

	// Free the result and close the statement
	mysqli_stmt_free_result($stmt);
	mysqli_stmt_close($stmt);

	if ($returnArray["success"]) {
		$returnArray["message"] = "";
	}

	return $returnArray;
}

?>
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

?>
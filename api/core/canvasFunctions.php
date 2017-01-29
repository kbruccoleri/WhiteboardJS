<?php

require_once("databaseFunctions.php");

DEFINE("CANVAS_ID_LENGTH", 25);
DEFINE("ALPHABET", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789");

function createNewCanvas() {

	// Set up return array.
	$returnArray["message"] = "Canvas creation error.";
	$returnArray["canvasID"] = null;
	$returnArray["success"] = false;

	// Connect to the database.
	$c = databaseConnect();
	if (!$c) {
		return $returnArray;
	}

	$numAttempts = 0;
	while (true) {
		// Generate an ID
		$id = "";
		while (strlen($id) < CANVAS_ID_LENGTH) {
			$id .= substr(ALPHABET, rand(0, strlen(ALPHABET)), 1);
		}
		
		// Attempt to save using new id and blank canvas
		$saveResponse = saveCanvasAsPhoto($id, "");
		if ($saveResponse["success"]) {
			break;
		}

		$numAttempts++;
		if ($numAttempts === 5) {
			return $returnArray;
		}
	}

	$returnArray["canvasID"] = $id;
	$returnArray["success"] = true;
	$returnArray["message"] = "";
	return $returnArray;
}

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
		$returnArray["message"] = "There is no canvas with the given identifier.";
		return $returnArray;
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
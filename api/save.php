<?php

/**
 * save.php
 *
 * The AJAX endpoint for saving the canvas blob in the database.
 */
require_once("core/databaseFunctions.php");
require_once("core/storageFunctions.php");

$canvasID = $_POST["canvasID"];
$imgBase64 = $_POST["imgBase64"];

echo(json_encode(saveCanvasAsPhoto($canvasID, $imgBase64)));

?>
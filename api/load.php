<?php

/**
 * save.php
 *
 * The AJAX endpoint for saving the canvas blob in the database.
 */

require_once("core/storageFunctions.php");

header("Content-type: image/png");

echo(json_encode(getCanvasBlob($_GET["canvasID"])));

?>
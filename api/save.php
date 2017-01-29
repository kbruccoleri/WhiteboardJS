<?php

/**
 * save.php
 *
 * The AJAX endpoint for saving the canvas blob in the database.
 */

require_once("core/canvasFunctions.php");

echo(json_encode(saveCanvasAsPhoto($_POST["canvasID"], $_POST["imgBase64"])));

?>
<?php

/**
 * create.php
 *
 * The AJAX endpoint for generating a unique canvas ID.
 */

require_once("core/canvasFunctions.php");

echo(json_encode(createNewCanvas()));

?>
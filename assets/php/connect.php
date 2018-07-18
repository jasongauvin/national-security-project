   <?php
    try {
		$db = pg_connect("host=localhost port=5432 dbname=PROJET user=postgres password=postgres");
	}
	catch(PDOException $e)
    {
    	echo $e->getMessage();
    }
    ?>
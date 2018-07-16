   <?php
    try {
		$db = pg_connect("host=localhost port=5433 dbname=suretenational user=postgres password=khadija");
	}
	catch(PDOException $e)
    {
    	echo $e->getMessage();
    }
    ?>
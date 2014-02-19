<?php
require("db_info.php");
//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password)
or die("Unable to connect to MySQL");
mysql_select_db($database);
	if(isset($_POST['postal']) && isset($_POST['name']) && isset($_POST['addrs']))
	{
		if (ob_get_level() == 0) ob_start();{
		    $uid = $_POST['postal'];
		    $n = $_POST['name'];
		    $ps = $_POST['addrs'];
		    $dish1 = 'samosa';
		    $price = '£1.50';
		    echo $uid;
		    echo '<br />';
		 	echo $n;
		 	echo '<br />';
		 	echo $ps;  
		 	echo '<br />';
			$check = mysql_query("SELECT name, pc FROM parent_main WHERE name='$n' AND pc='$uid' ");
			 if (!mysql_num_rows($check)){
			 	$result = mysql_query("INSERT INTO parent_main (name, address,pc) VALUES ('$n','$ps','$uid')") or die(mysql_error());
			 	$extra = mysql_insert_id();
			 	$data = json_decode(stripcslashes($_POST['strings']));
			 	foreach ($data as $d) {
			 		echo $d;
			 		echo '<br />';
			 		echo $extra; 
			 		$result_dish = mysql_query("INSERT INTO child_dish (dish_name,dish_price,F_id) VALUES ('$d','$price', '$extra')") or die(mysql_error());
			 	}
		 	}
		 	else{
		 		echo "data already exists";
		 	}
		 	
		}
		ob_end_flush();

	}
?>
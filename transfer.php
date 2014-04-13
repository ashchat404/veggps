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
			 	$values = array();
			 	$data = json_decode(stripcslashes($_POST['strings']));
			 	foreach ($data as $d => $v) {
			 		 if( sizeof($v) == 2 ){
					    $values[$v[0]] = floatval($v[1]);
					 } 
			 	}

				$con = mysqli_connect('mysql4.000webhost.com', 'a2582397_ash', '70882018A', 'a2582397_veggps');
				$query = "INSERT INTO child_dish (dish_name, dish_price, F_id) VALUES(?, ?, ?);";
				$stmt = $con->prepare($query); 
				if( $stmt ){
				   foreach ($values as $key => $value){
				        $stmt->bind_param("sdd", $key, $value, $extra);
				        $stmt->execute();
				   }
				   $stmt->close();  
				}
				$con->close(); 

		 	}
		 	else{
		 		echo "data already exists";
		 	}
		 	
		}
		ob_end_flush();

	}
	else{
		echo "all fields empty";
	}
?>
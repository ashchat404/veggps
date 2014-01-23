<?php
require("db_info.php");
//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password) 
  or die("Unable to connect to MySQL");
mysql_select_db($database);
$id = $_POST["id"];
$name = $_POST["name"];
$post = $_POST["postcode"];
$item1 = $_POST["item1"];
$price1 = $_POST["price1"];
$item2 = $_POST["item2"];
$price2 = $_POST["price2"];
$item3 = $_POST["item3"];
$price3 = $_POST["price3"];

$result = mysql_query("INSERT INTO info_main (res_ID,res_name,res_pc) VALUES ('$id', '$name', '$post')") or die(mysql_error());
$item_result = mysql_query("INSERT INTO dishes(res_ID,dishname,price) VALUES ('$id','$item1','$price1'), 
																			 ('$id','$item2','$price2'),
																			 ('$id','$item3','$price3')") or die(mysql_error());
header("Location: http://talentedash.co.uk/veggps/");
?>
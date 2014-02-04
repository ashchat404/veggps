<?php
require("db_info.php");

function parseToXML($htmlStr) 
{ 
$xmlStr=str_replace('<','&lt;',$htmlStr); 
$xmlStr=str_replace('>','&gt;',$xmlStr); 
$xmlStr=str_replace('"','&quot;',$xmlStr); 
$xmlStr=str_replace("'",'&#39;',$xmlStr); 
$xmlStr=str_replace("&",'&amp;',$xmlStr); 
return $xmlStr; 
} 

$connection = mysql_connect($hostname, $username, $password) or die(mysql_error());

$db_selected = mysql_select_db($database);

$query = "SELECT DISTINCT  *  FROM parent_main";

$result = mysql_query($query);


if (!$result) {
  die('Invalid query: ' . mysql_error());
}
header("Content-type: text/xml");

echo '<markers>';

// Iterate through the rows, printing XML nodes for each
while ($row = @mysql_fetch_assoc($result)){
  $id=$row['id'];
  // ADD TO XML DOCUMENT NODE
  echo '<marker> ';

      echo '<detail1>';
        echo '<resdetails ';
            echo 'name="' . parseToXML($row['name']) . '" ';
            echo 'id="' . parseToXML($id) . '" ';
            echo 'address="' . parseToXML($row['address'] ). '" ';
            echo 'pc="' . parseToXML($row['pc'] ). '" ';
        echo '/>';

        $dishes = "SELECT * FROM child_dish WHERE F_id = '" . $id . "'";

        $dish = mysql_query($dishes);

        while ($row2 = @mysql_fetch_assoc($dish)){
          $id2 = $row2['F_id'];
          
            echo '<dishdetails ';
                echo 'dishname="' . parseToXML($row2['dish_name']) . '" ';
                echo 'price="' . parseToXML($row2['dish_price']) . '" ';
            echo '/>';
          
        }

      echo '</detail1>';

      echo '</marker>';
    }
echo '</markers>';
?>
<?php
$data = $_POST['data'];
$file = 'data.csv';

// Write the data to the CSV file
file_put_contents($file, $data, FILE_APPEND | LOCK_EX);
?>

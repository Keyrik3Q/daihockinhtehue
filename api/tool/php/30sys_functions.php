<?php 
	switch ($data->what) { 
        //******************sys_functions************************
        // sys_functions(id,title,typeid,arrange,icon,link)
        // Get all data from sys_functions
        case 30: {
            $sql = "SELECT * FROM sys_functions";
            break;
        }

        // Insert data to sys_functions
        case 31: {
            $sql = "INSERT INTO sys_functions(title,typeid,arrange,icon,link)
            		VALUES('$data->title','$data->typeid','$data->arrange','$data->icon','$data->link')";
            break;
        }

        // Update data sys_functions
        case 32: {
            $sql = "UPDATE sys_functions SET title='$data->title', typeid='$data->typeid', arrange='$data->arrange', icon='$data->icon', link = '$data->link'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_functions
        case 33: {
            $sql = "DELETE FROM sys_functions
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_functions
        case 34: {
            $sql = "SELECT * FROM sys_functions
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_functions
        case 35: {
            $sql = "SELECT * FROM sys_functions
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_functions
        case 36: {
            $sql = "SELECT COUNT(1) FROM sys_functions ";
            break;
        }

	}
?> 

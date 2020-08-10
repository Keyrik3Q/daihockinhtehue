<?php 
	switch ($data->what) { 
        //******************sys_attributes************************
        // sys_attributes(id,title,approved,lang,groupid,keyword)
        // Get all data from sys_attributes
        case 50: {
            $sql = "SELECT * FROM sys_attributes";
            break;
        }

        // Insert data to sys_attributes
        case 51: {
            $sql = "INSERT INTO sys_attributes(title,approved,lang,groupid,keyword)
            		VALUES('$data->title','$data->approved','$data->lang','$data->groupid','$data->keyword')";
            break;
        }

        // Update data sys_attributes
        case 52: {
            $sql = "UPDATE sys_attributes SET title='$data->title', approved='$data->approved', lang='$data->lang', groupid='$data->groupid', keyword = '$data->keyword'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_attributes
        case 53: {
            $sql = "DELETE FROM sys_attributes
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_attributes
        case 54: {
            $sql = "SELECT * FROM sys_attributes
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_attributes
        case 55: {
            $sql = "SELECT * FROM sys_attributes
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_attributes
        case 56: {
            $sql = "SELECT COUNT(1) FROM sys_attributes ";
            break;
        }

	}
?> 

<?php 
	switch ($data->what) { 
        //******************sys_configsite************************
        // sys_configsite(id,siteid,title,keywords,description,footer,approved,lang)
        // Get all data from sys_configsite
        case 20: {
            $sql = "SELECT * FROM sys_configsite";
            break;
        }

        // Insert data to sys_configsite
        case 21: {
            $sql = "INSERT INTO sys_configsite(siteid,title,keywords,description,footer,approved,lang)
            		VALUES('$data->siteid','$data->title','$data->keywords','$data->description','$data->footer','$data->approved','$data->lang')";
            break;
        }

        // Update data sys_configsite
        case 22: {
            $sql = "UPDATE sys_configsite SET siteid='$data->siteid', title='$data->title', keywords='$data->keywords', description='$data->description', footer='$data->footer', approved='$data->approved', lang = '$data->lang'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_configsite
        case 23: {
            $sql = "DELETE FROM sys_configsite
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_configsite
        case 24: {
            $sql = "SELECT * FROM sys_configsite
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_configsite
        case 25: {
            $sql = "SELECT * FROM sys_configsite
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_configsite
        case 26: {
            $sql = "SELECT COUNT(1) FROM sys_configsite ";
            break;
        }

	}
?> 

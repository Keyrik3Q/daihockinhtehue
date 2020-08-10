<?php 
	switch ($data->what) { 
        //******************sys_templates************************
        // sys_templates(id,siteid,title,folder,imagepath,approved)
        // Get all data from sys_templates
        case 70: {
            $sql = "SELECT * FROM sys_templates";
            break;
        }

        // Insert data to sys_templates
        case 71: {
            $sql = "INSERT INTO sys_templates(siteid,title,folder,imagepath,approved)
            		VALUES('$data->siteid','$data->title','$data->folder','$data->imagepath','$data->approved')";
            break;
        }

        // Update data sys_templates
        case 72: {
            $sql = "UPDATE sys_templates SET siteid='$data->siteid', title='$data->title', folder='$data->folder', imagepath='$data->imagepath', approved = '$data->approved'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_templates
        case 73: {
            $sql = "DELETE FROM sys_templates
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_templates
        case 74: {
            $sql = "SELECT * FROM sys_templates
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_templates
        case 75: {
            $sql = "SELECT * FROM sys_templates
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_templates
        case 76: {
            $sql = "SELECT COUNT(1) FROM sys_templates ";
            break;
        }

	}
?> 

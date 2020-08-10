<?php 
	switch ($data->what) { 
        //******************sys_banner************************
        // sys_banner(id,siteid,title,link,arrange,approved,lang,pathimage)
        // Get all data from sys_banner
        case 80: {
            $sql = "SELECT * FROM sys_banner";
            break;
        }

        // Insert data to sys_banner
        case 81: {
            $sql = "INSERT INTO sys_banner(siteid,title,link,arrange,approved,lang,pathimage)
            		VALUES('$data->siteid','$data->title','$data->link','$data->arrange','$data->approved','$data->lang','$data->pathimage')";
            break;
        }

        // Update data sys_banner
        case 82: {
            $sql = "UPDATE sys_banner SET siteid='$data->siteid', title='$data->title', link='$data->link', arrange='$data->arrange', approved='$data->approved', lang='$data->lang', pathimage = '$data->pathimage'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_banner
        case 83: {
            $sql = "DELETE FROM sys_banner
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_banner
        case 84: {
            $sql = "SELECT * FROM sys_banner
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_banner
        case 85: {
            $sql = "SELECT * FROM sys_banner
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_banner
        case 86: {
            $sql = "SELECT COUNT(1) FROM sys_banner ";
            break;
        }

	}
?> 

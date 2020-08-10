<?php 
	switch ($data->what) { 
        //******************sys_sites************************
        // sys_sites(id,name,keyword,url,approved)
        // Get all data from sys_sites
        case 60: {
            $sql = "SELECT * FROM sys_sites";
            break;
        }

        // Insert data to sys_sites
        case 61: {
            $sql = "INSERT INTO sys_sites(name,keyword,url,approved)
            		VALUES('$data->name','$data->keyword','$data->url','$data->approved')";
            break;
        }

        // Update data sys_sites
        case 62: {
            $sql = "UPDATE sys_sites SET name='$data->name', keyword='$data->keyword', url='$data->url', approved = '$data->approved'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_sites
        case 63: {
            $sql = "DELETE FROM sys_sites
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_sites
        case 64: {
            $sql = "SELECT * FROM sys_sites
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_sites
        case 65: {
            $sql = "SELECT * FROM sys_sites
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_sites
        case 66: {
            $sql = "SELECT COUNT(1) FROM sys_sites ";
            break;
        }

	}
?> 

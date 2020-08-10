<?php 
	switch ($data->what) { 
        //******************weblink************************
        // weblink(id,siteid,title,link,approved,arrange,lang)
        // Get all data from weblink
        case 160: {
            $sql = "SELECT * FROM weblink";
            break;
        }

        // Insert data to weblink
        case 161: {
            $sql = "INSERT INTO weblink(siteid,title,link,approved,arrange,lang)
            		VALUES('$data->siteid','$data->title','$data->link','$data->approved','$data->arrange','$data->lang')";
            break;
        }

        // Update data weblink
        case 162: {
            $sql = "UPDATE weblink SET siteid='$data->siteid', title='$data->title', link='$data->link', approved='$data->approved', arrange='$data->arrange', lang = '$data->lang'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of weblink
        case 163: {
            $sql = "DELETE FROM weblink
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id weblink
        case 164: {
            $sql = "SELECT * FROM weblink
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) weblink
        case 165: {
            $sql = "SELECT * FROM weblink
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of weblink
        case 166: {
            $sql = "SELECT COUNT(1) FROM weblink ";
            break;
        }

	}
?> 

<?php 
	switch ($data->what) { 
        //******************advertises************************
        // advertises(id,siteid,title,pathimage,position,approved,arrange,link,lang)
        // Get all data from advertises
        case 200: {
            $sql = "SELECT * FROM advertises";
            break;
        }

        // Insert data to advertises
        case 201: {
            $sql = "INSERT INTO advertises(siteid,title,pathimage,position,approved,arrange,link,lang)
            		VALUES('$data->siteid','$data->title','$data->pathimage','$data->position','$data->approved','$data->arrange','$data->link','$data->lang')";
            break;
        }

        // Update data advertises
        case 202: {
            $sql = "UPDATE advertises SET siteid='$data->siteid', title='$data->title', pathimage='$data->pathimage', position='$data->position', approved='$data->approved', arrange='$data->arrange', link='$data->link', lang = '$data->lang'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of advertises
        case 203: {
            $sql = "DELETE FROM advertises
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id advertises
        case 204: {
            $sql = "SELECT * FROM advertises
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) advertises
        case 205: {
            $sql = "SELECT * FROM advertises
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of advertises
        case 206: {
            $sql = "SELECT COUNT(1) FROM advertises ";
            break;
        }

	}
?> 

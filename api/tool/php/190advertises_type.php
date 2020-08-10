<?php 
	switch ($data->what) { 
        //******************advertises_type************************
        // advertises_type(id,keyword,title,approved)
        // Get all data from advertises_type
        case 190: {
            $sql = "SELECT * FROM advertises_type";
            break;
        }

        // Insert data to advertises_type
        case 191: {
            $sql = "INSERT INTO advertises_type(keyword,title,approved)
            		VALUES('$data->keyword','$data->title','$data->approved')";
            break;
        }

        // Update data advertises_type
        case 192: {
            $sql = "UPDATE advertises_type SET keyword='$data->keyword', title='$data->title', approved = '$data->approved'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of advertises_type
        case 193: {
            $sql = "DELETE FROM advertises_type
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id advertises_type
        case 194: {
            $sql = "SELECT * FROM advertises_type
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) advertises_type
        case 195: {
            $sql = "SELECT * FROM advertises_type
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of advertises_type
        case 196: {
            $sql = "SELECT COUNT(1) FROM advertises_type ";
            break;
        }

	}
?> 

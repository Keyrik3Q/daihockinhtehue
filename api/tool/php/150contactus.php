<?php 
	switch ($data->what) { 
        //******************contactus************************
        // contactus(id,siteid,title,content,approved,lang,email)
        // Get all data from contactus
        case 150: {
            $sql = "SELECT * FROM contactus";
            break;
        }

        // Insert data to contactus
        case 151: {
            $sql = "INSERT INTO contactus(siteid,title,content,approved,lang,email)
            		VALUES('$data->siteid','$data->title','$data->content','$data->approved','$data->lang','$data->email')";
            break;
        }

        // Update data contactus
        case 152: {
            $sql = "UPDATE contactus SET siteid='$data->siteid', title='$data->title', content='$data->content', approved='$data->approved', lang='$data->lang', email = '$data->email'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of contactus
        case 153: {
            $sql = "DELETE FROM contactus
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id contactus
        case 154: {
            $sql = "SELECT * FROM contactus
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) contactus
        case 155: {
            $sql = "SELECT * FROM contactus
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of contactus
        case 156: {
            $sql = "SELECT COUNT(1) FROM contactus ";
            break;
        }

	}
?> 

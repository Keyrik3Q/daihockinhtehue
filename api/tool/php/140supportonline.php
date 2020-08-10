<?php 
	switch ($data->what) { 
        //******************supportonline************************
        // supportonline(id,siteid,typeid,nick,name,approved,arrange,note,phone)
        // Get all data from supportonline
        case 140: {
            $sql = "SELECT * FROM supportonline";
            break;
        }

        // Insert data to supportonline
        case 141: {
            $sql = "INSERT INTO supportonline(siteid,typeid,nick,name,approved,arrange,note,phone)
            		VALUES('$data->siteid','$data->typeid','$data->nick','$data->name','$data->approved','$data->arrange','$data->note','$data->phone')";
            break;
        }

        // Update data supportonline
        case 142: {
            $sql = "UPDATE supportonline SET siteid='$data->siteid', typeid='$data->typeid', nick='$data->nick', name='$data->name', approved='$data->approved', arrange='$data->arrange', note='$data->note', phone = '$data->phone'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of supportonline
        case 143: {
            $sql = "DELETE FROM supportonline
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id supportonline
        case 144: {
            $sql = "SELECT * FROM supportonline
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) supportonline
        case 145: {
            $sql = "SELECT * FROM supportonline
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of supportonline
        case 146: {
            $sql = "SELECT COUNT(1) FROM supportonline ";
            break;
        }

	}
?> 

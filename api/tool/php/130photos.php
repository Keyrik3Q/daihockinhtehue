<?php 
	switch ($data->what) { 
        //******************photos************************
        // photos(id,typeid,title,pathimage,postdate,approved,lang,arrange)
        // Get all data from photos
        case 130: {
            $sql = "SELECT * FROM photos";
            break;
        }

        // Insert data to photos
        case 131: {
            $sql = "INSERT INTO photos(typeid,title,pathimage,postdate,approved,lang,arrange)
            		VALUES('$data->typeid','$data->title','$data->pathimage','$data->postdate','$data->approved','$data->lang','$data->arrange')";
            break;
        }

        // Update data photos
        case 132: {
            $sql = "UPDATE photos SET typeid='$data->typeid', title='$data->title', pathimage='$data->pathimage', postdate='$data->postdate', approved='$data->approved', lang='$data->lang', arrange = '$data->arrange'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of photos
        case 133: {
            $sql = "DELETE FROM photos
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id photos
        case 134: {
            $sql = "SELECT * FROM photos
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) photos
        case 135: {
            $sql = "SELECT * FROM photos
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of photos
        case 136: {
            $sql = "SELECT COUNT(1) FROM photos ";
            break;
        }

	}
?> 

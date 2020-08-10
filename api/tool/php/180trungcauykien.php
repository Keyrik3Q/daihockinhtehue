<?php 
	switch ($data->what) { 
        //******************trungcauykien************************
        // trungcauykien(id)
        // Get all data from trungcauykien
        case 180: {
            $sql = "SELECT * FROM trungcauykien";
            break;
        }

        // Insert data to trungcauykien
        case 181: {
            $sql = "INSERT INTO trungcauykien(trungcauykien(id)
            		VALUES('$data->id')";
            break;
        }

        // Update data trungcauykien
        case 182: {
            $sql = "UPDATE trungcauykien SET id = '$data->id'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of trungcauykien
        case 183: {
            $sql = "DELETE FROM trungcauykien
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id trungcauykien
        case 184: {
            $sql = "SELECT * FROM trungcauykien
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) trungcauykien
        case 185: {
            $sql = "SELECT * FROM trungcauykien
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of trungcauykien
        case 186: {
            $sql = "SELECT COUNT(1) FROM trungcauykien ";
            break;
        }

	}
?> 

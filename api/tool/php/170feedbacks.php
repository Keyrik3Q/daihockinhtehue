<?php 
	switch ($data->what) { 
        //******************feedbacks************************
        // feedbacks(id,siteid,name,email,phone,address,title,content,approved,lang,postdate,reply)
        // Get all data from feedbacks
        case 170: {
            $sql = "SELECT * FROM feedbacks";
            break;
        }

        // Insert data to feedbacks
        case 171: {
            $sql = "INSERT INTO feedbacks(siteid,name,email,phone,address,title,content,approved,lang,postdate,reply)
            		VALUES('$data->siteid','$data->name','$data->email','$data->phone','$data->address','$data->title','$data->content','$data->approved','$data->lang','$data->postdate','$data->reply')";
            break;
        }

        // Update data feedbacks
        case 172: {
            $sql = "UPDATE feedbacks SET siteid='$data->siteid', name='$data->name', email='$data->email', phone='$data->phone', address='$data->address', title='$data->title', content='$data->content', approved='$data->approved', lang='$data->lang', postdate='$data->postdate', reply = '$data->reply'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of feedbacks
        case 173: {
            $sql = "DELETE FROM feedbacks
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id feedbacks
        case 174: {
            $sql = "SELECT * FROM feedbacks
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) feedbacks
        case 175: {
            $sql = "SELECT * FROM feedbacks
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of feedbacks
        case 176: {
            $sql = "SELECT COUNT(1) FROM feedbacks ";
            break;
        }

	}
?> 

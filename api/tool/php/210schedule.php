<?php 
	switch ($data->what) { 
        //******************schedule************************
        // schedule(id,sdate,stime,content,stakeholder,location,host,approved,postdate,lang)
        // Get all data from schedule
        case 210: {
            $sql = "SELECT * FROM schedule";
            break;
        }

        // Insert data to schedule
        case 211: {
            $sql = "INSERT INTO schedule(sdate,stime,content,stakeholder,location,host,approved,postdate,lang)
            		VALUES('$data->sdate','$data->stime','$data->content','$data->stakeholder','$data->location','$data->host','$data->approved','$data->postdate','$data->lang')";
            break;
        }

        // Update data schedule
        case 212: {
            $sql = "UPDATE schedule SET sdate='$data->sdate', stime='$data->stime', content='$data->content', stakeholder='$data->stakeholder', location='$data->location', host='$data->host', approved='$data->approved', postdate='$data->postdate', lang = '$data->lang'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of schedule
        case 213: {
            $sql = "DELETE FROM schedule
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id schedule
        case 214: {
            $sql = "SELECT * FROM schedule
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) schedule
        case 215: {
            $sql = "SELECT * FROM schedule
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of schedule
        case 216: {
            $sql = "SELECT COUNT(1) FROM schedule ";
            break;
        }

	}
?> 

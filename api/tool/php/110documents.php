<?php 
	switch ($data->what) { 
        //******************documents************************
        // documents(id,typeid,siteid,title,url,content,pathfile,postdate,changedate,approved,lang,author)
        // Get all data from documents
        case 110: {
            $sql = "SELECT * FROM documents";
            break;
        }

        // Insert data to documents
        case 111: {
            $sql = "INSERT INTO documents(typeid,siteid,title,url,content,pathfile,postdate,changedate,approved,lang,author)
            		VALUES('$data->typeid','$data->siteid','$data->title','$data->url','$data->content','$data->pathfile','$data->postdate','$data->changedate','$data->approved','$data->lang','$data->author')";
            break;
        }

        // Update data documents
        case 112: {
            $sql = "UPDATE documents SET typeid='$data->typeid', siteid='$data->siteid', title='$data->title', url='$data->url', content='$data->content', pathfile='$data->pathfile', postdate='$data->postdate', changedate='$data->changedate', approved='$data->approved', lang='$data->lang', author = '$data->author'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of documents
        case 113: {
            $sql = "DELETE FROM documents
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id documents
        case 114: {
            $sql = "SELECT * FROM documents
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) documents
        case 115: {
            $sql = "SELECT * FROM documents
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of documents
        case 116: {
            $sql = "SELECT COUNT(1) FROM documents ";
            break;
        }

	}
?> 

<?php 
	switch ($data->what) { 
        //******************contents************************
        // contents(id,typeid,siteid,title,url,summary,content,pathfile,pathimage,comment,postdate,changedate,approved,lang,author)
        // Get all data from contents
        case 90: {
            $sql = "SELECT * FROM contents";
            break;
        }

        // Insert data to contents
        case 91: {
            $sql = "INSERT INTO contents(typeid,siteid,title,url,summary,content,pathfile,pathimage,comment,postdate,changedate,approved,lang,author)
            		VALUES('$data->typeid','$data->siteid','$data->title','$data->url','$data->summary','$data->content','$data->pathfile','$data->pathimage','$data->comment','$data->postdate','$data->changedate','$data->approved','$data->lang','$data->author')";
            break;
        }

        // Update data contents
        case 92: {
            $sql = "UPDATE contents SET typeid='$data->typeid', siteid='$data->siteid', title='$data->title', url='$data->url', summary='$data->summary', content='$data->content', pathfile='$data->pathfile', pathimage='$data->pathimage', comment='$data->comment', postdate='$data->postdate', changedate='$data->changedate', approved='$data->approved', lang='$data->lang', author = '$data->author'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of contents
        case 93: {
            $sql = "DELETE FROM contents
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id contents
        case 94: {
            $sql = "SELECT * FROM contents
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) contents
        case 95: {
            $sql = "SELECT * FROM contents
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of contents
        case 96: {
            $sql = "SELECT COUNT(1) FROM contents ";
            break;
        }

	}
?> 

<?php 
	switch ($data->what) { 
        //******************news************************
        // news(id,typeid,siteid,title,url,postdate,changedate,summary,content,pathimage,author,approved,comment,lang,isfocus,isNew,view)
        // Get all data from news
        case 100: {
            $sql = "SELECT * FROM news";
            break;
        }

        // Insert data to news
        case 101: {
            $sql = "INSERT INTO news(typeid,siteid,title,url,postdate,changedate,summary,content,pathimage,author,approved,comment,lang,isfocus,isNew,view)
            		VALUES('$data->typeid','$data->siteid','$data->title','$data->url','$data->postdate','$data->changedate','$data->summary','$data->content','$data->pathimage','$data->author','$data->approved','$data->comment','$data->lang','$data->isfocus','$data->isNew','$data->view')";
            break;
        }

        // Update data news
        case 102: {
            $sql = "UPDATE news SET typeid='$data->typeid', siteid='$data->siteid', title='$data->title', url='$data->url', postdate='$data->postdate', changedate='$data->changedate', summary='$data->summary', content='$data->content', pathimage='$data->pathimage', author='$data->author', approved='$data->approved', comment='$data->comment', lang='$data->lang', isfocus='$data->isfocus', isNew='$data->isNew', view = '$data->view'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of news
        case 103: {
            $sql = "DELETE FROM news
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id news
        case 104: {
            $sql = "SELECT * FROM news
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) news
        case 105: {
            $sql = "SELECT * FROM news
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of news
        case 106: {
            $sql = "SELECT COUNT(1) FROM news ";
            break;
        }

	}
?> 

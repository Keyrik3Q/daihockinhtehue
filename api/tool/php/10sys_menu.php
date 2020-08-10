<?php 
	switch ($data->what) { 
        //******************sys_menu************************
        // sys_menu(id,ptypeid,siteid,title,keyword,arrange,position,approved,lang,url,intranet)
        // Get all data from sys_menu
        case 10: {
            $sql = "SELECT * FROM sys_menu";
            break;
        }

        // Insert data to sys_menu
        case 11: {
            $sql = "INSERT INTO sys_menu(ptypeid,siteid,title,keyword,arrange,position,approved,lang,url,intranet)
            		VALUES('$data->ptypeid','$data->siteid','$data->title','$data->keyword','$data->arrange','$data->position','$data->approved','$data->lang','$data->url','$data->intranet')";
            break;
        }

        // Update data sys_menu
        case 12: {
            $sql = "UPDATE sys_menu SET ptypeid='$data->ptypeid', siteid='$data->siteid', title='$data->title', keyword='$data->keyword', arrange='$data->arrange', position='$data->position', approved='$data->approved', lang='$data->lang', url='$data->url', intranet = '$data->intranet'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_menu
        case 13: {
            $sql = "DELETE FROM sys_menu
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_menu
        case 14: {
            $sql = "SELECT * FROM sys_menu
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_menu
        case 15: {
            $sql = "SELECT * FROM sys_menu
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_menu
        case 16: {
            $sql = "SELECT COUNT(1) FROM sys_menu ";
            break;
        }

	}
?> 

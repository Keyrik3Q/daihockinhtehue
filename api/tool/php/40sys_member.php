<?php 
	switch ($data->what) { 
        //******************sys_member************************
        // sys_member(id,maphongban,manhom,kyvanban,name,siteid,password,username,postdate,approved,level,permission,email)
        // Get all data from sys_member
        case 40: {
            $sql = "SELECT * FROM sys_member";
            break;
        }

        // Insert data to sys_member
        case 41: {
            $sql = "INSERT INTO sys_member(maphongban,manhom,kyvanban,name,siteid,password,username,postdate,approved,level,permission,email)
            		VALUES('$data->maphongban','$data->manhom','$data->kyvanban','$data->name','$data->siteid','$data->password','$data->username','$data->postdate','$data->approved','$data->level','$data->permission','$data->email')";
            break;
        }

        // Update data sys_member
        case 42: {
            $sql = "UPDATE sys_member SET maphongban='$data->maphongban', manhom='$data->manhom', kyvanban='$data->kyvanban', name='$data->name', siteid='$data->siteid', password='$data->password', username='$data->username', postdate='$data->postdate', approved='$data->approved', level='$data->level', permission='$data->permission', email = '$data->email'
            		WHERE id='$data->id'";
            break;
        }

        // Delete data of sys_member
        case 43: {
            $sql = "DELETE FROM sys_member
            		WHERE id IN($data->id)";
            break;
        }

        // Find data with id sys_member
        case 44: {
            $sql = "SELECT * FROM sys_member
            		WHERE id='$data->id'";
            break;
        }

        // Select with pagination(offset, number-item-in-page) sys_member
        case 45: {
            $sql = "SELECT * FROM sys_member
            		LIMIT $data->offset, $data->limit";
            break;
        }

        // Count number item of sys_member
        case 46: {
            $sql = "SELECT COUNT(1) FROM sys_member ";
            break;
        }

	}
?> 

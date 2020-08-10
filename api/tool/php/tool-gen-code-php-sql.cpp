#include<iostream>
#include<bits/stdc++.h>
#include <string> 
//#include <boost/algorithm/string.hpp> 

using namespace std;

vector<string> split(string str,string delimiter){  
	vector<string> result;
	size_t pos = 0; 
	while ((pos = str.find(delimiter)) != string::npos) {
	   	result.push_back(str.substr(0, pos)); 
	    str.erase(0, pos + delimiter.length());
	} 
	result.push_back(str.substr(0, str.length()-1)); 
	return result;
}


/**
* genModel
*/
void genService(string s, int ans){ 
	vector<string> result;
	string temp,table, param1, param2, param3, param4; 
	
	table = s.substr(0,s.find("("));
	temp = s.substr(s.find("(") +1 ,s.length()-1);
	result = split(temp,",");   
	param1 = s.substr(s.find(",") +1);
	param2 = "";
	param3 = "";
	param4 = "";
	 
	// convert number to string
	ostringstream ostream;
	ostream << ans; 
	
	string fileName = ostream.str() + table + ".php";
	ofstream cout (fileName.c_str());
	
	cout<<"<?php "<<endl;
	cout<<"	switch ($data->what) { "<<endl; 
	
	// get all data from table
	// select * from table 
	cout<<"        //******************"<<table<<"************************"<<endl;
	cout<<"        // "<<s<<endl;
	cout<<"        // Get all data from "<<table<<endl;
	cout<<"        case "<<ans<<": {"<<endl;
	cout<<"            $sql = "SELECT * FROM "<<table<<"";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
		
	for(int i=1;i<result.size()-1;i++){
		// insert
		param2 += "'$data->"+result[i]+"',";  
		
		// update
		param3 += ""+result[i]+"='$data->"+result[i]+"', "; 
	} 
	
	// insert
	param2 += "'$data->"+result[result.size()-1]+"'"; 
	
	// updata
	param3 += ""+result[result.size()-1]+" = '$data->"+result[result.size()-1]+"'"; 
	
	// Insert data to table 
	cout<<"        // Insert data to "<<table<<endl;
	cout<<"        case "<<ans + 1<<": {"<<endl;
	cout<<"            $sql = "INSERT INTO "<<table<<"("+param1+""<<endl;
	cout<<"            		VALUES("+param2+")";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	
	// Update data table 
	cout<<"        // Update data "<<table<<endl;
	cout<<"        case "<<ans + 2<<": {"<<endl;
	cout<<"            $sql = "UPDATE "<<table<<" SET "+param3+""<<endl;
	cout<<"            		WHERE id='$data->id'";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	
	// Delete data from id
	cout<<"        // Delete data of "<<table<<endl;
	cout<<"        case "<<ans + 3<<": {"<<endl;
	cout<<"            $sql = "DELETE FROM "<<table<<endl;
	cout<<"            		WHERE id IN($data->id)";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	
	// Find data with id
	cout<<"        // Find data with id "<<table<<endl;
	cout<<"        case "<<ans + 4<<": {"<<endl;
	cout<<"            $sql = "SELECT * FROM "<<table<<endl;
	cout<<"            		WHERE id='$data->id'";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	
	// Select with pagination(offset, number-item-in-page)
	cout<<"        // Select with pagination(offset, number-item-in-page) "<<table<<endl;
	cout<<"        case "<<ans + 5<<": {"<<endl;
	cout<<"            $sql = "SELECT * FROM "<<table<<endl;
	cout<<"            		LIMIT $data->offset, $data->limit";"<<endl;
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	
	// Count number item of table
	cout<<"        // Count number item of "<<table<<endl;
	cout<<"        case "<<ans + 6<<": {"<<endl;
	cout<<"            $sql = "SELECT COUNT(1) FROM "<<table<<" ";"<<endl; 
	cout<<"            break;"<<endl;
	cout<<"        }"<<endl<<endl;
	 
	cout<<"	}"<<endl;
	cout<<"?> "<<endl; 
}

int main(){
	ifstream cin ("input_php_sql.txt");
	ofstream cout ("output_php_include.txt");
	string s,temp,table, param1, param2, param3, param4;
	
	int n,pos,ans=10;
	cin>>n;
	while(n--){
		cin>>s; 
		// gen include
		table = s.substr(0,s.find("("));
		
		// convert number to string
		ostringstream ostream;
		ostream << ans;  
		string fileName = ostream.str() + table + ".php";
		
		cout<<"include "../Service/"<<fileName<<"";"<<endl;
		
		// gen server
		genService(s, ans);
		ans+=10;
	} 
	return 0;
}



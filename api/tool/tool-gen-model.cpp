#include<iostream>
#include<bits/stdc++.h>
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
void genModel(string model, string tableUppercase, vector<string> result, int ans){ 

	// convert number to string
	ostringstream ostream;
	ostream << ans;  
	
	string fileName = ostream.str() + model + ".models.ts";
	ofstream cout (fileName.c_str());
	
	cout<<"export class "<<tableUppercase<<" {"<<endl;
	cout<<"    id?: Number;"<<endl;
	for(int i=1;i<result.size();i++){ 
		cout<<"    "<<result[i]<<"?: string;"<<endl; 
	}  
	cout<<"}"<<endl;  
}

int main(){
	ifstream cin ("input_php_sql.txt"); 
	
	string s,temp,table, param1, param2, param3, param4;
	vector<string> result;
	int n,pos,ans=10;
	cin>>n;
	while(n--){
		cin>>s; 
		table = s.substr(0,s.find("(")); 
		
		char firstUpper = toupper(table[0]);
		string tableUppercase =  firstUpper + table.substr(1);
		
		temp = s.substr(s.find("(") +1 ,s.length()-1);
		result = split(temp,",");
		
		// create directory
		int check; 
	    string dirname = table;      
		
		// gen dialog html 
		genModel(table, tableUppercase, result, ans); 
		
		ans+=10;
		
	} 
	return 0;
}



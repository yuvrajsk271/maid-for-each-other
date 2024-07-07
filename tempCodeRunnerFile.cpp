#include<iostream>
using namespace std;
void getStarPattern(int n) 
{
    int count=1;
    for(int i=1;i<=n;i++)
    {
        if(count==1 || count==n)
        {
            for(int j=1;j<=n;j++)
            {
                cout<<"*"<<" ";
            }
        }
        else
        {
            cout<<"*"<<" ";
            for(int k=1;k<=2*(n-2);k++)
            {
                cout<<" ";
            }
            cout<<"*";
        }
        count++;
        cout<<endl;
    }
}
int main() {
	
	getStarPattern(4);
	return 0;
}
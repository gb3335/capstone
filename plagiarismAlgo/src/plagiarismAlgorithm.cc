#include <node.h>
#include <v8.h>
#include <string>
#include <queue>
#include <iostream>
#include <nan.h>
#include <bitset>
#include <sstream>
using namespace v8; 
using namespace std;
#define MAXS 1000
#define MAXC 93
#define MAXW 4999

long numofhitss=0, numofpatterns=0, numoftexts=0;

double calculateResult(int numOfHits, int patternLen, int textLen){
    double patdiv = (double)numOfHits/(double)patternLen;
    double txtdiv = (double)numOfHits/(double)textLen;
    double patshared = patdiv*100;
    double txtshared = txtdiv*100;
    double total = (patshared+txtshared)/2;
    return total;
}

    vector<string> arr2;
    string text2;
    int g[MAXS][MAXC];
    int f[MAXS];
    bitset<MAXW> out[MAXS];
    void initialize(vector<string> arr, string text)
    {
        numofhitss=0, numofpatterns=0, numoftexts=0;
        arr2 = arr;
        text2 = text;
        for(int x=0; x<MAXS; x++){
            out[x].reset();
        }
        memset(g,-1,sizeof g);
        memset(f,0,sizeof f);
    }
    void buildMachine()
    {
        int state = 0,currState = 0,index = 0;
        string str;
        ///Building a trie, each new node gets the next number as node-name.
        for(int i = 0; i<arr2.size(); i++)
        {
            str = arr2[i];
            numofpatterns+=str.size();
            currState = 0;

            for(int j = 0; j<str.size(); j++)
            {
                index = str[j] - 33;
                if(g[currState][index] == -1)
                {
                    g[currState][index] = ++state;
                }
                currState = g[currState][index];
            }
            out[currState].set(i);
            ///stores whether i'th indexed string of arr, ends at state 'currState' or not. Thus adding the string to output by using 1 bit, hhh very memory efficient.
        }
        ///Failure function
        queue<int>q;
        int s,fail;
        for(int i = 0; i<MAXC; i++)
        {
            if(g[0][i] != -1)
            {
                f[g[0][i]] = 0; ///here, depth is 1
                q.push(g[0][i]);
            }
            else
            {
                g[0][i] = 0; ///Necessary in failure alg below, non-existing char back to state 0. To stop infinite loop at line 68.
            }
        }
        while(! q.empty())
        {
            s = q.front();
            q.pop();
            for(int i= 0; i<MAXC; i++)
            {
                if(g[s][i] != -1)
                {
                    q.push(g[s][i]);
                    fail = f[s]; ///here is the perfect place to calculate failure of g[s][i],cuz here 'state:s' is (depth-1) state of 'state:g[s][i]'.
                    while(g[fail][i] == -1)
                    {
                        fail = f[fail];
                    }
                    fail = g[fail][i];
                    f[g[s][i]] = fail;
                    out[g[s][i]] |= out[fail]; ///merging output of the node & it's failure node.
                    ///Read the paper of aho-corasick,published in 1975.
                }
            }
        }
    }
    int nextState(int s, char ch)
    {
        int index = ch - 33;
        while(g[s][index] == -1)   ///If non-existing state, use failure function to support automaton.
        {
            s = f[s];
        }
        return g[s][index];
    }


void newsearch(const FunctionCallbackInfo<Value>& args){

    Isolate* isolate = args.GetIsolate();
    // Local<Array> array = Local<Array>::Cast(args[0]);
    // string arr[array->Length()];
    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(args[0]);

    std::vector<string> arr;
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);

        Nan::Utf8String jselem(jsElement->ToString());
        string number = string(*jselem);  

        arr.push_back(number);
    }

    Nan::Utf8String param1(args[1]->ToString());
    // convert it to string
    string text = string(*param1);

    Nan::Utf8String param2(args[2]->ToString());
    // convert it to string
    string flag = string(*param2);


    int myarraycounter=0;
	Local<Array> myarray = Array::New(isolate);

    if(flag=="NEW"){
        initialize(arr,text);
        buildMachine();
    }
    int state = 0;
    for(int i = 0; i<text.size(); i++)
    {
        state = nextState(state,text[i]); /// traverse the trie state/node for the text
        if(out[state].count() > 0) /// if the state has at least one output
        {
            for(int j = 0; j<arr2.size(); j++) ///For finding position of search strings.
            {
                if(out[state].test(j)) /// if j'th string is in the output of state, means a match is found.
                {
                    numofhitss+=arr2[j].size();
                    int start = i -arr2[j].size()+1;
                   
                    ostringstream oss;
 
                    oss <<"{ \"Word\": \""<<arr2[j]<<"\",\"Start\": "<<start<<",\"End\": "<<i<<" }";
                    string word = oss.str ();
                    
                    //string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";
                    // Local<String> retval = String::NewFromUtf8(isolate, word.c_str());
                    // Nan::Set(myarray, myarraycounter, retval);
                    myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
                    // cout << "Word " << arr[j] << " appears from "
                    // 	<< i - arr[j].size() + 1 << " to " << i << endl;
                    myarraycounter++;
                }
            }
        }
    }

    ////

    numoftexts=text.size();
    double total = calculateResult(numofhitss, numofpatterns, numoftexts);

    v8::Local<v8::Object> jsonObject = Nan::New<v8::Object>();

	v8::Local<v8::String> totalprop = Nan::New("SimilarityScore").ToLocalChecked();
	v8::Local<v8::String> numofhitsprop = Nan::New("NumOfHits").ToLocalChecked();
	v8::Local<v8::String> numofpatternprop = Nan::New("NumOfPattern").ToLocalChecked();
	v8::Local<v8::String> numoftextnprop = Nan::New("NumOfText").ToLocalChecked();
	v8::Local<v8::String> arrayprop = Nan::New("Index").ToLocalChecked();

	v8::Local<v8::Value> totalvalue = Nan::New(total);
	v8::Local<v8::Value> numofhitsvalue = Nan::New(numofhitss);
	v8::Local<v8::Value> numofpatternvalue = Nan::New(numofpatterns);
	v8::Local<v8::Value> numoftextnvalue = Nan::New(numoftexts);
	v8::Local<v8::Value> arrayvalue = myarray;

	Nan::Set(jsonObject, totalprop, totalvalue);
	Nan::Set(jsonObject, numofhitsprop, numofhitsvalue);
	Nan::Set(jsonObject, numofpatternprop, numofpatternvalue);
	Nan::Set(jsonObject, numoftextnprop, numoftextnvalue);
	Nan::Set(jsonObject, arrayprop, arrayvalue);

	args.GetReturnValue().Set(jsonObject);
}


void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "search", newsearch);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
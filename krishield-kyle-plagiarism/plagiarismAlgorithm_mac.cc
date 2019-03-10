#include <node.h>
#include <v8.h>
#include <string>
#include <queue>
#include <iostream>
#include <nan.h>
#include <bitset>
#include <sstream>
using namespace v8;
#define MAXS 1000
#define MAXC 93
#define MAXW 1000000

int numofhitss=0, numofpatterns=0, numoftexts=0;

double calculateResult(int numOfHits, int patternLen, int textLen){
    double patdiv = (double)numOfHits/(double)patternLen;
    double txtdiv = (double)numOfHits/(double)textLen;
    double patshared = patdiv*100;
    double txtshared = txtdiv*100;
    double total = (patshared+txtshared)/2;
    return total;
}

double calculateResultDoc1(int numOfHits, int patternLen){
    double patdiv = (double)numOfHits/(double)patternLen;
    double patshared = patdiv*100;
    double total = patshared;
    return total;
}

double calculateResultDoc2(int numOfHits, int textLen){
    double txtdiv = (double)numOfHits/(double)textLen;
    double txtshared = txtdiv*100;
    double total = txtshared;
    return total;
}

std::vector<std::string> arr2;
std::string text2;
int g[MAXS][MAXC];
int f[MAXS];
std::bitset<MAXW> out[MAXS];
void initialize(std::vector<std::string> arr, std::string text)
{
    numofpatterns=0;
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
    std::string str;
    ///Building a trie, each new node gets the next number as node-name.
    for(unsigned int i = 0; i<arr2.size(); i++)
    {
        str = arr2[i];
        numofpatterns+=str.size()+1;
        currState = 0;

        for(unsigned int j = 0; j<str.size(); j++)
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
    std::queue<int>q;
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
    numofpatterns--;
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


void newsearch(const Nan::FunctionCallbackInfo<v8::Value>& info){

    if(info.Length()!=5){
        return Nan::ThrowError(Nan::New("Function expecting 5 arguments").ToLocalChecked());
    }
    if(!info[0]->IsArray()) {
        return Nan::ThrowError(Nan::New("expected arg 0: Should be an Array of Strings").ToLocalChecked());
    }
    if(!info[1]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 1: Should be a String").ToLocalChecked());
    }
    if(!info[2]->IsBoolean()) {
        return Nan::ThrowError(Nan::New("expected arg 2: Should be a Boolean").ToLocalChecked());
    }
    if(!info[3]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 3: String (Document name)").ToLocalChecked());
    }
    if(!info[4]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 4: String (Document name)").ToLocalChecked());
    }
    numofhitss=0, numoftexts=0;

    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(info[0]);   

    std::vector<std::string> arr;
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);

        Nan::Utf8String jselem(jsElement->ToString());
        std::string number = std::string(*jselem);  

        arr.push_back(number);
    }

    Nan::Utf8String param1(info[1]->ToString());
    // convert it to string
    std::string text = std::string(*param1);

    bool flag = info[2]->BooleanValue();


    int myarraycounter=0;
	Local<Array> myarray = Nan::New<v8::Array>();

    if(flag){
        initialize(arr,text);
        buildMachine();
    }
    int state = 0;
    for(unsigned int i = 0; i<text.size(); i++)
    {
        state = nextState(state,text[i]); /// traverse the trie state/node for the text
        if(out[state].count() > 0) /// if the state has at least one output
        {
            for(unsigned int j = 0; j<arr2.size(); j++) ///For finding position of search strings.
            {
                if(out[state].test(j)) /// if j'th string is in the output of state, means a match is found.
                {
                    int start = i -arr2[j].size()+1;
                    if(start==0 && text[i+1]==' '){
                        numofhitss+=arr2[j].size()+1;
                        std::ostringstream oss;
    
                        oss <<"{ \"Word\": \""<<arr2[j]<<"\",\"Start\": "<<start<<",\"End\": "<<i<<" }";
                        std::string word = oss.str ();
                        
                        //string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";
                        // Local<String> retval = String::NewFromUtf8(isolate, word.c_str());
                        // Nan::Set(myarray, myarraycounter, retval);
                        // myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
                        v8::Local<v8::Value> newword = Nan::New(word).ToLocalChecked();
                        Nan::Set(myarray, myarraycounter, newword);
                        // cout << "Word " << arr[j] << " appears from "
                        // 	<< i - arr[j].size() + 1 << " to " << i << endl;
                        myarraycounter++;
                    }else if(text[start-1]==' ' && i==text.size()-1){
                        numofhitss+=arr2[j].size()+1;
                        std::ostringstream oss;
    
                        oss <<"{ \"Word\": \""<<arr2[j]<<"\",\"Start\": "<<start<<",\"End\": "<<i<<" }";
                        std::string word = oss.str ();
                        
                        //string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";
                        // Local<String> retval = String::NewFromUtf8(isolate, word.c_str());
                        // Nan::Set(myarray, myarraycounter, retval);
                        // myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
                        v8::Local<v8::Value> newword = Nan::New(word).ToLocalChecked();
                        Nan::Set(myarray, myarraycounter, newword);
                        // cout << "Word " << arr[j] << " appears from "
                        // 	<< i - arr[j].size() + 1 << " to " << i << endl;
                        myarraycounter++;
                    }else if(start==0 && i==text.size()-1){
                        numofhitss+=arr2[j].size()+1;
                        std::ostringstream oss;
    
                        oss <<"{ \"Word\": \""<<arr2[j]<<"\",\"Start\": "<<start<<",\"End\": "<<i<<" }";
                        std::string word = oss.str ();
                        
                        //string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";
                        // Local<String> retval = String::NewFromUtf8(isolate, word.c_str());
                        // Nan::Set(myarray, myarraycounter, retval);
                        // myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
                        v8::Local<v8::Value> newword = Nan::New(word).ToLocalChecked();
                        Nan::Set(myarray, myarraycounter, newword);
                        // cout << "Word " << arr[j] << " appears from "
                        // 	<< i - arr[j].size() + 1 << " to " << i << endl;
                        myarraycounter++;
                    }
                    else if(text[start-1]==' ' && text[i+1]==' '){
                        numofhitss+=arr2[j].size()+1;
                        std::ostringstream oss;
    
                        oss <<"{ \"Word\": \""<<arr2[j]<<"\",\"Start\": "<<start<<",\"End\": "<<i<<" }";
                        std::string word = oss.str ();
                        
                        //string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";
                        // Local<String> retval = String::NewFromUtf8(isolate, word.c_str());
                        // Nan::Set(myarray, myarraycounter, retval);
                        // myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
                        v8::Local<v8::Value> newword = Nan::New(word).ToLocalChecked();
                        Nan::Set(myarray, myarraycounter, newword);
                        // cout << "Word " << arr[j] << " appears from "
                        // 	<< i - arr[j].size() + 1 << " to " << i << endl;
                        myarraycounter++;
                    }
                }
            }
        }
    }

    ////

    numoftexts=text.size();
    if(numofhitss!=0){
        numofhitss--;
    }
    
    double total = calculateResult(numofhitss, numofpatterns, numoftexts);
    double totaldoc1 = calculateResultDoc1(numofhitss, numofpatterns);
    double totaldoc2 = calculateResultDoc2(numofhitss, numoftexts);

    //Whole Object to Return
    v8::Local<v8::Object> jsonObject = Nan::New<v8::Object>();

    v8::Local<v8::String> docunameprop = Nan::New("Name").ToLocalChecked();
    v8::Local<v8::String> docuscoreprop = Nan::New("Score").ToLocalChecked();

    // Object for Document1
    v8::Local<v8::Object> docuObject1 = Nan::New<v8::Object>();

    v8::Local<v8::Value> docuname1 = info[3]->ToString();
    v8::Local<v8::Value> docuvalue1 = Nan::New(totaldoc1);
    Nan::Set(docuObject1, docunameprop, docuname1);
    Nan::Set(docuObject1, docuscoreprop, docuvalue1);

    // Object for Document2
    v8::Local<v8::Object> docuObject2 = Nan::New<v8::Object>();

    v8::Local<v8::Value> docuname2 = info[4]->ToString();
    v8::Local<v8::Value> docuvalue2 = Nan::New(totaldoc2);
    Nan::Set(docuObject2, docunameprop, docuname2);
    Nan::Set(docuObject2, docuscoreprop, docuvalue2);

    // Object for Document1 and Document2
    v8::Local<v8::Object> docuObject = Nan::New<v8::Object>();

    v8::Local<v8::String> docuprop1 = Nan::New("Document_1").ToLocalChecked();
    v8::Local<v8::String> docuprop2 = Nan::New("Document_2").ToLocalChecked();
	v8::Local<v8::Value> docuvalue_1 = docuObject1;
	v8::Local<v8::Value> docuvalue_2 = docuObject2;

    Nan::Set(docuObject, docuprop1, docuvalue_1);
    Nan::Set(docuObject, docuprop2, docuvalue_2);

	v8::Local<v8::String> totalprop = Nan::New("SimilarityScore").ToLocalChecked();
	v8::Local<v8::String> docuprop = Nan::New("DocumentScore").ToLocalChecked();
	v8::Local<v8::String> numofhitsprop = Nan::New("NumOfHits").ToLocalChecked();
	v8::Local<v8::String> numofpatternprop = Nan::New("NumOfPattern").ToLocalChecked();
	v8::Local<v8::String> numoftextnprop = Nan::New("NumOfText").ToLocalChecked();
	v8::Local<v8::String> arrayprop = Nan::New("Index").ToLocalChecked();

	v8::Local<v8::Value> totalvalue = Nan::New(total);
	v8::Local<v8::Value> docuvalue = docuObject;
	v8::Local<v8::Value> numofhitsvalue = Nan::New(numofhitss);
	v8::Local<v8::Value> numofpatternvalue = Nan::New(numofpatterns);
	v8::Local<v8::Value> numoftextnvalue = Nan::New(numoftexts);
	v8::Local<v8::Value> arrayvalue = myarray;

	Nan::Set(jsonObject, totalprop, totalvalue);
	Nan::Set(jsonObject, docuprop, docuvalue);
	Nan::Set(jsonObject, numofhitsprop, numofhitsvalue);
	Nan::Set(jsonObject, numofpatternprop, numofpatternvalue);
	Nan::Set(jsonObject, numoftextnprop, numoftextnvalue);
	Nan::Set(jsonObject, arrayprop, arrayvalue);

	info.GetReturnValue().Set(jsonObject);
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("search").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(newsearch)->GetFunction());
}

NODE_MODULE(plagiarism, Init)
#include <node.h>
#include <v8.h>
#include <string>
#include <algorithm>
#include <queue>
#include <iostream>
#include <nan.h>
#include <bitset>
#include <sstream>
using namespace v8; 
using namespace std;
#define MAXS 15000
#define MAXC 93
#define MAXW 1000000

int numofpatternsentence=0, numoftextsentence=0;

string patternname="", patternid="";

double calculateSentenceSimilarity(int numOfHits, int patternLen, int textLen){
    double patdiv = (double)numOfHits/(double)patternLen;
    double txtdiv = (double)numOfHits/(double)textLen;
    double patshared = patdiv*100;
    double txtshared = txtdiv*100;
    double total = (patshared+txtshared)/2;
    return total;
}

double calculateSimilarityScore(int numOfHits, int len){
    double patdiv = (double)numOfHits/(double)len;
    double patshared = patdiv*100;
    double total = patshared;
    return total;
}


vector<string> arr2;
string text2;
int g[MAXS][MAXC];
int f[MAXS];
bitset<MAXW> out[MAXS];
void buildMachine()
{
    int state = 0,currState = 0,index = 0;
    string str;
    ///Building a trie, each new node gets the next number as node-name.
    for(unsigned  int i = 0; i<arr2.size(); i++)
    {
        
        str = arr2[i];
        str.erase(std::remove(str.begin(), str.end(), '.'), str.end());
        currState = 0;

        for(unsigned  int j = 0; j<str.size(); j++)
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
void initialize(const Nan::FunctionCallbackInfo<v8::Value>& info /*vector<string> arr, string text*/)
{

    if(info.Length()!=4){
        return Nan::ThrowError(Nan::New("Function expecting 5 arguments").ToLocalChecked());
    }
    if(!info[0]->IsArray()) {
        return Nan::ThrowError(Nan::New("expected arg 0: Should be an Array of Strings").ToLocalChecked());
    }
    if(!info[1]->IsInt32()) {
        return Nan::ThrowError(Nan::New("expected arg 1: Integer (Number of sentence in the document)").ToLocalChecked());
    }
    if(!info[2]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 2: Should be a String (Name of the document)").ToLocalChecked());
    }
    if(!info[3]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 3: Should be a String (Id of the document)").ToLocalChecked());
    }


    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(info[0]);   

    std::vector<string> arr;
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);

        Nan::Utf8String jselem(jsElement->ToString());
        string number = string(*jselem);  

        arr.push_back(number);
    }

    numofpatternsentence=info[1]->IntegerValue();

    Nan::Utf8String param1(info[2]->ToString());
    // convert it to string
    patternname = string(*param1);

    Nan::Utf8String param2(info[3]->ToString());
    // convert it to string
    patternid = string(*param2);

    arr2 = arr;
    for(int x=0; x<MAXS; x++){
        out[x].reset();
    }
    memset(g,-1,sizeof g);
    memset(f,0,sizeof f);
    buildMachine();
    //info.GetReturnValue().Set("Initialize");
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

    if(info.Length()!=4){
        return Nan::ThrowError(Nan::New("Function expecting 5 arguments").ToLocalChecked());
    }
    // if(!info[0]->IsArray()) {
    //     return Nan::ThrowError(Nan::New("expected arg 0: Should be an Array of Strings").ToLocalChecked());
    // }
    if(!info[0]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 0: Should be a String").ToLocalChecked());
    }
    // if(!info[2]->IsBoolean()) {
    //     return Nan::ThrowError(Nan::New("expected arg 2: Should be a Boolean").ToLocalChecked());
    // }
    if(!info[1]->IsInt32()) {
        return Nan::ThrowError(Nan::New("expected arg 1: Integer (Number of sentence in the document)").ToLocalChecked());
    }
    if(!info[2]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 2: Should be a String (Name of the document)").ToLocalChecked());
    }
    if(!info[3]->IsString()) {
        return Nan::ThrowError(Nan::New("expected arg 3: Should be a String (Id of the document)").ToLocalChecked());
    }


    // v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(info[0]);   

    // std::vector<string> arr;
    // for (unsigned int i = 0; i < jsArr->Length(); i++) {
    //     v8::Local<v8::Value> jsElement = jsArr->Get(i);

    //     Nan::Utf8String jselem(jsElement->ToString());
    //     string number = string(*jselem);  

    //     arr.push_back(number);
    // }

    Nan::Utf8String param1(info[0]->ToString());
    // convert it to string
    char *text = *param1;

    int numoftextsentence = info[1]->IntegerValue();

    Nan::Utf8String param3(info[2]->ToString());
    // convert it to string
    string textname = string(*param3);

    Nan::Utf8String param2(info[3]->ToString());
    // convert it to string
    string textid = string(*param2);

    // boolean flag = info[2]->BooleanValue();

    // if(flag){
    //     initialize(arr,text);
    //     buildMachine();
    // }
    int state = 0;

    /// bago
    std::vector<int> patternStoredNumHits;
    std::vector<int> patternStoredIndexes;
    std::vector<int> storedPatternNumWords;

    int numHitsCounter=0;
    int patternNumWordsCounter=0;
    int patternCurIndex=0;

    int textCurIndex=0;

    int sentenceDetected=0;
    int gotHit=0;
    std::vector<string> storedSentences;
    string sentence="";

    int myarraycounter=0;
	Local<Array> myarray = Nan::New<v8::Array>();

    
    // bago


    int textCurNumWords=0;


    char *token = strtok(text,".");
    while(token != NULL){
        string text = token;
        text = text.substr(text.find_first_not_of(' '), (text.find_last_not_of(' ') - text.find_first_not_of(' ')) + 1);
        for(unsigned int i = 0; i<text.size(); i++)
        {
            
            state = nextState(state,text[i]); /// traverse the trie state/node for the text.
            if(out[state].count() > 0) ///        if the state. has at least one output
            {
                for(unsigned int j = 0; j<arr2.size(); j++) ///For finding position of search strings.
                {
                    string newarr = arr2[j];
                    if(newarr[newarr.size()-1]=='.'){
                        
                        newarr.erase(std::remove(newarr.begin(), newarr.end(), '.'), newarr.end());
                    }
                    string newarr2 = arr2[j];

                    if(out[state].test(j)) /// if j'th string is in the output of state, means a match is found.
                    {
                        
                        int hitFlag=0;
                        int start = i -newarr.size()+1;


                        if(start==0 && text[i+1]==' '){
                            // Una and space

                            hitFlag=1;

                        }else if(text[start-1]==' ' && text[i+1]==' '){
                            // Space and space

                            hitFlag=1;

                        }else if(text[start-1]==' ' && i==text.size()-1){
                            // Space and huli

                            hitFlag=1;

                        }else if(text[start-1]==' ' && text[i+1]=='.'){
                            // Space and tuldok

                            hitFlag=1;

                        }else if(start==0 && text[i+1]=='.'){
                            // Una and tuldok

                            hitFlag=1;

                        }else if(start==0 && i==text.size()-1){
                            // Una and huli

                            hitFlag=1;

                        }

                        if(hitFlag==1){
                            numHitsCounter=1;
                        }
                    }
                    

                    if(newarr2[newarr2.size()-1]=='.'){
                        patternNumWordsCounter++;
                        sentence = sentence+newarr;
                        if(numHitsCounter>0){
                            gotHit=1;
                            if(patternStoredNumHits.size()>0){
                                // if(patternIndexFlag==patternCurIndex && textIndexFlag==textCurIndex){
                                //     patternStoredNumHits[patternStoredNumHits.size()-1]++;
                                // }else{
                                    std::vector<int>::iterator it = std::find(patternStoredIndexes.begin(), patternStoredIndexes.end(), patternCurIndex);
                                    if(it != patternStoredIndexes.end()){
                                        patternStoredNumHits[it-patternStoredIndexes.begin()]++;
                                    }else{
                                        patternStoredNumHits.push_back(numHitsCounter);
                                        storedPatternNumWords.push_back(patternNumWordsCounter);
                                        patternStoredIndexes.push_back(patternCurIndex);
                                
                                        
                                    }
                                    // int pagwala=0;
                                    // for(int x=0; x<patternStoredIndexes.size(); x++){
                                    //     if(patternStoredIndexes[x]==patternCurIndex){
                                    //         patternStoredNumHits[x]++;
                                    //         break;
                                    //     }else{
                                    //         pagwala=1;
                                    //     }
                                    // }
                                    // if(pagwala==1){
                                        
                                    // }
                                    
                                //}
                            }else{

                                patternStoredNumHits.push_back(numHitsCounter);
                                storedPatternNumWords.push_back(patternNumWordsCounter);
                                patternStoredIndexes.push_back(patternCurIndex);
                        
                            }
                            numHitsCounter=0;
                            
                        }
                        if(gotHit==1){
                            storedSentences.push_back(sentence);
                            gotHit=0;
                        }
                        sentence="";
                        patternNumWordsCounter=0;
                        patternCurIndex++;

                    }else{
                        sentence = sentence+newarr+" ";
                        patternNumWordsCounter++;
                    }
                    
                }
            }
            patternCurIndex=0;
            
            if(text[i]==' '){
                textCurNumWords++;
                
            }
        }

        textCurNumWords++;
        for(unsigned int x=0; x<patternStoredNumHits.size(); x++){
            //cout<<"Hits: "<<patternStoredNumHits[x]<<" Num Of Words: "<<storedPatternNumWords[x]<<" "<<textCurNumWords<<" Indexes: "<<patternStoredIndexes[x]<<" "<<textCurIndex<<endl;
            double total = calculateSentenceSimilarity(patternStoredNumHits[x], storedPatternNumWords[x],textCurNumWords);
            //cout<<total<<endl;
            if(total>80){

                ostringstream oss;
                
                sentenceDetected++;
                oss <<"{ \"Pattern\": \""<<storedSentences[x]<<"\" }";
                string word = oss.str ();
                
                v8::Local<v8::Value> newword = Nan::New(word).ToLocalChecked();
                Nan::Set(myarray, myarraycounter, newword);
                myarraycounter++;
            }
        }
        patternStoredNumHits.clear();
        storedPatternNumWords.clear();
        patternStoredIndexes.clear();
        storedSentences.clear();
        textCurNumWords=0;
        textCurIndex++;
        token = strtok (NULL, ".");
    }

    //cout<<sentenceDetected<<endl;

    // cout<<"---------------------Index------------------------"<<endl;
    // for(int x=0; x<textStoredIndexes.size(); x++){
    //     cout<<"Pattern at index "<<x<<": "<<patternStoredIndexes[x]<<endl;
    //     cout<<"Text at index "<<x<<": "<<textStoredIndexes[x]<<endl;
    // }

    // cout<<"---------------------Words Count------------------------"<<endl;
    // for(int x=0; x<storedTextNumWords.size(); x++){
    //     cout<<"Pattern words "<<x<<": "<<storedPatternNumWords[x]<<endl;
    //     cout<<"Text words "<<x<<": "<<storedTextNumWords[x]<<endl;
    // }

    // cout<<"---------------------HITS------------------------"<<endl;
    // for(int x=0; x<storedNumHits.size(); x++){
    //     cout<<"HIT "<<x<<": "<<storedNumHits[x]<<endl;
    // }
    
    double patternSimilarityTotal = calculateSimilarityScore(sentenceDetected, numofpatternsentence);
    //double textSimilarityTotal = calculateSimilarityScore(sentenceDetected, numoftextsentence);


    v8::Local<v8::String> nameprop = Nan::New("Name").ToLocalChecked();
	v8::Local<v8::String> idprop = Nan::New("Id").ToLocalChecked();

    ////
    v8::Local<v8::Object> patternObject = Nan::New<v8::Object>();

    v8::Local<v8::Value> patternnamevalue = Nan::New(patternname).ToLocalChecked();
	v8::Local<v8::Value> patternidvalue = Nan::New(patternid).ToLocalChecked();

    Nan::Set(patternObject, nameprop, patternnamevalue);
    Nan::Set(patternObject, idprop, patternidvalue);
    ///

    ////
    v8::Local<v8::Object> textObject = Nan::New<v8::Object>();

    v8::Local<v8::Value> textnamevalue = Nan::New(textname).ToLocalChecked();
	v8::Local<v8::Value> textidvalue = Nan::New(textid).ToLocalChecked();

    Nan::Set(textObject, nameprop, textnamevalue);
    Nan::Set(textObject, idprop, textidvalue);
    ///

    v8::Local<v8::Object> documentObject = Nan::New<v8::Object>();

    v8::Local<v8::String> patterndocuprop = Nan::New("Pattern").ToLocalChecked();
	v8::Local<v8::String> textdocuprop = Nan::New("Text").ToLocalChecked();

    v8::Local<v8::Value> patterndocuvalue = patternObject;
	v8::Local<v8::Value> textdocuvalue = textObject;

    Nan::Set(documentObject, patterndocuprop, patterndocuvalue);
    Nan::Set(documentObject, textdocuprop, textdocuvalue);

    // v8::Local<v8::Object> similarityObject = Nan::New<v8::Object>();

    // v8::Local<v8::String> patternprop = Nan::New("Pattern").ToLocalChecked();
	// v8::Local<v8::String> textprop = Nan::New("Text").ToLocalChecked();

    // v8::Local<v8::Value> patternvalue = Nan::New(patternSimilarityTotal);
	// v8::Local<v8::Value> textvalue = Nan::New(textSimilarityTotal);

    // Nan::Set(similarityObject, patternprop, patternvalue);
    // Nan::Set(similarityObject, textprop, textvalue);

    //Whole Object to Return
    v8::Local<v8::Object> jsonObject = Nan::New<v8::Object>();

	v8::Local<v8::String> totalprop = Nan::New("SimilarityScore").ToLocalChecked();
    v8::Local<v8::String> documentprop = Nan::New("Document").ToLocalChecked();
	v8::Local<v8::String> arrayprop = Nan::New("Index").ToLocalChecked();

	v8::Local<v8::Value> totalvalue = Nan::New(patternSimilarityTotal);
	v8::Local<v8::Value> documentvalue = documentObject;
	v8::Local<v8::Value> arrayvalue = myarray;

	Nan::Set(jsonObject, totalprop, totalvalue);
	Nan::Set(jsonObject, documentprop, documentvalue);
	Nan::Set(jsonObject, arrayprop, arrayvalue);
	info.GetReturnValue().Set(jsonObject);
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("search").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(newsearch)->GetFunction());
    exports->Set(Nan::New("initialize").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(initialize)->GetFunction());
}

NODE_MODULE(plagiarism, Init)
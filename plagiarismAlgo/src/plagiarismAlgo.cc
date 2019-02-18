// C++ program for implementation of Aho Corasick algorithm
// for string matching
#include <node.h>
#include <v8.h>
#include <string>
#include <queue>
#include <iostream>
#include <nan.h>
using namespace v8; 
using namespace std;

// Max number of states in the matching machine.
// Should be equal to the sum of the length of all keywords.
const int MAXS = 500;

// Maximum number of characters in input alphabet
const int MAXC = 26;

// OUTPUT FUNCTION IS IMPLEMENTED USING out[]
// Bit i in this mask is one if the word with index i
// appears when the machine enters this state.
int out[MAXS];

// FAILURE FUNCTION IS IMPLEMENTED USING f[]
int f[MAXS];

// GOTO FUNCTION (OR TRIE) IS IMPLEMENTED USING g[][]
int g[MAXS][MAXC];

int numofpatterns = 0;



double calculateResult(int numOfHits, int patternLen, int textLen){
    double patdiv = (double)numOfHits/(double)patternLen;
    double txtdiv = (double)numOfHits/(double)textLen;
    double patshared = patdiv*100;
    double txtshared = txtdiv*100;
    double total = (patshared+txtshared)/2;
    return total;
}


// Builds the string matching machine.
// arr - array of words. The index of each keyword is important:
//		 "out[state] & (1 << i)" is > 0 if we just found word[i]
//		 in the text.
// Returns the number of states that the built machine has.
// States are numbered 0 up to the return value - 1, inclusive.
int buildMatchingMachine(string arr[], int k)
{
	// Initialize all values in output function as 0.
	memset(out, 0, sizeof out);

	// Initialize all values in goto function as -1.
	memset(g, -1, sizeof g);

	// Initially, we just have the 0 state
	int states = 1;

	// Construct values for goto function, i.e., fill g[][]
	// This is same as building a Trie for arr[]
	for (int i = 0; i < k; ++i)
	{
		const string &word = arr[i];
		int currentState = 0;
		numofpatterns+=arr[i].size();

		// Insert all characters of current word in arr[]
		for (int j = 0; j < word.size(); ++j)
		{
			int ch = word[j] - 'a';

			// Allocate a new node (create a new state) if a
			// node for ch doesn't exist.
			if (g[currentState][ch] == -1)
				g[currentState][ch] = states++;

			currentState = g[currentState][ch];
		}

		// Add current word in output function
		out[currentState] |= (1 << i);
	}

	// For all characters which don't have an edge from
	// root (or state 0) in Trie, add a goto edge to state
	// 0 itself
	for (int ch = 0; ch < MAXC; ++ch)
		if (g[0][ch] == -1)
			g[0][ch] = 0;

	// Now, let's build the failure function

	// Initialize values in fail function
	memset(f, -1, sizeof f);

	// Failure function is computed in breadth first order
	// using a queue
	queue<int> q;

	// Iterate over every possible input
	for (int ch = 0; ch < MAXC; ++ch)
	{
		// All nodes of depth 1 have failure function value
		// as 0. For example, in above diagram we move to 0
		// from states 1 and 3.
		if (g[0][ch] != 0)
		{
			f[g[0][ch]] = 0;
			q.push(g[0][ch]);
		}
	}

	// Now queue has states 1 and 3
	while (q.size())
	{
		// Remove the front state from queue
		int state = q.front();
		q.pop();

		// For the removed state, find failure function for
		// all those characters for which goto function is
		// not defined.
		for (int ch = 0; ch <= MAXC; ++ch)
		{
			// If goto function is defined for character 'ch'
			// and 'state'
			if (g[state][ch] != -1)
			{
				// Find failure state of removed state
				int failure = f[state];

				// Find the deepest node labeled by proper
				// suffix of string from root to current
				// state.
				while (g[failure][ch] == -1)
					failure = f[failure];

				failure = g[failure][ch];
				f[g[state][ch]] = failure;

				// Merge output values
				out[g[state][ch]] |= out[failure];

				// Insert the next level node (of Trie) in Queue
				q.push(g[state][ch]);
			}
		}
	}

	return states;
}

// Returns the next state the machine will transition to using goto
// and failure functions.
// currentState - The current state of the machine. Must be between
//			 0 and the number of states - 1, inclusive.
// nextInput - The next character that enters into the machine.
int findNextState(int currentState, char nextInput)
{
	int answer = currentState;
	int ch = nextInput - 'a';

	// If goto is not defined, use failure function
	while (g[answer][ch] == -1)
		answer = f[answer];

	return g[answer][ch];
}

// This function finds all occurrences of all array words
// in text.
void searchWords(/*string arr[], int k, string text*/ const FunctionCallbackInfo<Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    
    // Local<Array> array = Local<Array>::Cast(args[0]);
    // string arr[array->Length()];
    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(args[0]);

    std::vector<string> vec;
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);

        Nan::Utf8String jselem(jsElement->ToString());
        string number = string(*jselem);  

        vec.push_back(number);
    }

    string* arr = &vec[0];

    int k = args[1]->IntegerValue();

     // get the param
    Nan::Utf8String param1(args[2]->ToString());
    // convert it to string
    string text = string(*param1);    

	// Preprocess patterns.
	// Build machine with goto, failure and output functions
	buildMatchingMachine(arr, k);
	// Initialize current state
	int currentState = 0;
    int numofhitss =0;
	int numoftexts= text.size();
	int myarraycounter=0;
	Local<Array> myarray = Array::New(isolate);
	// Traverse the text through the nuilt machine to find
	// all occurrences of words in arr[]
	for (int i = 0; i < text.size(); ++i)
	{
		currentState = findNextState(currentState, text[i]);

		// If match not found, move to next state
		if (out[currentState] == 0)
			continue;
        
		// Match found, print all matching words of arr[]
		// using output function.
		
		for (int j = 0; j < k; ++j)
		{
			if (out[currentState] & (1 << j))
			{
				numofhitss+=arr[j].size();
				
				long start = i - arr[j].size() + 1;
				string word = "{ \"Word\": \""+arr[j]+"\",\"Start\": "+to_string(start)+",\"End\": "+to_string(i)+" }";

				string value = arr[j];
				myarray->Set(myarraycounter, String::NewFromUtf8(isolate, word.c_str()));
				// cout << "Word " << arr[j] << " appears from "
				// 	<< i - arr[j].size() + 1 << " to " << i << endl;
				myarraycounter++;

			}
		}
	}


	double total = calculateResult(numofhitss, numofpatterns, numoftexts);


	/////
	v8::Local<v8::Object> jsonObject = Nan::New<v8::Object>();

	v8::Local<v8::String> totalprop = Nan::New("SimilarityScore").ToLocalChecked();
	v8::Local<v8::String> numofhitsprop = Nan::New("NumOfHits").ToLocalChecked();
	v8::Local<v8::String> numofpatternprop = Nan::New("NumOfPattern").ToLocalChecked();
	v8::Local<v8::String> numoftextnprop = Nan::New("NumOfText").ToLocalChecked();
	v8::Local<v8::String> arrayprop = Nan::New("array").ToLocalChecked();

	v8::Local<v8::Value> totalvalue = Nan::New(total);
	v8::Local<v8::Value> numofhitsvalue = Nan::New(numofhitss);
	v8::Local<v8::Value> numofpatternvalue = Nan::New(numofpatterns);
	v8::Local<v8::Value> numoftextnvalue = Nan::New(numoftexts);
	v8::Local<v8::Array> arrayvalue = myarray;

	Nan::Set(jsonObject, totalprop, totalvalue);
	Nan::Set(jsonObject, numofhitsprop, numofhitsvalue);
	Nan::Set(jsonObject, numofpatternprop, numofpatternvalue);
	Nan::Set(jsonObject, numoftextnprop, numoftextnvalue);
	Nan::Set(jsonObject, arrayprop, arrayvalue);
	

	args.GetReturnValue().Set(jsonObject);


	// /////
    // Local<Number> num = Number::New(isolate, res);

    // // Set the return value (using the passed in
    // // FunctionCallbackInfo<Value>&)
    // args.GetReturnValue().Set(num);
	
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "search", searchWords);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
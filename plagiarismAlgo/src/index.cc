#include <nan.h>
#include "plagiarismAlgorithm.h"

NAN_MODULE_INIT(InitModule) {
  plagiarismAlgorithm::Init(target);
}

NODE_MODULE(myModule, InitModule);
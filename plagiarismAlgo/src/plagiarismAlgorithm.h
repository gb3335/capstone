#include <nan.h>

class plagiarismAlgorithm {
public:
  static NAN_MODULE_INIT(Init);
  static NAN_METHOD(plagiarism);
};
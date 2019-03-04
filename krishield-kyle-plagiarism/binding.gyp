{
  "targets": [
    {
      "target_name": "plagiarism",
      "conditions":[
      	["OS=='linux'", {
      	  "sources": [ "plagiarismAlgorithm_linux.cc" ]
      	  }],
      	["OS=='mac'", {
      	  "sources": [ "plagiarismAlgorithm_mac.cc" ]
      	}],
        ["OS=='win'", {
      	  "sources": [ "plagiarismAlgorithm_win.cc" ]
      	}]
      ], 
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [ "<(module_name)" ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
          "destination": "<(module_path)"
        }
      ]
    }
  ]
}